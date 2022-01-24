import React, { useEffect } from 'react';
import { Row, Col } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import Loader from '../components/Loader';
import Message from '../components/Message';
import Product from '../components/Product';
import { listProductsAction } from './../actions/productActions';
import { useParams } from 'react-router-dom';

const HomeScreen = () => {
  const dispatch = useDispatch();

  const params = useParams();
  const keyword = params.keyword;

  const productList = useSelector((state) => state.productList);
  const { loading, error, products } = productList;

  useEffect(() => {
    dispatch(listProductsAction(keyword));
  }, [dispatch, keyword]);

  return (
    <>
      <h1>Популярные товары</h1>
      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : (
        <Row>
          {products.map((product) => (
            <Col key={product._id} sm={12} md={6} lg={4} xl={3}>
              <Product product={product} />
            </Col>
          ))}
        </Row>
      )}
    </>
  );
};

export default HomeScreen;
