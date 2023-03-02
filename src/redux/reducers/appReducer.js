import {ActionType} from '../actions';
const InitialAppState = {
  authLoading: false,
  fetchingLoading: false,
};

export default (state = InitialAppState, {type, payload}) => {
  switch (type) {
    case ActionType.AUTH_LOADING: {
      return {
        ...state,
        authLoading: payload,
      };
    }
    case ActionType.FETCHING_LOADING: {
      return {
        ...state,
        fetchingLoading: payload,
      };
    }

    default:
      return state;
  }
};
