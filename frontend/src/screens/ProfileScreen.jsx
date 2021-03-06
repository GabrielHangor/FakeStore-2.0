import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Button, Row, Col, Table } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import Message from './../components/Message';
import Loader from './../components/Loader';
import {
  getUserDetailsAction,
  updateUserProfileAction,
} from '../actions/userActions';
import { listOrdersAction } from '../actions/orderActions';
import { USER_UPDATE_PROFILE_RESET } from './../reducers/userReducers';

const ProfileScreen = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState(null);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const userDetails = useSelector((state) => state.userDetails);
  const { error, user } = userDetails;

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const orderList = useSelector((state) => state.orderList);
  const { loading: loadingOrders, error: errorOrders, orders } = orderList;

  const userUpdateProfile = useSelector((state) => state.userUpdateProfile);
  const { loading, success } = userUpdateProfile;

  useEffect(() => {
    if (!userInfo) navigate('/login');

    if (!user || !user.name) {
      dispatch(getUserDetailsAction('profile'));
    } else {
      setName(user.name);
      setEmail(user.email);
    }

    dispatch(listOrdersAction());
  }, [userInfo, user, dispatch, navigate]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (success) {
        dispatch({ type: USER_UPDATE_PROFILE_RESET });
      }
    }, 3000);

    // refactor later
    if (success) {
      dispatch(getUserDetailsAction('profile'));
      setName(user.name);
      setEmail(user.email);
    }

    return () => clearTimeout(timer);
  }, [success, dispatch]);

  const submitHandler = (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setMessage('???????????? ???? ??????????????????');
      setTimeout(() => setMessage(null), 3000);
    } else {
      dispatch(
        updateUserProfileAction({ id: user._id, name, email, password })
      );
    }
  };

  return (
    <Row>
      <Col md={3}>
        <h1>??????????????</h1>
        {message && <Message variant="danger">{message}</Message>}
        {error && <Message variant="danger">{error}</Message>}
        {success && (
          <Message variant="success">???????????? ?????????????? ??????????????????</Message>
        )}
        {loading ? (
          <Loader />
        ) : (
          <Form onSubmit={submitHandler}>
            <Form.Group controlId="name">
              <Form.Label>??????????</Form.Label>
              <Form.Control
                required
                className="mb-2"
                type="name"
                placeholder="?????????????? ??????????"
                value={name}
                onChange={(e) => setName(e.target.value)}
              ></Form.Control>
            </Form.Group>

            <Form.Group controlId="email">
              <Form.Label>?????????????????????? ??????????</Form.Label>
              <Form.Control
                className="mb-2"
                type="email"
                placeholder="?????????????? ????. ??????????"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              ></Form.Control>
            </Form.Group>

            <Form.Group controlId="password">
              <Form.Label>????????????</Form.Label>
              <Form.Control
                className="mb-2"
                type="password"
                placeholder="?????????????? ?????????? ????????????"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              ></Form.Control>
            </Form.Group>

            <Form.Group controlId="confirmPassword">
              <Form.Label>?????????????????????? ????????????</Form.Label>
              <Form.Control
                className="mb-2"
                type="password"
                placeholder="?????????????????????? ????????????"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              ></Form.Control>
            </Form.Group>

            <Button type="submit" variant="outline-primary">
              ????????????????
            </Button>
          </Form>
        )}
      </Col>

      <Col md={9}>
        <h1>?????? ????????????</h1>
        {loadingOrders ? (
          <Loader />
        ) : errorOrders ? (
          <Message variant="danger">{errorOrders}</Message>
        ) : (
          <Table striped bordered hover responsive className="table-sm">
            <thead>
              <tr>
                <th>??????????</th>
                <th>???????????? ?? ????????????</th>
                <th>??????????????????</th>
                <th>??????????????</th>
                <th>??????????????????</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr className="align-middle" key={order._id}>
                  <td>{order._id}</td>
                  <td>{order.createdAt.substring(0, 10)}</td>
                  <td>{order.totalPrice}</td>
                  <td>
                    {order.isPaid ? (
                      order.paidAt.substring(0, 10)
                    ) : (
                      <i className="fas fa-times" style={{ color: 'red' }}></i>
                    )}
                  </td>
                  <td>
                    {order.isDelivered ? (
                      order.deliveredAt.substring(0, 10)
                    ) : (
                      <i className="fas fa-times" style={{ color: 'red' }}></i>
                    )}
                  </td>
                  <td>
                    <LinkContainer to={`/order/${order._id}`}>
                      <Button
                        className="btn-sm w-100"
                        variant="outline-primary"
                      >
                        ????????????????????
                      </Button>
                    </LinkContainer>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </Col>
    </Row>
  );
};

export default ProfileScreen;
