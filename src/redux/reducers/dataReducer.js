import {
  SET_TRAILERS,
  SET_SEARCH,
  SET_CART,
  CLEAR_CART,
  SET_FILTER,
  UPDATE_FILTER,
  RESET_LIST,
  SORT_TRAILERS,
  UPDATE_UPSELL,
  SET_BOOKING,
  CLEAR_BOOKING,
  SET_FEATURED,
  SET_UNAUTHENTICATED,
} from "../types";

const INITIAL_STATE = {
  trailers: [], // List of trailers ORIGINALLY fetched by searching
  search: {}, //Search object having location, date range, address etc
  cart: [],
  featured: "",
  filters: [],
  updatedTrailers: [], //Trailers after any filtering or sorting, this is what is used by the search page to display Trailers
  sort: {},
  filterCount: 0, //Number of filters selected
  booking: {},
};

function dynamicsort(property, order) {
  //FUNCTION TO SORT USING A SPECIFIC Property AND Order (ASC or DESC)
  var sort_order = 1;
  if (order === "desc") {
    sort_order = -1;
  }
  return function (a, b) {
    // a should come before b in the sorted order
    if (a[property] < b[property]) {
      return -1 * sort_order;
      // a should come after b in the sorted order
    } else if (a[property] > b[property]) {
      return 1 * sort_order;
      // a and b are the same
    } else {
      return 0 * sort_order;
    }
  };
}

export default function (state = INITIAL_STATE, action) {
  switch (action.type) {
    case SET_TRAILERS:
      return {
        //Set trailers fetched from search and also initialize updatedTrailers with same payload
        ...state,
        trailers: action.payload,
        updatedTrailers: action.payload,
      };
    case SET_SEARCH:
      return {
        //Set Search object to keep track of location,dates etc
        ...state,
        search: action.payload,
      };
    case SET_CART:
      return {
        //Set cart with rentedItems, date, address etc
        ...state,
        cart: action.payload,
      };
    case CLEAR_CART:
      return {
        ...state,
        cart: [],
      };
    case SORT_TRAILERS: {
      /* Sort trailers, payload : 
                {
                    property : which property to sort on,
                    order: ASC or DESC
                }
            */

      if (action.payload.property === "same" && state.sort !== {}) {
        return {
          ...state,
          updatedTrailers: [
            ...state.updatedTrailers.sort(
              dynamicsort(state.property, state.order)
            ),
          ],
        };
      } else if (action.payload.property === "same") {
        return state;
      }
      return {
        ...state,
        updatedTrailers: [
          ...state.updatedTrailers.sort(
            dynamicsort(action.payload.property, action.payload.order)
          ),
        ],
      };
    }
    case SET_FILTER:
      return {
        // Initially set filters from /rentalitemtypes request
        ...state,
        filters: action.payload,
        filterCount: 0,
      };
    case UPDATE_FILTER: {
      //Whenever a filter option is clicked on
      const count = action.payload.count; //Count of number of filters totally selected
      if (count === 0) {
        return {
          ...state,
          updatedTrailers: state.trailers,
        };
      }
      let filtered = false;
      const trailers = state.trailers;
      const filters = action.payload.filters;
      let trailerFilter = [];
      console.log("UPDATING", trailers, filters);
      //Filter trailer based on trailer type
      filters.trailerType.forEach((type) => {
        if (type.selected) {
          console.log("FILTER TRAILER TYPE");
          filtered = true;
          const list = trailers.filter((trailer) => {
            console.log(trailer.type, type.code);
            return trailer.type === type.code;
          });
          trailerFilter = [...trailerFilter, ...list];
          console.log(trailerFilter);
        }
      });
      console.log(trailerFilter);
      let hit = false;
      //Filter trailer based on upsell item type
      let upsellList = [];
      trailerFilter = filtered ? trailerFilter : trailers;
      filters.upsellType.forEach((type) => {
        if (type.selected) {
          let list;
          hit = true;
          filtered = true;
          list = trailerFilter.filter(
            (trailer) =>
              trailer.upsellItems.find(
                (upsell) => upsell.type === type.code
              ) !== undefined
          );
          upsellList = [...upsellList, ...list];
        }
      });
      if (hit) trailerFilter = [...upsellList];
      trailerFilter = filtered ? trailerFilter : trailers;
      let modelList = [];
      hit = false;
      filters.modelType.forEach((type) => {
        if (type.selected) {
          hit = true;
          const list = trailerFilter.filter(
            (trailer) => trailer.name === type.name
          );
          modelList = [...modelList, ...list];
        }
      });
      if (hit) trailerFilter = [...modelList];
      return {
        ...state,
        updatedTrailers: [...trailerFilter],
        filters: action.payload.filters,
        filterCount: count,
      };
    }
    //Reset (when no filters selected)
    case RESET_LIST:
      return {
        ...state,
        updatedTrailers: state.trailers,
      };

    case SET_BOOKING:
      return {
        ...state,
        booking: action.payload,
      };

    case CLEAR_BOOKING:
      return {
        ...state,
        booking: {},
      };
    //
    case UPDATE_UPSELL:
      //Update upsell items in cart whenever someone modifies an amount in the Upsell item Carousel
      const items = state.cart.rentedItems;
      for (let i = 0; i < items.length; i++) {
        if (items[i].itemId === action.payload.id) {
          items[i].units = action.payload.qty;
          break;
        }
      }
      return {
        ...state,
        cart: {
          ...state.cart,
          rentedItems: items,
        },
      };

    case SET_FEATURED:
      return {
        ...state,
        featured: action.payload,
      };

    case SET_UNAUTHENTICATED: {
      return INITIAL_STATE;
    }

    default:
      return state;
  }
}
