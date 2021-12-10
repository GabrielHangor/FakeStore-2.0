import React from 'react';
import { Spinner } from 'react-bootstrap';

const Loader = () => {
  return (
    <Spinner
      animation="border"
      role="status"
      style={{
        position: 'absolute',
        width: '100px',
        height: '100px',
        margin: 'auto',
        top: '0',
        bottom: '0',
        left: '0',
        right: '0',
        display: 'block',
      }}
    >
      <span className="sr-only">Загрузка...</span>
    </Spinner>
  );
};

export default Loader;
