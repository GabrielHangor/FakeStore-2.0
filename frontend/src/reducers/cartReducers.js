const CART_ADD_ITEM = 'CART_ADD_ITEM';

export const cartReducer = (state = { cartItems: [] }, action) => {
  switch (action.type) {
    case CART_ADD_ITEM:
      const existItem = state.cartItems.find(
        (x) => x.product === action.payload.product
      );

      if (existItem) {
        return {
          ...state,
          cartItems: state.cartItems.map((el) =>
            el.product === existItem.product ? action.payload : el
          ),
        };
      } else {
        return { ...state, cartItems: [...state.cartItems, action.payload] };
      }

    default:
      return state;
  }
};
