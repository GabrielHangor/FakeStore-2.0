import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Form, Button } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import Message from './../components/Message';
import Loader from './../components/Loader';
import FormContainer from '../components/FormContainer';
import {
  listProductDetailsAction,
  updateProductAction,
} from '../actions/productActions';
import {
  PRODUCT_DETAILS_RESET,
  PRODUCT_UPDATE_RESET,
} from '../reducers/productReducers';

const ProductEditScreen = () => {
  const [name, setName] = useState('');
  const [price, setPrice] = useState(0);
  const [image, setImage] = useState('');
  const [brand, setBrand] = useState('');
  const [category, setCategory] = useState('');
  const [countInStock, setCountInStock] = useState(0);
  const [description, setDescription] = useState('');
  const [uploading, setUploading] = useState(false);

  const params = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const productDetails = useSelector((state) => state.productDetails);
  const { loading, error, product } = productDetails;

  const productUpdate = useSelector((state) => state.productUpdate);
  const {
    loading: loadingUpdate,
    error: errorUpdate,
    success: successUpdate,
  } = productUpdate;

  useEffect(() => {
    if (!userInfo?.isAdmin) navigate('/login');
  }, [dispatch, navigate, userInfo]);

  useEffect(() => {
    if (!product.name || product._id !== params.id) {
      dispatch(listProductDetailsAction(params.id));
    } else {
      setName(product.name);
      setPrice(product.price);
      setImage(product.image);
      setBrand(product.brand);
      setCategory(product.category);
      setCountInStock(product.countInStock);
      setDescription(product.description);
    }
  }, [dispatch, params.id, product]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (successUpdate) {
        dispatch({ type: PRODUCT_UPDATE_RESET });
        dispatch({ type: PRODUCT_DETAILS_RESET });
        navigate('/admin/productlist');
      }
    }, 3000);

    return () => clearTimeout(timer);
  }, [successUpdate, dispatch, navigate]);

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(
      updateProductAction({
        _id: params.id,
        name,
        price,
        image,
        brand,
        category,
        description,
        countInStock,
      })
    );
  };

  const uploadFileHandler = async (e) => {
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append('image', file);
    setUploading(true);

    try {
      const config = {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${userInfo.token}`,
        },
      };

      const { data } = await axios.post('/api/upload', formData, config);
      setImage(data);
      setUploading(false);
    } catch (error) {
      console.error(error);
      setUploading(false);
    }
  };

  return (
    <>
      <Link to="/admin/productlist" className="btn btn-light my-3">
        Назад
      </Link>
      <FormContainer>
        <h1>Редактирование данных товара</h1>
        {successUpdate && (
          <Message variant="success">Данные товара успешно обновлены</Message>
        )}
        {loading || loadingUpdate ? (
          <Loader />
        ) : error ? (
          <Message variant="danger">{error}</Message>
        ) : errorUpdate ? (
          <Message variant="danger">{errorUpdate}</Message>
        ) : (
          <Form onSubmit={submitHandler}>
            <Form.Group controlId="name">
              <Form.Label>Наименование</Form.Label>
              <Form.Control
                className="mb-2"
                type="name"
                placeholder="Введите наименование"
                value={name}
                onChange={(e) => setName(e.target.value)}
              ></Form.Control>
            </Form.Group>

            <Form.Group controlId="price">
              <Form.Label>Цена</Form.Label>
              <Form.Control
                className="mb-2"
                type="number"
                placeholder="Введите стоимость"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
              ></Form.Control>
            </Form.Group>

            <Form.Group controlid="image-file">
              <Form.Label>Изображение</Form.Label>
              <Form.Control
                className="mb-2"
                type="text"
                placeholder="Добавьте URL изображения"
                value={image}
                onChange={(e) => setImage(e.target.value)}
              ></Form.Control>
              <Form.Control
                type="file"
                label="Выберите файл"
                onChange={uploadFileHandler}
              ></Form.Control>
              {uploading && <Loader />}
            </Form.Group>

            <Form.Group controlId="brand">
              <Form.Label>Бренд</Form.Label>
              <Form.Control
                className="mb-2"
                type="text"
                placeholder="Ввведите наименование бренда"
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
              ></Form.Control>
            </Form.Group>

            <Form.Group controlId="countInStock">
              <Form.Label>В наличии</Form.Label>
              <Form.Control
                className="mb-2"
                type="text"
                placeholder="Ввведите количество"
                value={countInStock}
                onChange={(e) => setCountInStock(e.target.value)}
              ></Form.Control>
            </Form.Group>

            <Form.Group controlId="category">
              <Form.Label>Категория</Form.Label>
              <Form.Control
                className="mb-2"
                type="text"
                placeholder="Ввведите наименование категории"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              ></Form.Control>
            </Form.Group>

            <Form.Group controlId="description">
              <Form.Label>Описание</Form.Label>
              <Form.Control
                className="mb-2"
                as="textarea"
                placeholder="Ввведите описание товара"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              ></Form.Control>
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

export default ProductEditScreen;
