import React, { useState } from 'react';

const ErrorImage = ({ src, alt, fallbackSrc = '/images/default-food.jpg', ...props }) => {
  const [imgSrc, setImgSrc] = useState(src || fallbackSrc);
  const [hasError, setHasError] = useState(false);

  const handleError = () => {
    if (!hasError) {
      setImgSrc(fallbackSrc);
      setHasError(true);
    }
  };

  return (
    <img
      src={imgSrc}
      alt={alt || 'Food item'}
      onError={handleError}
      {...props}
    />
  );
};

export default ErrorImage;
