const router = require('express').Router();
const { Session, Campaign } = require('../models');
const { authenticate, authorize } = require('../middleware/auth');

router.get('/', authenticate, async (req, res, next) => {
  try {
    const sessions = await Session.findAll({
      include: [{ model: Campaign, as: 'campaign', attributes: ['id', 'name'] }],
      order: [['sessionDate', 'DESC']]
    });

    res.json(sessions);
  } catch (error) {
    next(error);
  }
});

router.get('/:id', authenticate, async (req, res, next) => {
  try {
    const session = await Session.findByPk(req.params.id, {
      include: [{ model: Campaign, as: 'campaign', attributes: ['id', 'name'] }]
    });

    if (!session) {
      return res.status(404).json({ message: 'Session not found' });
    }

    res.json(session);
  } catch (error) {
    next(error);
  }
});

router.post('/', authenticate, authorize('dm'), async (req, res, next) => {
  try {
    const { sessionDate, summary, nextSteps = '', campaignId } = req.body;

    if (!sessionDate) {
      return res.status(400).json({ message: 'sessionDate is required' });
    }

    if (!summary || !summary.trim()) {
      return res.status(400).json({ message: 'Summary is required' });
    }

    if (!campaignId) {
      return res.status(400).json({ message: 'campaignId is required' });
    }

    const campaign = await Campaign.findByPk(campaignId);
    if (!campaign) {
      return res.status(400).json({ message: 'Campaign not found' });
    }

    const session = await Session.create({
      sessionDate,
      summary: summary.trim(),
      nextSteps,
      campaignId
    });

    res.status(201).json(session);
  } catch (error) {
    next(error);
  }
});

router.put('/:id', authenticate, authorize('dm'), async (req, res, next) => {
  try {
    const session = await Session.findByPk(req.params.id);

    if (!session) {
      return res.status(404).json({ message: 'Session not found' });
    }

    const { sessionDate, summary, nextSteps, campaignId } = req.body;

    if (summary !== undefined && !summary.trim()) {
      return res.status(400).json({ message: 'Summary cannot be empty' });
    }

    if (campaignId !== undefined) {
      const campaign = await Campaign.findByPk(campaignId);
      if (!campaign) {
        return res.status(400).json({ message: 'Campaign not found' });
      }
    }

    await session.update({
      sessionDate: sessionDate !== undefined ? sessionDate : session.sessionDate,
      summary: summary !== undefined ? summary.trim() : session.summary,
      nextSteps: nextSteps !== undefined ? nextSteps : session.nextSteps,
      campaignId: campaignId !== undefined ? campaignId : session.campaignId
    });

    res.json(session);
  } catch (error) {
    next(error);
  }
});

router.delete('/:id', authenticate, authorize('dm'), async (req, res, next) => {
  try {
    const session = await Session.findByPk(req.params.id);

    if (!session) {
      return res.status(404).json({ message: 'Session not found' });
    }

    await session.destroy();
    res.status(204).send();
  } catch (error) {
    next(error);
  }
});

module.exports = router;