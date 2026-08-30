const DailyTrainState = require('../models/DailyTrainState');
const DelayEvent = require('../models/DelayEvent');
const Train = require('../models/Train');

exports.getSummary = async (req, res, next) => {
  try {
    const { date } = req.query;
    const query = {};
    if (date) query.service_date = date;

    const trainStates = await DailyTrainState.find(query);
    
    let total_trains = trainStates.length;
    let on_time_count = 0;
    let minor_delay_count = 0;
    let significant_delay_count = 0;
    let critical_delay_count = 0;
    let not_reporting_count = 0;

    trainStates.forEach(state => {
      if (state.status === 'NOT_REPORTING') {
        not_reporting_count++;
      } else if (state.current_delay_min <= 5) {
        on_time_count++;
      } else if (state.current_delay_min <= 15) {
        minor_delay_count++;
      } else if (state.current_delay_min <= 45) {
        significant_delay_count++;
      } else {
        critical_delay_count++;
      }
    });

    const delayQuery = {};
    if (date) delayQuery.service_date = date;
    const delayEvents = await DelayEvent.find(delayQuery);
    
    const delay_reasons = {};
    delayEvents.forEach(event => {
      if (!delay_reasons[event.event_type]) {
        delay_reasons[event.event_type] = 0;
      }
      delay_reasons[event.event_type]++;
    });

    res.json({
      success: true,
      data: {
        total_trains,
        on_time_count,
        minor_delay_count,
        significant_delay_count,
        critical_delay_count,
        not_reporting_count,
        delay_reasons
      }
    });
  } catch (error) { next(error); }
};

exports.getTrains = async (req, res, next) => {
  try {
    const { date } = req.query;
    const query = {};
    if (date) query.service_date = date;

    const trainStates = await DailyTrainState.find(query);
    const result = await Promise.all(trainStates.map(async (state) => {
      const train = await Train.findOne({ train_id: state.train_id });
      return {
        train_id: state.train_id,
        train_number: train ? train.train_number : null,
        train_name: train ? train.train_name : null,
        train_type: train ? train.train_type : null,
        status: state.status,
        current_section_id: state.current_section_id,
        previous_section_id: state.previous_section_id,
        next_section_id: state.next_section_id,
        current_delay_min: state.current_delay_min,
        estimated_destination_eta: state.estimated_destination_eta,
        prediction_confidence: state.prediction_confidence,
        last_event_time: state.last_event_time
      };
    }));

    res.json({ success: true, data: result });
  } catch (error) { next(error); }
};
