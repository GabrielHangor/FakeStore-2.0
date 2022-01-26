import React from 'react';
import { Helmet } from 'react-helmet';

const Meta = ({ title, description, keywords }) => {
  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keyword" content={keywords} />
    </Helmet>
  );
};

Meta.defaultProps = {
  title: 'Добро пожаловать в FakeStore 2.0',
  description: 'Мы продаем лучшие товары по лучшим ценам',
  keywords: 'Элетроника по выгодным и доступным ценам',
};

export default Meta;
