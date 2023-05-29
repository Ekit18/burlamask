import React, { useContext, useState } from 'react'
import { observer } from 'mobx-react-lite'
import { Context } from '..';
import { CarouselItem } from './Carousel/CarouselItem';
import { Container } from 'react-bootstrap';
import { FaceImage } from './FaceImage';


export const SwappedImages: React.FC = observer(() => {
    const { images } = useContext(Context);
    // return (
    //     <>
    //     <div className="d-flex flex-column text-center align-items-center">
    //         {images.swappedImages.length > 0 && images.swappedImages.map((swappedImage) => <img key={swappedImage.oldName} src={swappedImage.file} width={300} height={300}/>)}
    //     </div>
    //     </>
    // );const { images } = useContext(Context);

    const nextSlide = (): void => {
        images.setCurrentCarouselIndex((images.currentCarouselIndex + 1) % images.swappedImages.length);
    };

    const prevSlide = (): void => {
        images.setCurrentCarouselIndex(
            (images.currentCarouselIndex === 0
                ? images.swappedImages.length - 1
                : images.currentCarouselIndex - 1)
        );
    };

    const renderImages = (): JSX.Element[] => {
        const endIndex: number =
            images.currentCarouselIndex + 3 > images.swappedImages.length
                ? images.swappedImages.length
                : images.currentCarouselIndex + 3;
        return images.swappedImages
            .slice(images.currentCarouselIndex, endIndex)
            .map((image) => (
                <CarouselItem key={image.id}>
                    <div className="d-flex flex-column align-items-center position-relative">
                        <img src={image.url} alt={image.description} />
                        <h4 className=" w-100 text-center" style={{ bottom: -10, backgroundColor: "white" }}>{image.description}</h4>
                    </div>
                </CarouselItem>
            ));
    };


    return (
        <Container className="mt-5">
            <div className="carousel d-flex justify-content-between">
                <button className="carousel__button carousel__button--prev" onClick={prevSlide} style={{ backgroundColor: "unset", border: "none" }}>
                    {images.swappedImages.length >= 3 &&
                        <div className="carousel-dark ">
                            <div className="carousel-control-prev-icon">
                            </div>
                        </div>
                    }
                </button>
                <div className="carousel__images.images d-flex" style={{ gap: '20px' }}>
                    {renderImages()}
                </div>

                <button className="carousel__button carousel__button--next" style={{ backgroundColor: "unset", border: "none" }} onClick={nextSlide}>

                    {images.swappedImages.length >= 3 &&
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
