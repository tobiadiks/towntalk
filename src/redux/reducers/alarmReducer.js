import {ActionType} from '../actions';
const InitialAlarmState = {
  Morning: [],
  Afternoon: [],
  Evening: [],
  Night: [],
};
export default (state = InitialAlarmState, {type, payload}) => {
  switch (type) {
    case ActionType.ALARMMORNING: {
      return {...state, Morning: [...state.Morning, ...payload]};
    }
    case ActionType.ALARMAFTERNOON: {
      return {...state, Afternoon: [...state.Afternoon, ...payload]};
    }
    case ActionType.ALARMEVENING: {
      return {...state, Evening: [...state.Evening, ...payload]};
    }
    case ActionType.ALARMNIGHT: {
      // console.log('me too');
      return {...state, Night: [...state.Night, ...payload]};
    }
    default:
      return state;
  }
};
