import {ActionType} from '../actions';
const InitialState = {
  notificationSymbol: false,
};
export default (state = InitialState, {type, payload}) => {
  switch (type) {
    case ActionType.NOTIFICATIONALERT: {
      return {
        ...state,
        notificationSymbol: payload,
      };
    }
    default:
      return state;
  }
};
