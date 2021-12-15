import React, { useEffect } from 'react';
import { Link, useParams, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  Row,
  Col,
  ListGroup,
  Image,
  Form,
  Button,
  Card,
} from 'react-bootstrap';
import Message from '../components/Message';
import { addToCartAction } from '../actions/cartActions';

const CartScreen = ({ history }) => {
  const params = useParams();
  const location = useLocation();
  const dispatch = useDispatch();

  const cart = useSelector((state) => state.cart);
  const { cartItems } = cart;

  const productId = params.id;
  const quantity = location.search
    ? Number(new URLSearchParams(location.search).get('quantity'))
    : 1;

  useEffect(() => {
    if (productId) {
      dispatch(addToCartAction(productId, quantity));
    }
  }, [dispatch, productId, quantity]);

  return <div>Cart</div>;
};

export default CartScreen;
