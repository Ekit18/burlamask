import { Injectable, HttpException, HttpStatus, Inject } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { ChangeFacesDto, Detection } from "./dto/faces.dto";
import { FilesErrorObject } from "apps/aws/src/image-aws/image-aws.controller";
import { HttpService } from "@nestjs/axios";
import { ClientProxy } from "@nestjs/microservices";
import { AWS_QUEUE, CAR_QUEUE } from "inq-shared-lib";
import * as sharp from 'sharp';
import { lastValueFrom } from "rxjs";
import { Request, Response } from 'express';

interface AWSImage {
    imageId: number,
    url: string
}

@Injectable()
export class FaceService {
    constructor(@Inject(AWS_QUEUE) private awsClient: ClientProxy) { }
    async handleAllFaces(files: Array<Express.Multer.File>, descriptions, detections: Detection) {
        // TODO: Add originals to DB
        const addedOriginalImageIds: number[] = await Promise.all(files.map(async (file, index) => {
            const imageId: number = await lastValueFrom(this.awsClient.send({ role: "aws", cmd: 'addImage' }, { file, description: descriptions[index] }));
            return imageId;
        }));
        // // TODO: Index originals
        await Promise.all(addedOriginalImageIds.map(async (imageId, index) => {
            await this.awsClient.send({ role: "rmq", cmd: 'indexImage' }, { imageId, description: descriptions[index] });
        }));
        // TODO: Create modified images
        const modifiedImages: Array<Buffer> = await Promise.all(files.map(async (file, index) => {
            let nextFile = null;
            let nextIndex = 0;
            if (index + 1 !== files.length) {
                nextFile = files[index + 1];
                nextIndex = index + 1;
            } else {
                nextFile = files[0];
                nextIndex = 0;
            }
            const resultingImage = await this.changeImage(file, nextFile, detections[index], detections[nextIndex]);
            return resultingImage;
        }));
        // // TODO: Add modified images to DB
        const addedModifiedImages: AWSImage[] = await Promise.all(modifiedImages.map(async (buffer, index) => {
            const file = {
                buffer,
                originalname: `image.png`
            };
            let nextIndex = null;
            if (index + 1 !== files.length) {
                nextIndex = index + 1;
            } else {
                nextIndex = 0;
            }
            const imageIdAndUrl: AWSImage = await lastValueFrom(this.awsClient.send({ role: "aws", cmd: 'addModifiedImage' }, { file, description: `test.jpg` }));
            return imageIdAndUrl;
        }));
        // // TODO: Index modified images
        await Promise.all(addedModifiedImages.map(async ({ imageId }, index) => {
            await this.awsClient.send({ role: "rmq", cmd: 'indexImage' }, { imageId, description: descriptions[index] });
        }));
        // // TODO: Return modified
        return addedModifiedImages.map((awsImage) => awsImage.url);
    }

    // async addToAWSAndElastic(files: Array<Express.Multer.File> | Array<Buffer> | Array<OurFile>) {
    //     if (files[0]) {
    //         const files = files.map((buffer) => ({
    //             buffer,
    //             originalName: `image.png`
    //         }));
    //     }
    //     // TODO: Add originals to DB
    //     const addedOriginalImageIds: number[] = await Promise.all(files.map(async (file, index) => {
    //         const imageId: number = await lastValueFrom(this.awsClient.send({ role: "aws", cmd: 'addImage' }, { file, description: descriptions[index] }));
    //         return imageId;
    //     }));
    //     // TODO: Index originals
    //     await Promise.all(files.map(async (file, index) => {
    //         await this.awsClient.send({ role: "rmq", cmd: 'indexImage' }, { file, description: descriptions[index] });
    //     }));
    // }

    async changeImage(imageToCrop: Express.Multer.File, backgroundImage: Express.Multer.File, detections1, detections2) {
        const intDetections1 = Object.fromEntries(Object.entries(detections1).map(([key, value]: [key: string, value: number]) => [key, Math.floor(value)]));
        const intDetections2 = Object.fromEntries(Object.entries(detections2).map(([key, value]: [key: string, value: number]) => [key, Math.floor(value)]));
        const img1 = await sharp(imageToCrop.buffer).extract({ width: intDetections1.width, height: intDetections1.height, left: intDetections1.left, top: intDetections1.top }).toBuffer();
        const img2 = await sharp(backgroundImage.buffer).composite([{
            input: img1,
            top: intDetections2.top,
            left: intDetections2.left
        }]).toBuffer();
        return img2;
    }

    static async checkNSFWFiles(files: Array<Express.Multer.File>, errObj: FilesErrorObject) {
        errObj.isError = false;
        await Promise.all(await files.map(async (file) => {
            const result = await FaceService.isNSFW(file.buffer);
            if (result) {
                errObj.isError = true;
                errObj.msg = "NSFW detected";
            }
            return null;
        }
        ));
    }

    static async isNSFW(fileBuffer: Buffer) {
        let isNSFW = false;
        const formData = new FormData();
        formData.append("image", fileBuffer.toString());
        const headers = {
            'Content-Type': 'multipart/form-data',
            'X-RapidAPI-Key': process.env.X_RAPIDAPI_KEY,
            'X-RapidAPI-Host': process.env.X_RAPIDAPI_HOST
        };
        const httpService = new HttpService();
        console.log(headers);
        await httpService.axiosRef.post('https://nsfw3.p.rapidapi.com/v1/results', formData, { headers }).then((response) => {
            console.log(response.data);
            isNSFW = response.data.results[0].entities[0].classes.nsfw > 0.5;
        }).catch((error) => {
            throw new HttpException("ERROR_FROM_AXIOS: ", error);
        });
        return isNSFW;
    }
}
