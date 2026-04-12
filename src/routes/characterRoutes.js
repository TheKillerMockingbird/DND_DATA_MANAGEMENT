const router = require('express').Router();
const { Character, Campaign } = require('../models');

router.get('/', async (req, res, next) => {
  try {
    const characters = await Character.findAll({
      include: [{ model: Campaign, as: 'campaign', attributes: ['id', 'name'] }],
      order: [['createdAt', 'DESC']]
    });

    res.json(characters);
  } catch (error) {
    next(error);
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    const character = await Character.findByPk(req.params.id, {
      include: [{ model: Campaign, as: 'campaign', attributes: ['id', 'name'] }]
    });

    if (!character) {
      return res.status(404).json({ message: 'Character not found' });
    }

    res.json(character);
  } catch (error) {
    next(error);
  }
});

router.post('/', async (req, res, next) => {
  try {
    const { name, characterClass, race = '', level = 1, notes = '', campaignId } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({ message: 'Character name is required' });
    }

    if (!characterClass || !characterClass.trim()) {
      return res.status(400).json({ message: 'Character class is required' });
    }

    if (!campaignId) {
      return res.status(400).json({ message: 'campaignId is required' });
    }

    const campaign = await Campaign.findByPk(campaignId);
    if (!campaign) {
      return res.status(400).json({ message: 'Campaign not found' });
    }

    const character = await Character.create({
      name: name.trim(),
      characterClass: characterClass.trim(),
      race,
      level: Number(level),
      notes,
      campaignId
    });

    res.status(201).json(character);
  } catch (error) {
    next(error);
  }
});

router.put('/:id', async (req, res, next) => {
  try {
    const character = await Character.findByPk(req.params.id);

    if (!character) {
      return res.status(404).json({ message: 'Character not found' });
    }

    const { name, characterClass, race, level, notes, campaignId } = req.body;

    if (name !== undefined && !name.trim()) {
      return res.status(400).json({ message: 'Character name cannot be empty' });
    }

    if (characterClass !== undefined && !characterClass.trim()) {
      return res.status(400).json({ message: 'Character class cannot be empty' });
    }

    if (campaignId !== undefined) {
      const campaign = await Campaign.findByPk(campaignId);
      if (!campaign) {
        return res.status(400).json({ message: 'Campaign not found' });
      }
    }

    await character.update({
      name: name !== undefined ? name.trim() : character.name,
      characterClass: characterClass !== undefined ? characterClass.trim() : character.characterClass,
      race: race !== undefined ? race : character.race,
      level: level !== undefined ? Number(level) : character.level,
      notes: notes !== undefined ? notes : character.notes,
      campaignId: campaignId !== undefined ? campaignId : character.campaignId
    });

    res.json(character);
  } catch (error) {
    next(error);
  }
});

router.delete('/:id', async (req, res, next) => {
  try {
    const character = await Character.findByPk(req.params.id);

    if (!character) {
      return res.status(404).json({ message: 'Character not found' });
    }

    await character.destroy();
    res.status(204).send();
  } catch (error) {
    next(error);
  }
});

module.exports = router;