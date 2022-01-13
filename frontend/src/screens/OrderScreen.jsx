import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Row, Col, ListGroup, Image, Card } from 'react-bootstrap';
import { PayPalButton } from 'react-paypal-button-v2';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useParams } from 'react-router-dom';
import Message from './../components/Message';
import { getOrderDetailsAction, payOrderAction } from '../actions/orderActions';
import Loader from '../components/Loader';
import {
  ORDER_DETAILS_RESET,
  ORDER_PAY_RESET,
} from '../reducers/orderReducers';

const OrderScreen = () => {
  const dispatch = useDispatch();
  // const navigate = useNavigate();
  const params = useParams();

  const [sdkReady, setSdkReady] = useState(false);

  const orderDetails = useSelector((state) => state.orderDetails);
  const { order, loading, error } = orderDetails;

  const orderPay = useSelector((state) => state.orderPay);
  const { success, loading: loadingPay } = orderPay;

  useEffect(() => {
    const addPayPalScript = async () => {
      const { data: clientId } = await axios.get('/api/config/paypal');
      const script = document.createElement('script');
      script.type = 'text/javascript';
      script.src = `https://www.paypal.com/sdk/js?client-id=${clientId}`;
      script.async = true;
      script.onload = () => setSdkReady(true);
      document.body.appendChild(script);
    };

    if (!order || success) {
      dispatch({ type: ORDER_PAY_RESET });
      dispatch(getOrderDetailsAction(params.id));
    } else if (!order.isPaid) {
      !window.paypal ? addPayPalScript() : setSdkReady(true);
    }
  }, [dispatch, params.id, success, order]);

  // useEffect(() => {
  //   if (!order || order._id !== params.id) {
  //     dispatch(getOrderDetailsAction(params.id));
  //   }
  // }, [order, params.id, dispatch]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (error) {
        dispatch({ type: ORDER_DETAILS_RESET });
      }
    }, 3000);

    return () => clearTimeout(timer);
  }, [error, dispatch]);

  const successPaymentHandler = (paymentResult) => {
    // console.log(paymentResult);
    dispatch(payOrderAction(params.id, paymentResult));
  };

  return loading ? (
    <Loader />
  ) : error ? (
    <Message variant="danger">{error}</Message>
  ) : (
    <>
      <h1>Заказ {order._id}</h1>
      <Row>
        <Col md={8}>
          <ListGroup variant="flush">
            <ListGroup.Item>
              <h1>Доставка</h1>
              <p>
                <strong>Имя: </strong>
                {order.user.name}
              </p>
              <p>
                <strong>Эл. почта: </strong>
                <a href={`mailto:${order.user.email}`}>{order.user.email}</a>
              </p>
              <p>
                <strong>Адрес: </strong>
                {order.shippingAddress.address}, {order.shippingAddress.city}{' '}
                {order.shippingAddress.postalCode},{' '}
                {order.shippingAddress.country}
              </p>
              {order.isDelivered ? (
                <Message variant="success">
                  Заказ доставлен {order.deliveredAt}
                </Message>
              ) : (
                <Message variant="danger">Заказ не доставлен</Message>
              )}
            </ListGroup.Item>
            <ListGroup.Item>
              <h1>Способ оплаты</h1>
              <p>{order.paymentMethod}</p>
              {order.isPaid ? (
                <Message variant="success">
                  Заказ оплачен {order.paidAt}
                </Message>
              ) : (
                <Message variant="danger">Заказ не оплачен</Message>
              )}
            </ListGroup.Item>
            <ListGroup.Item>
              <h1>Позиции</h1>
              {order.orderItems.length === 0 ? (
                <Message>Корзина пуста</Message>
              ) : (
                <ListGroup variant="flush">
                  {order.orderItems.map((item) => (
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
                  <Col>${order.itemsPrice.toFixed(2)}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Доставка</Col>
                  <Col>${order.shippingPrice.toFixed(2)}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Налог 20%</Col>
                  <Col>${order.taxPrice.toFixed(2)}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>
                    <strong>Сумма</strong>
                  </Col>
                  <Col>${order.totalPrice.toFixed(2)}</Col>
                </Row>
              </ListGroup.Item>
              {!order.isPaid && (
                <ListGroup.Item>
                  {loadingPay && <Loader />}
                  {!sdkReady ? (
                    <Loader />
                  ) : (
                    <PayPalButton
                      amount={order.totalPrice}
                      onSuccess={successPaymentHandler}
                    ></PayPalButton>
                  )}
                </ListGroup.Item>
              )}
            </ListGroup>
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default OrderScreen;
