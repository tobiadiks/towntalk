import {ActionType} from '../actions';
const InitialCalState = {
  calculator: 0,
  userImage: '',
};

export default (state = InitialCalState, {type, payload}) => {
  switch (type) {
    case ActionType.CAL_ADD: {
      return {
        ...state,
        calculator: state.calculator + 1,
      };
    }
    case ActionType.CAL_SUB: {
      return {
        ...state,
        calculator: state.calculator - 1,
      };
    }
    case ActionType.USERIMAGE: {
      return {
        ...state,
        userImage: payload,
      };
    }
    case ActionType.CAL_APPEND: {
      return {
        ...state,
        calculator: state.calculator + parseInt(payload),
      };
    }
    case ActionType.CAL_DIFF: {
      return {
        ...state,
        calculator: state.calculator - parseInt(payload),
      };
    }
    default:
      return state;
  }
};
