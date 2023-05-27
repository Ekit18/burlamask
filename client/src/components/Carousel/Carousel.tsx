import React, { useState } from 'react';
import { Container } from 'react-bootstrap';
import { FaceImage } from '../FaceImage';
import { UploadImage } from '../UploadImage';
import { CarouselItem } from './CarouselItem';

interface CarouselProps {
    images: File[],
    setImages: React.Dispatch<React.SetStateAction<File[]>>
}

const Carousel: React.FC<CarouselProps> = ({ images, setImages }) => {
    const [currentIndex, setCurrentIndex] = useState<number>(0);

    const nextSlide = (): void => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    };

    const prevSlide = (): void => {
        setCurrentIndex((prevIndex) =>
        (prevIndex === 0
            ? images.length - 1
            : prevIndex - 1)
        );
    };

    const renderImages = (): JSX.Element[] => {
        const endIndex: number =
            currentIndex + 3 > images.length
                ? images.length
                : currentIndex + 3;
        return images
            .slice(currentIndex, endIndex)
            .map((image: File) => {
                return <CarouselItem key={image.name}> <FaceImage file={image} /></CarouselItem>
            }
            );
    };

    return (
        <Container>
            <div className="carousel d-flex justify-content-between">
                <button className="carousel__button carousel__button--prev" onClick={prevSlide}>
                    Prev
                </button>
                <div className="carousel__images d-flex" style={{ gap: "20px" }}>{renderImages()}{<CarouselItem><UploadImage setImages={setImages} /></CarouselItem>}</div>
                <button className="carousel__button carousel__button--next" onClick={nextSlide}>
                    Next
                </button>
            </div>
        </Container>
    );
};

export default Carousel;
