import { SET_USER, SET_AUTHENTICATED, SET_UNAUTHENTICATED } from "../types";

const INITIAL_STATE = {
  authenticated: false,
  loading: false,
  user: {},
};

export default function (state = INITIAL_STATE, action) {
  switch (action.type) {
    //Set user as authenticated on signup
    case SET_AUTHENTICATED:
      return {
        ...state,
        authenticated: true,
      };
    //Log out user 👇
    case SET_UNAUTHENTICATED:
      return INITIAL_STATE;

    //Set user profile in store and auth to true
    case SET_USER:
      return {
        authenticated: true,
        loading: false,
        user: action.payload,
      };

    default:
      return state;
  }
}
