import { action, makeAutoObservable } from "mobx";
import { searchAwsImg } from "../http/awsApi/awsApi";

export type ImageData = {
    file: File,
}

export type SwappedImageData = {
    id: number
    url: string,
    description: string
}


export default class ImagesStore {
    _images: Array<ImageData>
    _swappedImages: Array<SwappedImageData>
    _currentCarouselIndex: number
    constructor() {
        this._images = []
        this._swappedImages = []
        this._currentCarouselIndex = 0
        makeAutoObservable(this)
    }


    setCurrentCarouselIndex(currentCarouselIndex: number) {
        this._currentCarouselIndex = currentCarouselIndex
    }

    get currentCarouselIndex() {
        return this._currentCarouselIndex
    }

    setImages(images: ImageData[]) {
        this._images = images
    }

    get images() {
        return this._images
    }

    setSwappedImages(swappedImages: SwappedImageData[]) {
        this._swappedImages = swappedImages
    }

    get swappedImages() {
        return this._swappedImages
    }

    addImages(file: File) {
        this._images.push({ file })
        // return addImages(userId, carId, carMileage).then(action((data) => {
        // }))
    }

    deleteImages(name: string) {
        const scheduleIndex = this._images.findIndex((item) => item.file.name === name)
        this._images.splice(scheduleIndex, 1)
        // return deleteFaces(userId, faceId).then(action(() => {
        //     // const scheduleIndex = this._faces.findIndex((item) => item.faceId === faceId)
        //     // this._faces.splice(scheduleIndex, 1)
        // }))
        // return deleteImages(userId, imageId).then(action(() => {
        //     // const scheduleIndex = this._images.findIndex((item) => item.imageId === imageId)
        //     // this._images.splice(scheduleIndex, 1)
        // }))
    }

    changeImages(userId: number, carId: number, mileage: number) {
        // return changeImages(userId, carId, mileage).then(action(() => {
        //     // const image = this.findImageById(carId)
        //     // console.log(carId, this.findImageById(carId), this._images)
        //     // if (image) {
        //     //     image.carMileage = mileage
        //     // }
        // }))
    }

    // findImageById(imageId: number) {
    //     return this._images.find((item) => item.id === imageId)
    // }

    searchImages(description: string) {
        return searchAwsImg(description).then(action((data: SwappedImageData[]) => {
            const newArray = [...data, ...this._swappedImages]
            this.setSwappedImages(newArray.filter((value, index, self) =>
                self.findIndex((v) => v.id === value.id) === index
            ));
        }))
    }
}
