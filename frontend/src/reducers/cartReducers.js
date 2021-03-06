export const CART_ADD_ITEM = 'CART_ADD_ITEM';
export const CART_REMOVE_ITEM = 'CART_REMOVE_ITEM';

export const CART_SAVE_SHIPPING_ADDRESS = 'CART_SAVE_SHIPPING_ADRESS';
export const CART_SAVE_PAYMENT_METHOD = 'CART_SAVE_PAYMENT_METHOD';
export const CART_RESET = 'CART_RESET';

export const cartReducer = (
  state = { cartItems: [], shippingAddress: {} },
  action
) => {
  switch (action.type) {
    case CART_ADD_ITEM:
      const existItem = state.cartItems.find((x) => x.id === action.payload.id);

      if (existItem) {
        return {
          ...state,
          cartItems: state.cartItems.map((el) =>
            el.id === existItem.id ? action.payload : el
          ),
        };
      } else {
        return { ...state, cartItems: [...state.cartItems, action.payload] };
      }
    case CART_REMOVE_ITEM:
      return {
        ...state,
        cartItems: state.cartItems.filter((item) => item.id !== action.payload),
      };
    case CART_SAVE_SHIPPING_ADDRESS:
      return { ...state, shippingAddress: action.payload };
    case CART_SAVE_PAYMENT_METHOD:
      return { ...state, paymentMethod: action.payload };
    case CART_RESET:
      return { cartItems: [], shippingAddress: {} };
    default:
      return state;
  }
};
