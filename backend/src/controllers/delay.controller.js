const DelayEvent = require('../models/DelayEvent');

exports.getTrainDelays = async (req, res, next) => {
  try {
    const { date } = req.query;
    const query = { train_id: req.params.trainId };
    if (date) query.service_date = date;
    
    const delays = await DelayEvent.find(query);
    res.json({ success: true, data: delays });
  } catch (error) { next(error); }
};

exports.getTrainDelayAnalysis = async (req, res, next) => {
  try {
    const { date } = req.query;
    const query = { train_id: req.params.trainId };
    if (date) query.service_date = date;
    
    const delays = await DelayEvent.find(query);
    // Simple aggregation for phase 4
    let totalDelay = 0;
    const reasons = delays.map(d => {
      totalDelay += (d.delay_minutes || 0);
      return {
        type: d.event_type,
        delay_minutes: d.delay_minutes,
        severity: d.severity,
        section_id: d.section_id,
        description: d.description
      };
    });
    
    // Determine primary reason based on max delay
    let primaryReason = null;
    if (reasons.length > 0) {
      primaryReason = reasons.reduce((prev, current) => (prev.delay_minutes > current.delay_minutes) ? prev : current);
    }

    res.json({
      success: true,
      data: {
        current_delay_min: totalDelay, // Note: The prompt also said to use daily_train_state.current_delay_min, we can blend that later
        primary_reason: primaryReason ? primaryReason.type : null,
        reasons
      }
    });
  } catch (error) { next(error); }
};
