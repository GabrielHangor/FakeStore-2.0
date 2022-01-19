import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LinkContainer } from 'react-router-bootstrap';
import { Table, Button, Row, Col } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import Message from './../components/Message';
import Loader from './../components/Loader';
import {
  deleteProductAction,
  listProductsAction,
} from '../actions/productActions';
import { PRODUCT_DELETE_RESET } from './../reducers/productReducers';

const ProductListScreen = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const productList = useSelector((state) => state.productList);
  const { loading, error, products } = productList;

  const productDelete = useSelector((state) => state.productDelete);
  const {
    loading: loadingDelete,
    error: errorDelete,
    success: successDelete,
  } = productDelete;

  useEffect(() => {
    if (userInfo?.isAdmin) {
      dispatch(listProductsAction());
    } else {
      navigate('/login');
    }
  }, [dispatch, navigate, userInfo, successDelete]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (successDelete) {
        dispatch({ type: PRODUCT_DELETE_RESET });
      }
    }, 3000);

    return () => clearTimeout(timer);
  }, [successDelete, dispatch]);

  const deleteHandler = (id) => {
    if (window.confirm('Подтвердите действие')) {
      dispatch(deleteProductAction(id));
    }
  };

  const createProductHandler = () => {};

  return (
    <>
      <Row className="align-items-center">
        <Col>
          <h1>Список товаров</h1>
        </Col>
        <Col className="text-end">
          <Button className="my-3" onClick={createProductHandler}>
            <i className="fas fa-plus"></i> Добавить товар
          </Button>
        </Col>
      </Row>
      {loadingDelete && <Loader />}
      {errorDelete && <Message variant="danger">{errorDelete}</Message>}
      {successDelete && (
        <Message variant="success">Товар успешно удален из базы данных</Message>
      )}
      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : (
        <Table striped bordered hover responsive="md">
          <thead>
            <tr>
              <th>ID</th>
              <th>Наименование</th>
              <th>Цена</th>
              <th>Категория</th>
              <th>Бренд</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr className="align-middle" key={product._id}>
                <td>{product._id}</td>
                <td>{product.name}</td>
                <td>${product.price}</td>
                <td>{product.category}</td>
                <td>{product.brand}</td>
                <td>
                  <LinkContainer to={`/admin/product/${product._id}/edit`}>
                    <Button variant="primary" className=" btn-sm">
                      <i className="fas fa-edit"></i>
                    </Button>
                  </LinkContainer>
                  <Button
                    variant="danger"
                    className="btn-sm"
                    onClick={() => deleteHandler(product._id)}
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

export default ProductListScreen;
