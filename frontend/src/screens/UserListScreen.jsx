import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LinkContainer } from 'react-router-bootstrap';
import { Table, Button } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import Message from './../components/Message';
import Loader from './../components/Loader';
import { listUsersAction } from '../actions/userActions';
import { deleteUserAction } from './../actions/userActions';
import { USER_DELETE_SUCCESS_RESET } from '../reducers/userReducers';

const UserListScreen = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const userList = useSelector((state) => state.userList);
  const { loading, error, users } = userList;

  const userDelete = useSelector((state) => state.userDelete);
  const { success, message } = userDelete;

  useEffect(() => {
    if (userInfo?.isAdmin) {
      dispatch(listUsersAction());
    } else {
      navigate('/login');
    }
  }, [dispatch, navigate, userInfo, success]);

  const deleteHandler = (id) => {
    if (window.confirm('Удалить пользователя?')) {
      dispatch(deleteUserAction(id));
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      if (success) {
        dispatch({ type: USER_DELETE_SUCCESS_RESET });
      }
    }, 3000);

    return () => clearTimeout(timer);
  }, [success, dispatch]);

  return (
    <>
      <h1>Список пользователей</h1>
      {message && <Message variant="success">{message.message}</Message>}
      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : (
        <Table striped bordered hover responsive="md">
          <thead>
            <tr>
              <th>ID</th>
              <th>Имя</th>
              <th>Email</th>
              <th>Администратор</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr className="align-middle" key={user._id}>
                <td>{user._id}</td>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>
                  {user.isAdmin ? (
                    <i className="fas fa-check" style={{ color: 'green' }}></i>
                  ) : (
                    <i className="fas fa-times" style={{ color: 'red' }}></i>
                  )}
                </td>
                <td>
                  <LinkContainer to={`/admin/user/${user._id}/edit`}>
                    <Button variant="primary" className=" btn-sm">
                      <i className="fas fa-edit"></i>
                    </Button>
                  </LinkContainer>
                  <Button
                    variant="danger"
                    className="btn-sm"
                    disabled={user.isAdmin}
                    onClick={() => deleteHandler(user._id)}
                  >
                    <i className="fas fa-trash"></i>
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </>
  );
};

export default UserListScreen;
