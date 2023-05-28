import React, { useContext, useState } from 'react';
import { Container } from 'react-bootstrap';
import { FaceImage } from '../FaceImage';
import { UploadImage } from '../UploadImage';
import { CarouselItem } from './CarouselItem';
import { Context } from '../..';
import { observer } from 'mobx-react-lite';

const Carousel: React.FC = observer(() => {
  const { images } = useContext(Context);
  const [currentIndex, setCurrentIndex] = useState<number>(0);

  const nextSlide = (): void => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.images.length);
  };

  const prevSlide = (): void => {
    setCurrentIndex((prevIndex) =>
    (prevIndex === 0
      ? images.images.length - 1
      : prevIndex - 1)
    );
  };

  const renderImages = (): JSX.Element[] => {
    const endIndex: number =
      currentIndex + 3 > images.images.length
        ? images.images.length
        : currentIndex + 3;
    return images.images
      .slice(currentIndex, endIndex)
      .map((image) => (
        <CarouselItem key={image.file.name}>
          <FaceImage file={image.file} />
        </CarouselItem>
      ));
  };

  const renderUploadImage = (): JSX.Element | null => {
    if (currentIndex + 3 > images.images.length) {
      return (
        <CarouselItem>
          <UploadImage />
        </CarouselItem>
      );
    }
    return null;
  };

  return (
    <Container>
      <div className="carousel d-flex justify-content-between">
        <button className="carousel__button carousel__button--prev" onClick={prevSlide} style={{ backgroundColor: "unset", border: "none" }}>
        {images.images.length >= 3 &&
            <div className="carousel-dark ">
              <div className="carousel-control-prev-icon">
              </div>
            </div>
          }
        </button>
        <div className="carousel__images.images d-flex" style={{ gap: '20px' }}>
          {renderImages()}
          {renderUploadImage()}
        </div>

        <button className="carousel__button carousel__button--next" style={{ backgroundColor: "unset", border: "none" }} onClick={nextSlide}>

          {images.images.length >= 3 &&
            <div className="carousel-dark ">
              <div className="carousel-control-next-icon">
              </div>
            </div>
          }
        </button>

      </div>
    </Container>
  );
});

export default Carousel;
