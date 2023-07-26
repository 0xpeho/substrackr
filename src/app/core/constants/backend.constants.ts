export const BASE_URL='http://10.2.46.169:3000'
//export const BASE_URL='http://localhost:3000'
export const SUBS_URL =
  BASE_URL+'/subscriptions';
export const CATEGORY_URL =
  BASE_URL+'/category';
export const CATEGORY_TOTAL_URL =(from:string,to:string)=>{
  return `${CATEGORY_URL}/categories-totals?from=${from}&to=${to}`;
}
export const SUBS_TIMEFRAME_URL =(from?:string,to?:string)=> {
  return `${SUBS_URL}/timeframe?from=${from}&to=${to}`
}
export const SUBS_GETBYID_URL =
  BASE_URL+'/subscriptions/get';
export const EXPENSES=(from:string,to:string)=>{
  return `${SUBS_URL}/subscription-expenses?from=${from}&to=${to}`;
}
export const ALL_TIME_EXPENSES=
  SUBS_URL+'/all-time-expenses'
export const AUTH_URL=
  BASE_URL+'/auth';
export const SIGN_IN_URL=
  AUTH_URL+'/signIn';
export const SIGN_UP_URL=
  AUTH_URL+'/signup';
export const GUEST_LOGIN_URL=
  AUTH_URL+'/guest-login';
export const VERIFY_TOKEN_URL=
  AUTH_URL+'/verify';
export const USER_URL=
  BASE_URL+'/user'
export const SIGN_UP_FROM_GUEST=
  USER_URL+'/signup-from-guest'
export const PUSH_URL=
  USER_URL+'/push'
export const ENABLE_PUSH=
  PUSH_URL+'/enable'
export const DISABLE_PUSH=
  PUSH_URL+'/disable'

export const SETTINGS_URL=
  BASE_URL+'/settings'
