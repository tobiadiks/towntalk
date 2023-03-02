import {ActionType} from '../actions';
const InitialCalState = {
  isEven: false,
};

export default (state = InitialCalState, {type, payload}) => {
  switch (type) {
    case ActionType.CAL_APPEND: {
      return {
        isEven: payload % 2 === 0,
      };
    }
    default:
      return state;
  }
};
