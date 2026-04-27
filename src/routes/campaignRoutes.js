const { authenticate, authorize } = require('../middleware/auth');
const router = require('express').Router();
const { Campaign, Character, Session } = require('../models');

router.get('/', authenticate, async (req, res, next) => {
  try {
    const campaigns = await Campaign.findAll({
      include: [
        { model: Character, as: 'characters' },
        { model: Session, as: 'sessions' }
      ],
      order: [['createdAt', 'DESC']]
    });

    res.json(campaigns);
  } catch (error) {
    next(error);
  }
});

router.get('/:id', authenticate, async (req, res, next) => {
  try {
    const campaign = await Campaign.findByPk(req.params.id, {
      include: [
        { model: Character, as: 'characters' },
        { model: Session, as: 'sessions' }
      ]
    });

    if (!campaign) {
      return res.status(404).json({ message: 'Campaign not found' });
    }

    res.json(campaign);
  } catch (error) {
    next(error);
  }
});

router.post('/', authenticate, authorize('dm'), async (req, res, next) => {
  try {
    const { name, description = '', setting = '' } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({ message: 'Campaign name is required' });
    }

    const campaign = await Campaign.create({
      name: name.trim(),
      description,
      setting
    });

    res.status(201).json(campaign);
  } catch (error) {
    next(error);
  }
});

router.put('/:id', authenticate, authorize('dm'), async (req, res, next) => {
  try {
    const campaign = await Campaign.findByPk(req.params.id);

    if (!campaign) {
      return res.status(404).json({ message: 'Campaign not found' });
    }

    const { name, description, setting } = req.body;

    if (name !== undefined) {
      if (typeof name !== 'string') {
      return res.status(400).json({ message: 'Campaign name must be a string' });
      }

      if (!name.trim()) {
      return res.status(400).json({ message: 'Campaign name cannot be empty' });
      }
}

    await campaign.update({
      name: name !== undefined ? name.trim() : campaign.name,
      description: description !== undefined ? description : campaign.description,
      setting: setting !== undefined ? setting : campaign.setting
    });

    res.json(campaign);
  } catch (error) {
    next(error);
  }
});

router.delete('/:id', authenticate, authorize('dm'), async (req, res, next) => {
  try {
    const campaign = await Campaign.findByPk(req.params.id);

    if (!campaign) {
      return res.status(404).json({ message: 'Campaign not found' });
    }

    await campaign.destroy();
    res.status(204).send();
  } catch (error) {
    next(error);
  }
});

router.get('/:id/characters', authenticate, async (req, res, next) => {
  try {
    const campaign = await Campaign.findByPk(req.params.id, {
      include: [{ model: Character, as: 'characters' }]
    });

    if (!campaign) {
      return res.status(404).json({ message: 'Campaign not found' });
    }

    res.json(campaign.characters);
  } catch (error) {
    next(error);
  }
});

router.get('/:id/sessions', authenticate, async (req, res, next) => {
  try {
    const campaign = await Campaign.findByPk(req.params.id, {
      include: [{ model: Session, as: 'sessions' }]
    });

    if (!campaign) {
      return res.status(404).json({ message: 'Campaign not found' });
    }

    res.json(campaign.sessions);
  } catch (error) {
    next(error);
  }
});

module.exports = router;