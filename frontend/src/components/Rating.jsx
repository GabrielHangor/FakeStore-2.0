import React from 'react';

const Rating = ({ value, text, color }) => {
  return (
    <div className="rating">
      <span>
        {[...Array(5)].map((_, i) => {
          const classname =
            value >= i + 1
              ? 'fas fa-star'
              : value >= i + 0.5
              ? 'fas fa-star-half-alt'
              : 'far fa-star';
          return <i key={'Star' + i} style={{ color }} className={classname} />;
        })}
      </span>
      <span className="px-2">{text && text}</span>
    </div>
  );
};

export default Rating;
