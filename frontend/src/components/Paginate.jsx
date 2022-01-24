import React from 'react';
import { Pagination } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';

const Paginate = ({ pages, page, isAdmin = false, keyword = '' }) => {
  return (
    pages > 1 && (
      <Pagination className="d-flex justify-content-center">
        {[...Array(pages).keys()].map((el) => (
          <LinkContainer
            key={el + 1}
            to={
              isAdmin
                ? `/admin/productlist/${el + 1}`
                : keyword
                ? `/search/${keyword}/page/${el + 1}`
                : `/page/${el + 1}`
            }
          >
            <Pagination.Item active={el + 1 === page}>{el + 1}</Pagination.Item>
          </LinkContainer>
        ))}
      </Pagination>
    )
  );
};

export default Paginate;
