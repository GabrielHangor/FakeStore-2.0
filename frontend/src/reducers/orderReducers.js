export const ORDER_CREATE_REQUEST = 'ORDER_CREATE_REQUEST';
export const ORDER_CREATE_SUCCESS = 'ORDER_CREATE_SUCCESS';
export const ORDER_CREATE_FAIL = 'ORDER_CREATE_FAIL';
export const ORDER_CREATE_CLEAN_ERROR = 'ORDER_CREATE_CLEAN_ERROR';
export const ORDER_CREATE_CLEAN_SUCCESS = 'ORDER_CREATE_CLEAN_SUCCESS';

export const ORDER_DETAILS_REQUEST = 'ORDER_DETAILS_REQUEST';
export const ORDER_DETAILS_SUCCESS = 'ORDER_DETAILS_SUCCESS';
export const ORDER_DETAILS_FAIL = 'ORDER_DETAILS_FAIL';

export const orderCreateReducer = (state = {}, action) => {
  switch (action.type) {
    case ORDER_CREATE_REQUEST:
      return { loading: true };
    case ORDER_CREATE_SUCCESS:
      return { loading: false, success: true, order: action.payload };
    case ORDER_CREATE_FAIL:
      return { loading: false, error: action.payload };
    case ORDER_CREATE_CLEAN_ERROR:
      return { ...state, error: null };
    case ORDER_CREATE_CLEAN_SUCCESS:
      return { ...state, success: null };
    default:
      return state;
  }
};

export const orderDetailsReducer = (
  state = { loading: true, orderItems: [], shippingAddress: {} },
  action
) => {
  switch (action.type) {
    case ORDER_DETAILS_REQUEST:
      return { ...state, loading: true };
    case ORDER_DETAILS_SUCCESS:
      return { loading: false, order: action.payload };
    case ORDER_DETAILS_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};
