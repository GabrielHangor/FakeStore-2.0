import React, { useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import FormContainer from '../components/FormContainer';
import { saveShippingAddressAction } from './../actions/cartActions';

const ShippingScreen = () => {
  const cart = useSelector((state) => state.cart);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { shippingAddress } = cart;

  const [address, setAddress] = useState(shippingAddress.address);
  const [city, setCity] = useState(shippingAddress.city);
  const [postalCode, setPostalCode] = useState(shippingAddress.postalCode);
  const [country, setCountry] = useState(shippingAddress.country);

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(saveShippingAddressAction({ address, city, postalCode, country }));
    navigate('/payment');
  };

  return (
    <FormContainer>
      <h1>Оформление заказа</h1>

      <Form onSubmit={submitHandler}>
        <Form.Group controlId="address">
          <Form.Label>Адрес</Form.Label>
          <Form.Control
            required
            className="mb-2"
            type="text"
            placeholder="Введите адрес"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          ></Form.Control>
        </Form.Group>

        <Form.Group controlId="postalCode">
          <Form.Label>Страна</Form.Label>
          <Form.Control
            required
            className="mb-2"
            type="text"
            placeholder="Введите название страны"
            value={country}
            onChange={(e) => setCountry(e.target.value)}
          ></Form.Control>
        </Form.Group>

        <Form.Group controlId="city">
          <Form.Label>Город</Form.Label>
          <Form.Control
            required
            className="mb-2"
            type="text"
            placeholder="Введите название города"
            value={city}
            onChange={(e) => setCity(e.target.value)}
          ></Form.Control>
        </Form.Group>

        <Form.Group controlId="postalCode">
          <Form.Label>Индекс</Form.Label>
          <Form.Control
            required
            className="mb-2"
            type="number"
            placeholder="Введите индекс"
            value={postalCode}
            onChange={(e) => setPostalCode(e.target.value)}
          ></Form.Control>
        </Form.Group>

        <Button type="submit" vairant="primary">
          Продолжить
        </Button>
      </Form>
    </FormContainer>
  );
};

export default ShippingScreen;
