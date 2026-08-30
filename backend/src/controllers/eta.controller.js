const etaService = require('../services/eta.service');

exports.getTrainEta = async (req, res, next) => {
  try {
    const etaData = await etaService.calculateETA(req.params.trainId);
    res.json({ success: true, data: etaData });
  } catch (error) { next(error); }
};
