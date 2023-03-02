import {ActionType} from '../actions';
const InitialHorseState = {
  horse: [],
};
export default (state = InitialHorseState, {type, payload}) => {
  // console.log('payload inside reducer', payload);
  switch (type) {
    case ActionType.ADDHORSE: {
      return {...state, horse: [...state.horse, ...payload]};
    }
    default:
      return state;
  }
};
