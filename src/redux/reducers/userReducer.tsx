import {ActionType} from '../actions';
const InitialCalState = {
  isLoggedIn: false,
  verified: false,
  userData: {},
  token: '',
  userImage: '',
  fcmtoken: '',
  iEmail: '',
  checked: false,
  passwoord: '',
  notificationSymbol: false,
  darkmode: false,
  tog: false,
  ToggleSwitch: false,
  Lat: 0,
  Long: 0,
  CityAdd: [],
};

export default (state = InitialCalState, {type, payload}) => {
  switch (type) {
    case ActionType.USERLOGGED: {
      // console.log('hhhh', 'Why m i calling');
      return {
        ...state,
        isLoggedIn: true,
        userData: {...payload},
      };
    }
    case ActionType.CITYADD: {
      console.log('reducer payload', payload);
      return {...state, CityAdd: [...state.CityAdd, payload]};
    }
    case ActionType.VERIFY: {
      return {
        ...state,
        verified: true,
      };
    }
    case ActionType.IEMAIL: {
      return {...state, iEmail: payload};
    }
    case ActionType.LAT: {
      return {
        ...state,
        Lat: payload,
      };
    }
    case ActionType.DARKMODE: {
      return {...state, darkmode: !state.darkmode};
    }
    case ActionType.LONG: {
      return {
        ...state,
        Long: payload,
      };
    }
    case ActionType.TOGGLE: {
      return {
        ...state,
        tog: !state.tog,
      };
    }
    case ActionType.TOGGLESWITCH: {
      return {
        ...state,
        ToToggleSwitch: !state.ToggleSwitch,
      };
    }
    case ActionType.LOGOUT: {
      return {
        ...state,
        isLoggedIn: payload,
      };
    }
    case ActionType.UPDATE: {
      return {
        ...state,
        userData: {...payload},
      };
    }
    case ActionType.FCM: {
      //console.log('avc', fcmtoken);
      return {
        ...state,
        fcmtoken: payload,
      };
    }
    case ActionType.SAVEPASSWORD: {
      return {
        ...state,
        passwoord: payload,
      };
    }
    case ActionType.REMEMBER: {
      return {
        ...state,
        checked: payload,
      };
    }
    case ActionType.NOTIFICATIONALERT: {
      // console.log("true,false",notificationSymbol);
      return {
        ...state,
        notificationSymbol: payload,
      };
    }
    default:
      return state;
  }
};
