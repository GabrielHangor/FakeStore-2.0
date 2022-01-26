import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Form, Button, Row, Col } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import Message from './../components/Message';
import Loader from './../components/Loader';
import FormContainer from '../components/FormContainer';
import { loginAction } from '../actions/userActions';
import { USER_LOGOUT } from '../reducers/userReducers';

const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const userLogin = useSelector((state) => state.userLogin);

  const { loading, error, userInfo } = userLogin;

  const redirect = location.search ? location.search.split('=')[1] : '/';

  useEffect(() => {
    if (userInfo) navigate(redirect);
  }, [userInfo, redirect, navigate]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (error) {
        dispatch({ type: USER_LOGOUT });
      }
    }, 3000);

    return () => clearTimeout(timer);
  }, [error, dispatch]);

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(loginAction(email, password));
  };

  return (
    <FormContainer>
      <h1>Авторизация</h1>
      {error && <Message variant="danger">{error}</Message>}
      {loading ? (
        <Loader />
      ) : (
        <Form onSubmit={submitHandler}>
          <Form.Group controlId="email">
            <Form.Label>Электронная почта</Form.Label>
            <Form.Control
              required
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
              required
              className="mb-2"
              type="password"
              placeholder="Введите пароль"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            ></Form.Control>
          </Form.Group>
          <Button type="submit" variant="outline-primary">
            Войти
          </Button>
        </Form>
      )}

      <Row className="py-3">
        <Col>
          Новый пользователь?{' '}
          <Link to={redirect ? `/register?redirect=${redirect}` : '/register'}>
            Зарегистрироваться
          </Link>
        </Col>
      </Row>
    </FormContainer>
  );
};

export default LoginScreen;
