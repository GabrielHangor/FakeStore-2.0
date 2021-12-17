export const CART_ADD_ITEM = 'CART_ADD_ITEM';
export const CART_REMOVE_ITEM = 'CART_REMOVE_ITEM';

export const cartReducer = (state = { cartItems: [] }, action) => {
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

    default:
      return state;
  }
};
