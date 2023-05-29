import React, { useContext, useState } from 'react';
import { Container } from 'react-bootstrap';
import { FaceImage } from '../FaceImage';
import { UploadImage } from '../UploadImage';
import { CarouselItem } from './CarouselItem';
import { Context } from '../..';
import { observer } from 'mobx-react-lite';

const Carousel: React.FC = observer(() => {
  const { images } = useContext(Context);

  const nextSlide = (): void => {
    images.setCurrentCarouselIndex((images.currentCarouselIndex + 1) % images.images.length);
  };

  const prevSlide = (): void => {
    images.setCurrentCarouselIndex(
    (images.currentCarouselIndex === 0
      ? images.images.length - 1
      : images.currentCarouselIndex - 1)
    );
  };

  const renderImages = (): JSX.Element[] => {
    const endIndex: number =
      images.currentCarouselIndex + 3 > images.images.length
        ? images.images.length
        : images.currentCarouselIndex + 3;
    return images.images
      .slice(images.currentCarouselIndex, endIndex)
      .map((image) => (
        <CarouselItem key={image.file.name}>
          <FaceImage file={image.file} />
        </CarouselItem>
      ));
  };

  const renderUploadImage = (): JSX.Element | null => {
    if (images.currentCarouselIndex + 3 > images.images.length) {
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
