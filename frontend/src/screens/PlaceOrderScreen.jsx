import React, { useEffect } from 'react';
import { Button, Row, Col, ListGroup, Image, Card } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import CheckoutSteps from '../components/CheckoutSteps';
import Message from './../components/Message';
import { orderCreateAction } from '../actions/orderActions';
import {
  ORDER_CREATE_CLEAN_ERROR,
  ORDER_CREATE_CLEAN_SUCCESS,
} from '../reducers/orderReducers';
import Loader from '../components/Loader';

const PlaceOrderScreen = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const cart = useSelector((state) => state.cart);

  const orderCreate = useSelector((state) => state.orderCreate);
  const { order, success, loading, error } = orderCreate;

  // Calculate prices
  const itemsPrice = Number(
    cart.cartItems
      .reduce((acc, item) => acc + item.price * item.quantity, 0)
      .toFixed(2)
  );
  const shippingPrice = itemsPrice > 100 ? 0 : 100;
  const taxPrice = Number((0.2 * itemsPrice).toFixed(2));
  const totalPrice = Number((itemsPrice + shippingPrice + taxPrice).toFixed(2));

  useEffect(() => {
    if (success) {
      setTimeout(() => dispatch({ type: ORDER_CREATE_CLEAN_SUCCESS }), 3000);
    }

    if (success) {
      setTimeout(() => navigate(`/order/${order._id}`), 3100);
    }
  }, [success, navigate, order, dispatch]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (error) {
        dispatch({ type: ORDER_CREATE_CLEAN_ERROR });
      }
    }, 3000);

    return () => clearTimeout(timer);
  }, [error, dispatch]);

  const placeOrderHandler = () => {
    dispatch(
      orderCreateAction({
        orderItems: cart.cartItems,
        shippingAddress: cart.shippingAddress,
        paymentMethod: cart.paymentMethod,
        itemsPrice,
        shippingPrice,
        taxPrice,
        totalPrice,
      })
    );
  };

  return (
    <>
      <CheckoutSteps step1 step2 step3 />
      {error && <Message variant="danger">Ошибка: {error}</Message>}
      {success && <Message variant="success">Заказ создан</Message>}
      {loading ? (
        <Loader />
      ) : (
        <Row>
          <Col md={8}>
            <ListGroup variant="flush">
              <ListGroup.Item>
                <h1>Доставка</h1>
                <p>
                  <strong>Адрес: </strong>
                  {cart.shippingAddress.address}, {cart.shippingAddress.city}{' '}
                  {cart.shippingAddress.postalCode},{' '}
                  {cart.shippingAddress.country}
                </p>
              </ListGroup.Item>
              <ListGroup.Item>
                <h1>Способ оплаты</h1>
                <strong> {cart.paymentMethod}</strong>
              </ListGroup.Item>
              <ListGroup.Item>
                <h1>Позиции</h1>
                {cart.cartItems.length === 0 ? (
                  <Message>Корзина пуста</Message>
                ) : (
                  <ListGroup variant="flush">
                    {cart.cartItems.map((item) => (
                      <ListGroup.Item key={item.id}>
                        <Row>
                          <Col md={2} sm={8}>
                            <Link to={`/product/${item.id}`}>
                              <Image
                                src={item.image}
                                alt={item.name}
                                fluid
                                rounded
                              />
                            </Link>
                          </Col>
                          <Col>
                            <Link to={`/product/${item.id}`}>{item.name}</Link>
                          </Col>
                          <Col md={4}>
                            {item.quantity} x ${item.price} = $
                            {item.quantity * item.price}
                          </Col>
                        </Row>
                      </ListGroup.Item>
                    ))}
                  </ListGroup>
                )}
              </ListGroup.Item>
            </ListGroup>
          </Col>

          <Col md={4}>
            <Card>
              <ListGroup variant="flush">
                <ListGroup.Item>
                  <h1>Общая стоимость</h1>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Row>
                    <Col>Позиции</Col>
                    <Col>${itemsPrice}</Col>
                  </Row>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Row>
                    <Col>Доставка</Col>
                    <Col>${shippingPrice}</Col>
                  </Row>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Row>
                    <Col>Налог 20%</Col>
                    <Col>${taxPrice}</Col>
                  </Row>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Row>
                    <Col>
                      <strong>Сумма</strong>
                    </Col>
                    <Col>${totalPrice}</Col>
                  </Row>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Button
                    type="button"
                    className="w-100"
                    disabled={cart.cartItems.length === 0 || success}
                    onClick={placeOrderHandler}
                  >
                    Разместить заказ
                  </Button>
                </ListGroup.Item>
              </ListGroup>
            </Card>
          </Col>
        </Row>
      )}
    </>
  );
};

export default PlaceOrderScreen;
