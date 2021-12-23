import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Form, Button, Row, Col } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import Message from './../components/Message';
import Loader from './../components/Loader';
import FormContainer from '../components/FormContainer';
import { registerAction } from '../actions/userActions';
import { USER_LOGOUT } from '../reducers/userReducers';

const RegisterScreen = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState(null);

  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const userRegister = useSelector((state) => state.userRegister);

  const { loading, error, userInfo } = userRegister;

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
    if (password !== confirmPassword) {
      setMessage('Пароли не совпадают');
      setTimeout(() => setMessage(null), 3000);
    } else {
      dispatch(registerAction(name, email, password));
    }
  };

  return (
    <FormContainer>
      <h1>Регистрация</h1>
      {message && <Message variant="danger">{message}</Message>}
      {error && <Message variant="danger">{error}</Message>}
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

          <Form.Group controlId="confirmPassword">
            <Form.Label>Подтвердите пароль</Form.Label>
            <Form.Control
              required
              className="mb-2"
              type="password"
              placeholder="Подтвердите пароль"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            ></Form.Control>
          </Form.Group>

          <Button type="submit" variant="primary">
            Зарегистрироваться
          </Button>
        </Form>
      )}

      <Row className="py-3">
        <Col>
          Уже зарегистрированы?{' '}
          <Link to={redirect ? `/login?redirect=${redirect}` : '/login'}>
            Войти
          </Link>
        </Col>
      </Row>
    </FormContainer>
  );
};

export default RegisterScreen;
