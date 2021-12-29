import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Button, Row, Col } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import Message from './../components/Message';
import Loader from './../components/Loader';
import {
  getUserDetailsAction,
  updateUserProfileAction,
} from '../actions/userActions';
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
      setMessage('Пароли не совпадают');
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
        <h2>Профиль</h2>
        {message && <Message variant="danger">{message}</Message>}
        {error && <Message variant="danger">{error}</Message>}
        {success && (
          <Message variant="success">Данные профиля обновлены</Message>
        )}
        {loading ? (
          <Loader />
        ) : (
          <Form onSubmit={submitHandler}>
            <Form.Group controlId="name">
              <Form.Label>Логин</Form.Label>
              <Form.Control
                required
                className="mb-2"
                type="name"
                placeholder="Введите логин"
                value={name}
                onChange={(e) => setName(e.target.value)}
              ></Form.Control>
            </Form.Group>

            <Form.Group controlId="email">
              <Form.Label>Электронная почта</Form.Label>
              <Form.Control
                className="mb-2"
                type="email"
                placeholder="Введите эл. адрес"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              ></Form.Control>
            </Form.Group>

            <Form.Group controlId="password">
              <Form.Label>Пароль</Form.Label>
              <Form.Control
                className="mb-2"
                type="password"
                placeholder="Введите новый пароль"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              ></Form.Control>
            </Form.Group>

            <Form.Group controlId="confirmPassword">
              <Form.Label>Подтвердите пароль</Form.Label>
              <Form.Control
                className="mb-2"
                type="password"
                placeholder="Подтвердите пароль"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              ></Form.Control>
            </Form.Group>

            <Button type="submit" variant="primary">
              Изменить
            </Button>
          </Form>
        )}
      </Col>

      <Col md={9}>
        <h2>Мои заказы</h2>
      </Col>
    </Row>
  );
};

export default ProfileScreen;
