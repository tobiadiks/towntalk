//=======================================================Action Types Constants
const USER_AUTHORIZE = 'USER_SIGN_IN',
  USER_LOGOUT = 'USER_LOGOUT',
  FETCHING_LOADING = 'FETCHING_LOADING',
  REGISTER_FOR_LINKEDIN = 'REGISTER_FOR_LINKEDIN',
  USER_REFRESH = 'USER_REFRESH',
  CAL_ADD = 'CAL_ADD',
  CAL_SUB = 'CAL_SUB',
  CAL_APPEND = 'CAL_APPEND',
  USERIMAGE = 'USERIMAGE',
  CAL_DIFF = 'CAL_DIFF',
  CAL_CART = 'CAL_CART',
  CARTITEMUPDATE = 'CARTITEMUPDATE',
  PRODUCTINC = 'PRODUCTINC',
  PRODUCTDEC = 'PRODUCTDEC',
  USERLOGGED = 'USERLOGGED',
  SELECTEDUSER = 'SELECTEDUSER',
  USERDATA = 'USERDATA',
  LOGOUT = 'LOGOUT',
  ADDHORSE = 'ADDHORSE',
  IEMAIL = 'IEMAIL',
  ALARMMORNING = 'ALARMMORNING',
  ALARMAFTERNOON = 'ALARMAFTERNOON',
  ALARMEVENING = 'ALARMEVENING',
  ALARMNIGHT = 'ALARMNIGHT',
  UPDATE = 'UPDATE',
  FCM = 'FCM',
  LAT = 'LAT',
  LONG = 'LONG',
  VERIFY = 'VERIFY',
  SAVEPASSWORD = 'SAVEPASSWORD',
  TOGGLESWITCH = 'TOGGLESWITCH',
  REMEMBER = 'REMEMBER',
  NOTIFICATIONALERT = 'NOTIFICATIONALERT',
  TOGGLE = 'TOOGLE',
  CITYADD = 'CITYADD',
  DARKMODE = 'DARKMODE';
//========================================================Dispatchers
const userAuthorize = payload => async dispatch => {
  dispatch({type: USER_AUTHORIZE, payload});
  return '';
};
const userRefresh = payload => dispatch => {
  dispatch({type: USER_REFRESH, payload});
};
const userLKAuthorize = payload => dispatch => {
  dispatch({type: REGISTER_FOR_LINKEDIN, payload});
};
const lat = payload => dispatch => {
  dispatch({type: LAT, payload});
};
const long = payload => dispatch => {
  dispatch({type: LONG, payload});
};
const iphoneEmail = payload => dispatch => {
  dispatch({type: IEMAIL, payload});
};
const cityAdd = payload => dispatch => {
  console.log('payload', payload);
  dispatch({type: CITYADD, payload});
};
const toggleSwitch = () => dispatch => {
  dispatch({type: TOGGLESWITCH});
};
const darkMode = () => dispatch => {
  dispatch({type: DARKMODE});
};
const logout = () => dispatch => {
  dispatch({type: USER_LOGOUT});
};
const toggle = () => dispatch => {
  dispatch({type: TOGGLE});
};
const setLoader = payload => dispatch => {
  dispatch({type: FETCHING_LOADING, payload});
};
const add = () => dispatch => {
  dispatch({type: CAL_ADD});
};
const sub = () => dispatch => {
  dispatch({type: CAL_SUB});
};
const append = payload => dispatch => {
  dispatch({type: CAL_APPEND, payload});
};
const diff = payload => dispatch => {
  dispatch({type: CAL_DIFF, payload});
};
const cart = payload => dispatch => {
  dispatch({type: CAL_CART, payload});
};
const cartItemUpdate = payload => dispatch => {
  dispatch({type: CARTITEMUPDATE, payload});
};
const increament = payload => dispatch => {
  dispatch({type: PRODUCTINC, payload});
};
const decrement = payload => dispatch => {
  dispatch({type: PRODUCTDEC, payload});
};
const logged = payload => dispatch => {
  dispatch({type: USERLOGGED, payload});
};
const logoutuser = payload => dispatch => {
  dispatch({type: LOGOUT, payload});
};
const selecteduser = payload => dispatch => {
  dispatch({type: SELECTEDUSER, payload});
};
const addhorse = payload => dispatch => {
  // console.log('payload inside action', payload);
  dispatch({type: ADDHORSE, payload});
};
const alarmmorning = payload => dispatch => {
  dispatch({type: ALARMMORNING, payload});
};
const alarmafternoon = payload => dispatch => {
  dispatch({type: ALARMAFTERNOON, payload});
};
const alarmevening = payload => dispatch => {
  dispatch({type: ALARMEVENING, payload});
};
const alarmnight = payload => dispatch => {
  console.log('i called');
  dispatch({type: ALARMNIGHT, payload});
};
const userdata = payload => dispatch => {
  dispatch({type: USERDATA, payload});
};
const update = payload => dispatch => {
  dispatch({type: UPDATE, payload});
};
const verify = payload => dispatch => {
  dispatch({type: VERIFY, payload});
};
const images = payload => dispatch => {
  dispatch({type: USERIMAGE, payload});
};
const fcm = payload => dispatch => dispatch({type: FCM, payload});
const savepassword = payload => dispatch => {
  dispatch({type: SAVEPASSWORD, payload});
};
const remember = payload => dispatch => {
  dispatch({type: REMEMBER, payload});
};
const notificationAlert = payload => dispatch => {
  dispatch({type: NOTIFICATIONALERT, payload});
};
//========================================================Exporter
const ActionType = {
  FETCHING_LOADING,
  USER_REFRESH,
  USER_LOGOUT,
  USER_AUTHORIZE,
  CITYADD,
  REGISTER_FOR_LINKEDIN,
  CAL_SUB,
  LAT,
  LONG,
  CAL_ADD,
  CAL_APPEND,
  IEMAIL,
  CAL_DIFF,
  CAL_CART,
  USERIMAGE,
  CARTITEMUPDATE,
  TOGGLESWITCH,
  TOGGLE,
  PRODUCTINC,
  PRODUCTDEC,
  USERLOGGED,
  DARKMODE,
  LOGOUT,
  USERDATA,
  SELECTEDUSER,
  ADDHORSE,
  ALARMMORNING,
  ALARMAFTERNOON,
  ALARMEVENING,
  ALARMNIGHT,
  UPDATE,
  FCM,
  VERIFY,
  REMEMBER,
  SAVEPASSWORD,
  NOTIFICATIONALERT,
};
export {
  ActionType,
  userLKAuthorize,
  logout,
  setLoader,
  userAuthorize,
  userRefresh,
  add,
  lat,
  long,
  images,
  sub,
  append,
  diff,
  iphoneEmail,
  cart,
  darkMode,
  verify,
  cartItemUpdate,
  increament,
  toggleSwitch,
  decrement,
  logged,
  logoutuser,
  cityAdd,
  toggle,
  userdata,
  selecteduser,
  addhorse,
  alarmmorning,
  alarmafternoon,
  alarmevening,
  alarmnight,
  update,
  fcm,
  savepassword,
  remember,
  notificationAlert,
};
