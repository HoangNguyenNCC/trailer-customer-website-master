import { LOADING_UI } from "redux/types";
import { STOP_UI_LOAD } from "redux/types";
import { CLEAR_ERRORS } from "redux/types";

export const startLoading = () => (dispatch) => {
  dispatch({ type: LOADING_UI });
};

export const stopLoading = () => (dispatch) => {
  dispatch({ type: STOP_UI_LOAD });
};

export const clearErrors = () => (dispatch) => {
  dispatch({ type: CLEAR_ERRORS });
};
