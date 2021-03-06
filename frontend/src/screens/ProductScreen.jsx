import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Row,
  Col,
  Image,
  ListGroup,
  Card,
  Button,
  Form,
  Modal,
} from 'react-bootstrap';
import Rating from '../components/Rating';
import { useDispatch, useSelector } from 'react-redux';
import {
  listProductDetailsAction,
  clearProductDetailsAction,
  createProductReviewAction,
} from '../actions/productActions';
import Loader from '../components/Loader';
import Message from '../components/Message';
import { addToCartAction } from './../actions/cartActions';
import { PRODUCT_CREATE_REVIEW_RESET } from '../reducers/productReducers';
import Meta from '../components/Meta';

const ProductScreen = () => {
  const [quantity, setQuantity] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');

  const params = useParams();
  const dispatch = useDispatch();

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const productDetails = useSelector((state) => state.productDetails);
  const { loading, error, product } = productDetails;

  const productCreateReview = useSelector((state) => state.productCreateReview);
  const {
    loading: loadingProductReview,
    error: errorProductReview,
    success: succesProductReview,
  } = productCreateReview;

  useEffect(() => {
    dispatch(listProductDetailsAction(params.id));

    return () => dispatch(clearProductDetailsAction());
  }, [dispatch, params, succesProductReview]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowModal(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, [showModal]);

  useEffect(() => {
    setRating(0);
    setComment('');

    const timer = setTimeout(() => {
      if (succesProductReview || errorProductReview) {
        dispatch({ type: PRODUCT_CREATE_REVIEW_RESET });
      }
    }, 2000);

    return () => clearTimeout(timer);
  }, [dispatch, succesProductReview, errorProductReview]);

  const addToCartHandler = () => {
    dispatch(addToCartAction(params.id, quantity));
    setShowModal(true);
  };

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(createProductReviewAction(params.id, { rating, comment }));
  };

  return (
    <>
      <Modal
        show={showModal}
        onHide={() => setShowModal(false)}
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Body>
          <h3>
            {product.name} ???????????????? ?? ?????????????? ?? ???????????????????? {quantity} ????.
          </h3>
        </Modal.Body>
      </Modal>
      <Link className="btn btn-outline-primary my-3" to="/">
        ?? ???????????? ??????????????
      </Link>
      {succesProductReview && (
        <Message variant="success">?????????? ?????????????? ??????????????????????</Message>
      )}
      {errorProductReview && (
        <Message variant="danger">{errorProductReview}</Message>
      )}
      {loading || loadingProductReview ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : (
        <>
          <Meta title={product.name} />
          <Row>
            <Col md={6}>
              <Image src={product.image} alt={product.name} fluid />
            </Col>
            <Col md={6}>
              <ListGroup variant="flush">
                <ListGroup.Item>
                  <h2>{product.name}</h2>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Rating
                    value={product.rating}
                    text={`${product.numReviews} ??????????????`}
                    color={'#ffc565'}
                  />
                </ListGroup.Item>
                <ListGroup.Item>????????: ${product.price}</ListGroup.Item>
                <ListGroup.Item>????????????????: {product.description}</ListGroup.Item>
              </ListGroup>
            </Col>
            <Col className="py-3" md={6}>
              <Card>
                <ListGroup variant="flush">
                  <ListGroup.Item>
                    <Row>
                      <Col>????????:</Col>
                      <Col>
                        <strong>${product.price}</strong>
                      </Col>
                    </Row>
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <Row>
                      <Col>?? ??????????????:</Col>
                      <Col>
                        {product.countInStock > 0
                          ? `${product.countInStock} ????.`
                          : '??????'}
                      </Col>
                    </Row>
                  </ListGroup.Item>
                  {product.countInStock > 0 && (
                    <ListGroup.Item>
                      <Row>
                        <Col>??????-????</Col>
                        <Col>
                          <Form.Control
                            as="select"
                            value={quantity}
                            onChange={(e) =>
                              setQuantity(Number(e.target.value))
                            }
                          >
                            {[...Array(product.countInStock).keys()].map(
                              (el) => (
                                <option key={el + 1} value={el + 1}>
                                  {el + 1}
                                </option>
                              )
                            )}
                          </Form.Control>
                        </Col>
                      </Row>
                    </ListGroup.Item>
                  )}
                  <ListGroup.Item>
                    <Button
                      onClick={addToCartHandler}
                      className="w-100"
                      disabled={product.countInStock === 0}
                      size="lg"
                      type="button"
                      variant="outline-primary"
                    >
                      ???????????????? ?? ??????????????
                    </Button>
                  </ListGroup.Item>
                </ListGroup>
              </Card>
            </Col>
          </Row>

          <Row>
            <Col md={6}>
              <ListGroup variant="flush">
                <ListGroup.Item>
                  <h2>????????????</h2>
                  {product.reviews.length === 0 && (
                    <Message variant="primary">?????????????? ???????? ??????</Message>
                  )}
                </ListGroup.Item>
                {product.reviews.map((review) => (
                  <ListGroup.Item key={review._id}>
                    <strong>{review.name}</strong>
                    <Rating color={'#ffc565'} value={review.rating} />
                    <p>????????????????: {review.createdAt.substring(0, 10)}</p>
                    <p>{review.comment}</p>
                  </ListGroup.Item>
                ))}
                <ListGroup.Item>
                  <h2>???????????????? ??????????</h2>
                  {userInfo ? (
                    <Form onSubmit={submitHandler}>
                      <Form.Group controlId="rating" className="py-2">
                        <Form.Label>??????????????</Form.Label>
                        <Form.Control
                          required
                          as="select"
                          value={rating}
                          onChange={(e) => setRating(e.target.value)}
                        >
                          <option value="">?????????????????? ??????????????</option>
                          <option value="1">1 - ????????????</option>
                          <option value="2">2 - ??????????</option>
                          <option value="3">3 - ????????????</option>
                          <option value="4">4 - ?????????? ????????????</option>
                          <option value="5">5 - ??????????????</option>
                        </Form.Control>
                      </Form.Group>
                      <Form.Group controlId="comment" className="py-2">
                        <Form.Label>??????????????????????</Form.Label>
                        <Form.Control
                          required
                          as="textarea"
                          row="3"
                          value={comment}
                          onChange={(e) => setComment(e.target.value)}
                        ></Form.Control>
                      </Form.Group>
                      <Button type="submit" variant="outline-primary">
                        ???????????????? ??????????????????????
                      </Button>
                    </Form>
                  ) : (
                    <Message>
                      <Link to="/login">??????????????????????????????</Link>, ?????????? ????????????????
                      ??????????
                    </Message>
                  )}
                </ListGroup.Item>
              </ListGroup>
            </Col>
          </Row>
        </>
      )}
    </>
  );
};

export default ProductScreen;
