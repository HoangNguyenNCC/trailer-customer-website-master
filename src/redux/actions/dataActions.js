import {
  SET_ERRORS,
  CLEAR_ERRORS,
  LOADING_UI,
  SET_TRAILERS,
  STOP_UI_LOAD,
  SET_SEARCH,
  SET_FILTER,
  RESET_LIST,
  UPDATE_FILTER,
  SORT_TRAILERS,
  UPDATE_UPSELL,
  SET_BOOKING,
  SET_FEATURED,
} from "../types";
import axios from "axios";

export const searchTrailers = (searchData, history, from, featured) => (
  dispatch
) => {
  dispatch({ type: LOADING_UI });
  console.log("SEARCH", searchData);
  //Reset trailer list, so that trailers dont'show up even before searching and they don't get added up
  dispatch({
    type: SET_TRAILERS,
    payload: [],
  });
  //Save search data
  dispatch({
    type: SET_SEARCH,
    payload: searchData,
  });
  if (from === "home") {
    history.push("/search");
  }
  const { address, ...reqBody } = searchData;
  //Get list of all filters and types from the backend
  const filters = {};
  axios
    .get("/rentalitemfilters")
    .then((res) => {
      console.log("FILTERS", res.data.filtersObj);
      //Attach a selected : boolean property to all objects to store their status
      if (res.data.filtersObj.trailerTypesList) {
        filters.trailerType = res.data.filtersObj.trailerTypesList.map(
          (type) => {
            return {
              ...type,
              selected: false,
            };
          }
        );
      }
      if (res.data.filtersObj.upsellItemTypesList) {
        filters.upsellType = res.data.filtersObj.upsellItemTypesList.map(
          (type) => {
            return {
              ...type,
              selected: false,
            };
          }
        );
      }
      if (res.data.filtersObj.deliveryTypesList) {
        filters.deliveryType = res.data.filtersObj.deliveryTypesList.map(
          (type) => {
            return {
              ...type,
              selected: false,
            };
          }
        );
      }
      let ind = -1;
      if (res.data.filtersObj.trailerModelList) {
        filters.modelType = res.data.filtersObj.trailerModelList.map(
          (type, i) => {
            if (featured === type.name) {
              ind = i;
            }
            return {
              ...type,
              selected: false,
            };
          }
        );
      }
      dispatch({ type: SET_FILTER, payload: filters });
      if (ind > -1) {
        filters["modelType"][ind]["selected"] = true;
      }

      //Search using the searchObj dates and location
      return axios.post("/search", reqBody);
    })
    .then((res) => {
      console.log("TRAILERS", res.data.trailers);
      dispatch({
        type: SET_TRAILERS,
        payload: res.data.trailers,
      });
      if (featured.length > 0) {
        dispatch({ type: UPDATE_FILTER, payload: { filters, count: 1 } });
        dispatch({
          type: SET_FEATURED,
          payload: "",
        });
      }
      dispatch({ type: CLEAR_ERRORS });
      dispatch({ type: STOP_UI_LOAD });
    })
    .catch((err) => {
      console.log(err);
      dispatch({
        type: SET_ERRORS,
        payload: err.response.data.message,
      });
      dispatch({ type: STOP_UI_LOAD });
    });
  // axios.post('/search', reqBody)
  //     .then((res) => {
  //         console.log("TRAILERS",res.data.trailers)
  //         dispatch({
  //             type:SET_TRAILERS,
  //             payload:res.data.trailers
  //         })
  //         dispatch({ type: CLEAR_ERRORS })
  //         return axios.get('/rentalitemfilters')
  //     })
  //     .then(res=>{
  //         console.log("FILTERS",res.data.filtersObj)
  //         const filters={};
  //         if(res.data.filtersObj.trailerTypesList){
  //             filters.trailerType=res.data.filtersObj.trailerTypesList.map(type=>{
  //                 return {
  //                     ...type,
  //                     selected:false
  //                 }
  //             })
  //         }
  //         if(res.data.filtersObj.upsellItemTypesList){
  //             filters.upsellType=res.data.filtersObj.upsellItemTypesList.map(type=>{
  //                 return {
  //                     ...type,
  //                     selected:false
  //                 }
  //             })
  //         }
  //         if(res.data.filtersObj.deliveryTypesList){
  //             filters.deliveryType=res.data.filtersObj.deliveryTypesList.map(type=>{
  //                 return {
  //                     ...type,
  //                     selected:false
  //                 }
  //             })
  //         }
  //         dispatch({type:SET_FILTER,payload:filters})
  //         dispatch({ type: STOP_UI_LOAD })
  //       })
  //     .catch(err => {
  //         console.log(err);
  //         dispatch({
  //             type: SET_ERRORS,
  //             payload: err
  //         })
  //         dispatch({ type: STOP_UI_LOAD })
  //     })
};

export const filterTrailers = ({ filters, count }) => (dispatch) => {
  //Set loading and start filtering trailers
  dispatch({ type: LOADING_UI });
  console.log("COUNT", count);
  if (count === 0) {
    dispatch({ type: RESET_LIST });
  } else {
    dispatch({ type: UPDATE_FILTER, payload: { filters, count } });
  }
  dispatch({ type: STOP_UI_LOAD });
};

export const sortTrailers = (sortObj) => (dispatch) => {
  //Sort trailers using property and order from sortObj
  dispatch({ type: SORT_TRAILERS, payload: sortObj });
};

export const updateUpsellItem = (id, qty) => (dispatch) => {
  //Update quantity of upsell items in card using id and quantity from params
  dispatch({ type: UPDATE_UPSELL, payload: { id, qty } });
};

export const setBooking = (bookingObj) => (dispatch) => {
  dispatch({
    type: SET_BOOKING,
    payload: bookingObj,
  });
};

export const setFeatured = (type) => (dispatch) => {
  dispatch({
    type: SET_FEATURED,
    payload: type,
  });
};
