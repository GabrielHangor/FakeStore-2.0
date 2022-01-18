import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Form, Button } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import Message from './../components/Message';
import Loader from './../components/Loader';
import FormContainer from '../components/FormContainer';
import {
  getUserDetailsAction,
  updateUserAdminAction,
} from '../actions/userActions';
import { USER_UPDATE_RESET } from '../reducers/userReducers';

const UserEditScreen = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);

  const params = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const userDetails = useSelector((state) => state.userDetails);
  const { loading, error, user } = userDetails;

  const userUpdate = useSelector((state) => state.userUpdate);
  const {
    loading: loadingUpdate,
    error: errorUpdate,
    success: successUpdate,
  } = userUpdate;

  useEffect(() => {
    if (!user?.name || user._id !== params.id) {
      dispatch(getUserDetailsAction(params.id));
    } else {
      setName(user.name);
      setEmail(user.email);
      setIsAdmin(user.isAdmin);
    }
  }, [user, dispatch, params.id]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (successUpdate) {
        dispatch({ type: USER_UPDATE_RESET });
        navigate('/admin/userlist');
      }
    }, 3000);

    return () => clearTimeout(timer);
  }, [successUpdate, dispatch, navigate]);

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(updateUserAdminAction({ _id: params.id, name, email, isAdmin }));
  };

  return (
    <>
      {successUpdate && (
        <Message variant="success">
          Данные пользователя успешно обновлены
        </Message>
      )}
      <Link to="/admin/userlist" className="btn btn-light my-3">
        Назад
      </Link>
      <FormContainer>
        <h1>Редактирование данных пользователя</h1>
        {errorUpdate && <Message variant="danger">{errorUpdate}</Message>}
        {loading || loadingUpdate ? (
          <Loader />
        ) : error ? (
          <Message variant="danger">{error}</Message>
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

            <Form.Group controlId="isadmin">
              <Form.Check
                className="mb-2"
                type="checkbox"
                label="Сделать администратором?"
                checked={isAdmin}
                onChange={(e) => setIsAdmin(e.target.checked)}
              ></Form.Check>
            </Form.Group>

            <Button type="submit" variant="primary" className="w-100">
              Обновить данные
            </Button>
          </Form>
        )}
      </FormContainer>
    </>
  );
};

export default UserEditScreen;
