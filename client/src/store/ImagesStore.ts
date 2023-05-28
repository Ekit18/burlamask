import { action, makeAutoObservable } from "mobx";

export type ImageData = {
    file: File,
}


export default class ImagesStore {
    _images: Array<ImageData>
    _swappedImages: Array<string>
    constructor() {
        this._images = []
        this._swappedImages = []
        makeAutoObservable(this)
    }

    setImages(images: ImageData[]) {
        this._images = images
    }

    get images() {
        return this._images
    }

    setSwappedImages(swappedImages: string[]) {
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

    loadImages(userId: number) {
        // return fetchImages(userId).then(action((images: ImageData[]) => {
        //     this._images = images
        // }))
    }
}
