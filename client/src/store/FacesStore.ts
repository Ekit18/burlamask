import { action, makeAutoObservable } from "mobx";
import { addFaces, deleteFaces, changeFaces, fetchFaces, uploadFaces } from "../http/faceApi";
import ImagesStore, { ImageData, SwappedImageData } from "./ImagesStore";
import { Buffer } from 'buffer';

export type FaceData = {
    file: File,
    detection: FaceDetection,
    description: string
}

export type FaceDetection = {
    top: number,
    left: number,
    width: number,
    height: number,
}

export default class FacesStore {
    _faces: Array<FaceData>
    constructor() {
        this._faces = []
        makeAutoObservable(this)
    }

    setFaces(faces: FaceData[]) {
        this._faces = faces
    }

    get faces() {
        return this._faces
    }

    addFace(params: FaceData) {
        const faceIndex = this._faces.findIndex((item) => item.file.name === params.file.name)
        if (faceIndex !== -1) {
            return;
        }
        console.log(faceIndex)
        this._faces.push({ ...params })
        // return addFaces(userId, carId, carMileage).then(action((data) => {
        // }))
    }

    deleteFaces(name: string) {
        const faceIndex = this._faces.findIndex((item) => item.file.name === name)
        this._faces.splice(faceIndex, 1)
        // return deleteFaces(userId, faceId).then(action(() => {
        //     // const scheduleIndex = this._faces.findIndex((item) => item.faceId === faceId)
        //     // this._faces.splice(scheduleIndex, 1)
        // }))
    }

    changeFaces(userId: number, carId: number, mileage: number) {
        return changeFaces(userId, carId, mileage).then(action(() => {
            // const face = this.findFaceById(carId)
            // console.log(carId, this.findFaceById(carId), this._faces)
            // if (face) {
            //     face.carMileage = mileage
            // }
        }))
    }

    findFaceByFileSizeAndName(fileSize: number, name:string) {
        return this._faces.find((item) => item.file.size === fileSize && item.file.name === name);
    }

    uploadFaces(images: ImagesStore) {
        return uploadFaces(this._faces).then(action((data:SwappedImageData[]) => {
            console.log(data)
            // const result = data.map((imageData: { data: number[] }, index: number) => {
            //     const buffer = Buffer.from(imageData.data);

            //     const base64Image = buffer.toString('base64');
            //     const imageFormat = images.images[index].file.type
            //     const oldName = images.images[index].file.name
            //     const dataUrl = `data:image/${imageFormat};base64,${base64Image}`;
            //     return { file: dataUrl, oldName };
            // })
            // console.log(result)
            images.setSwappedImages(data)
        }))
    }
}
