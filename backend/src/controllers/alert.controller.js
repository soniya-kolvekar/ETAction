const alertService = require('../services/alert.service');

exports.getTrainAlerts = async (req, res, next) => {
  try {
    const alerts = await alertService.generateAlerts(req.params.trainId);
    res.json({ success: true, data: { alerts } });
  } catch (error) { next(error); }
};
