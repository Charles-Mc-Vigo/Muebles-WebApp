import React, { useState, useEffect, useRef } from 'react';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';

const Carousel = ({ images, interval = 5000 }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const timeoutRef = useRef(null);

  useEffect(() => {
    resetTimeout();
    timeoutRef.current = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex === images.length - 1 ? 0 : prevIndex + 1));
    }, interval);

    return () => resetTimeout();
  }, [currentIndex, images.length, interval]);

  const resetTimeout = () => {
    if (timeoutRef.current) {
      clearInterval(timeoutRef.current);
    }
  };

  const [touchStartX, setTouchStartX] = useState(0);
  const [touchEndX, setTouchEndX] = useState(0);

  const handleTouchStart = (e) => {
    setTouchStartX(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e) => {
    setTouchEndX(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (touchStartX - touchEndX > 75) {
      nextSlide();
    } else if (touchStartX - touchEndX < -75) {
      prevSlide();
    }
  };

  const prevSlide = () => {
    resetTimeout();
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? images.length - 1 : prevIndex - 1));
  };

  const nextSlide = () => {
    resetTimeout();
    setCurrentIndex((prevIndex) => (prevIndex === images.length - 1 ? 0 : prevIndex + 1));
  };

  return (
    <div
      className="relative w-full max-w-screen-lg mx-auto my-8" // Adjusted container width and added margin
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <div className="relative h-64 md:h-80 overflow-hidden rounded-lg mx-auto"> {/* Adjusted height */}
        {images.map((image, index) => (
          <div
            key={index}
            className={`absolute top-0 left-0 w-full h-full transition-opacity duration-500 ${
              index === currentIndex ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <img src={image} alt={`Slide ${index}`} className="w-full h-100 md:h-80 object-contain" /> {/* Adjusted image height */}
          </div>
        ))}
      </div>

      {/* Optional: Uncomment these if you want to add navigation arrows */}
      {/* <button
        className="absolute top-1/2 left-0 transform -translate-y-1/2 p-2 bg-transparent text-black text-2xl ml-2 mr-2"
        onClick={prevSlide}
      >
        <FontAwesomeIcon icon={faChevronLeft} />
      </button>

      <button
        className="absolute top-1/2 right-0 transform -translate-y-1/2 p-2 bg-transparent text-black text-2xl  ml-2 mr-2"
        onClick={nextSlide}
      >
        <FontAwesomeIcon icon={faChevronRight} />
      </button> */}

      <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {images.map((_, index) => (
          <button
            key={index}
            className={`w-3 h-3 rounded-full ${
              index === currentIndex ? 'bg-blue-500' : 'bg-gray-300'
            }`}
            onClick={() => setCurrentIndex(index)}
          />
        ))}
      </div>
    </div>
  );
};

export default Carousel;
