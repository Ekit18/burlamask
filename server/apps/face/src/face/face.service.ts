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
    id: number,
    url: string,
    description: string
}

@Injectable()
export class FaceService {
    constructor(@Inject(AWS_QUEUE) private awsClient: ClientProxy) { }
    async handleAllFaces(files: Array<Express.Multer.File>, descriptions, detections: Detection) {
        // const addedOriginalImageIds: number[] = await Promise.all(files.map(async (file, index) => {
        //     const imageId: number = await lastValueFrom(this.awsClient.send({ role: "aws", cmd: 'addImage' }, { file, description: descriptions[index] }));
        //     return imageId;
        // }));
        // await Promise.all(addedOriginalImageIds.map(async (imageId, index) => {
        //     await this.awsClient.send({ role: "elastic", cmd: 'indexImage' }, { imageId, description: descriptions[index] });
        // }));
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
            const surname1 = descriptions[index];
            const surname2 = descriptions[nextIndex];
            const description = `${surname2}'s body with ${surname1}'s face`;
            const imageIdAndUrl: AWSImage = await lastValueFrom(this.awsClient.send({ role: "aws", cmd: 'addModifiedImage' }, { file, description }));
            return { ...imageIdAndUrl, description };
        }));
        await Promise.all(addedModifiedImages.map(async ({ id, description }, index) => {
            const test: any = await lastValueFrom(this.awsClient.send({ role: "elastic", cmd: 'indexImage' }, { id, description }));
        }));
        return addedModifiedImages.map((awsImage) => ({
            url: awsImage.url, description: awsImage.description, id: awsImage.id
        }));
    }

    async changeImage(imageToCrop: Express.Multer.File, backgroundImage: Express.Multer.File, detections1, detections2) {
        const intDetections1 = Object.fromEntries(Object.entries(detections1).map(([key, value]: [key: string, value: number]) => [key, Math.floor(value)]));
        const intDetections2 = Object.fromEntries(Object.entries(detections2).map(([key, value]: [key: string, value: number]) => [key, Math.floor(value)]));
        console.log(imageToCrop.mimetype);
        console.log(`<svg><ellipse cx="${intDetections1.left + (intDetections1.width / 2)}" cy="${intDetections1.top + (intDetections1.height / 2)}" rx="${intDetections1.left / 2}" ry="${intDetections1.width / 2}" /></svg>`);
        console.log(intDetections1.top);
        const img1 = await sharp(imageToCrop.buffer)

            // .composite([{
            //     input: Buffer.from(`<svg><ellipse cx="${(intDetections1.height / 2) - 25}" cy="${(intDetections1.width / 2) + 30}" rx="${100}" ry="${100}" /></svg>`),
            //     blend: 'dest-in'
            // }])
            .extract({ width: intDetections1.width, height: intDetections1.height, left: intDetections1.left, top: intDetections1.top })
            // .composite([{
            //     input: Buffer.from(`<svg><ellipse cx="${intDetections1.width}" cy="${80}" rx="${intDetections1.left / 2}" ry="${intDetections1.width / 2}" /></svg>`),
            //     blend: 'dest-in'
            // }])
            .composite([{
                input: Buffer.from(`<svg width="${intDetections1.width}" height="${intDetections1.height}">
        <defs>
            <filter id="blurMe">
                <feGaussianBlur in="SourceGraphic" stdDeviation="9" />
            </filter>
        </defs>
        <ellipse cx="${intDetections1.width / 2}" cy="${intDetections1.height / 2}" rx="${intDetections1.width / 2}" ry="${intDetections1.height / 2}"  filter="url(#blurMe)"/>
    </svg>`),
                blend: 'dest-in'
            }])
            .webp()
            // .resize({ width: 10 })
            //   .extract({
            //     width: 150,
            //     height: 150,
            //     left: 150,
            //     top: 150
            // })
            .toBuffer();
        const img1Temp = await sharp(img1)
            .resize({ height: intDetections2.height, width: intDetections2.width, fit: "fill" })
            .toBuffer();
        // const img2 = await sharp(backgroundImage.buffer).composite([{
        //     input: img1,
        //     top: 0,
        //     left: 0
        // }]).toBuffer();

        // const img1 = await sharp(imageToCrop.buffer).extract({ width: intDetections1.width, height: intDetections1.height, left: intDetections1.left, top: intDetections1.top }).toBuffer();
        const img2 = await sharp(backgroundImage.buffer).composite([{
            input: img1Temp,
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
