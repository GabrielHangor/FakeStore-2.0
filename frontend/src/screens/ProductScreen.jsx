import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { Row, Col, Image, ListGroup, Card, Button } from 'react-bootstrap';
import Rating from '../components/Rating';
import products from '../products';

const ProductScreen = () => {
  const params = useParams();

  const product = products.find((product) => product._id === params.id);
  return (
    <>
      <Link className="btn btn-light my-3" to="/">
        Назад
      </Link>
      <Row>
        <Col md={6}>
          <Image src={product.image} alt={product.name} fluid />
        </Col>
        <Col md={3}>
          <ListGroup variant="flush">
            <ListGroup.Item>
              <h3>{product.name}</h3>
            </ListGroup.Item>
            <ListGroup.Item>
              <Rating
                value={product.rating}
                text={`${product.numReviews} отзывов`}
                color={'#ffc565'}
              />
            </ListGroup.Item>
            <ListGroup.Item>Цена: ${product.price}</ListGroup.Item>
            <ListGroup.Item>Описание: {product.description}</ListGroup.Item>
          </ListGroup>
        </Col>
        <Col md={3}>
          <Card>
            <ListGroup variant="flush">
              <ListGroup.Item>
                <Row>
                  <Col>Цена:</Col>
                  <Col>
                    <strong>${product.price}</strong>
                  </Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Статус:</Col>
                  <Col>
                    {product.countInStock > 0
                      ? `В наличии ${product.countInStock} шт.`
                      : 'Нет в наличии'}
                  </Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Button
                  className="w-100"
                  disabled={product.countInStock === 0}
                  size="lg"
                  type="button"
                >
                  Добавить в корзину
                </Button>
              </ListGroup.Item>
            </ListGroup>
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default ProductScreen;
