import {
  SET_ERRORS,
  CLEAR_ERRORS,
  LOADING_UI,
  STOP_UI_LOAD,
  SET_UNAUTHENTICATED,
} from "../types";

const INITIAL_STATE = {
  loading: false,
  errors: "",
};

export default function (state = INITIAL_STATE, action) {
  switch (action.type) {
    //Set errors, eg: for login, to be displayed in UI (Errors which are received from requests made inside redux actions)
    case SET_ERRORS:
      return {
        ...state,
        loading: false,
        errors: action.payload,
      };
    case CLEAR_ERRORS:
      return {
        ...state,
        errors: "",
      };

    //👇Set spinners running whenever a request is loading
    case LOADING_UI:
      return {
        ...state,
        loading: true,
      };
    case STOP_UI_LOAD:
      return {
        ...state,
        loading: false,
      };
    case SET_UNAUTHENTICATED: {
      return INITIAL_STATE;
    }
    default:
      return state;
  }
}
