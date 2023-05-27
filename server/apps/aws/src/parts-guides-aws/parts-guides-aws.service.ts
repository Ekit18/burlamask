import { v4 as uuid } from 'uuid';
import FormData = require('form-data');
import { S3Client, DeleteObjectCommand, PutObjectCommand, ListObjectsV2Command } from '@aws-sdk/client-s3';
import { HttpService } from '@nestjs/axios';
import { Injectable, HttpException, HttpStatus, Inject } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { PartsGuidesAWS, PARTS_QUEUE, Part, GetPartTypesByBrandDTO, getAllStaticByBrandAndTypeDTO } from 'inq-shared-lib';
import { FilesErrorObject } from './parts-guides-aws.controller';
import { ConfigService } from '@nestjs/config';
import { ClientProxy } from "@nestjs/microservices";
import { lastValueFrom } from 'rxjs';
import { HttpStatusCode } from 'axios';
import { Image } from 'apps/aws/model/images.model';

type FileType = 'Part' | 'Guide';
export interface StaticFile {
    id: number,
    url: string,
    key: string,
    description: string
}

@Injectable()
export class ImageAwsService {
    baseURI: string;
    constructor(
        private readonly configService: ConfigService,
        @InjectModel(Image) private imageRepository: typeof Image,
        // @Inject(PARTS_QUEUE) private PartsClient: ClientProxy,
        private readonly s3Client: S3Client,
    ) {
        this.baseURI = `https://${this.configService.get('AWS_PUBLIC_BUCKET_NAME')}.s3.${this.configService.get('AWS_REGION')}.amazonaws.com/`;
    }

    async getAllImages(): Promise<Image[]> {
        const contents: Image[] = await this.imageRepository.findAll({});
        return contents;
    }

    async getImage(imageId: number) {
        const content: Image = await this.imageRepository.findByPk(imageId);
        return content;
    }


    async deletePublicFile(imageId: number) {
        const candidate: Image = await this.imageRepository.findByPk(imageId);
        if (!candidate) {
            throw new HttpException("Such key does not exist!", HttpStatus.BAD_REQUEST);
        }
        try {
            const delParams = {
                Bucket: this.configService.get('AWS_PUBLIC_BUCKET_NAME'),
                Key: candidate.key,
            };
            await this.s3Client.send(new DeleteObjectCommand(delParams));
            return this.imageRepository.destroy({ where: { imageId } });
        } catch (error) {
            throw new HttpException("CANNOT DELETE STATIC FILE!", HttpStatusCode.BadRequest);
        }
    }

    async addImage(dataBuffer: Buffer, filename:string, description: string) {
        const newFile = await this.uploadPublicFile(dataBuffer, filename, description);
        return newFile.url;
    }

    private async uploadPublicFile(dataBuffer: Buffer, filename:string, description: string) {
        const uploadParams = {
            Bucket: this.configService.get('AWS_PUBLIC_BUCKET_NAME'),
            Body: dataBuffer,
            Key: `${uuid()}-${description}`,
            ContentDisposition: 'inline;',
            ContentType: `image/${filename.split('.')[1]}`
        };
        await this.s3Client.send(new PutObjectCommand(uploadParams));
        const fileUrl = `https://${uploadParams.Bucket}.s3.${await this.s3Client.config.region()}.amazonaws.com/${uploadParams.Key}`;
        await this.imageRepository.create({
            url: fileUrl,
            key: uploadParams.Key,
            description
        });
        const newFile: Image = await this.imageRepository.findOne({
            where: {
                url: fileUrl
            }
        });
        return newFile;
    }


    static async checkNSFWFiles(files: Array<Express.Multer.File>, errObj: FilesErrorObject) {
        errObj.isError = false;
        await Promise.all(await files.map(async (file) => {
            const result = await ImageAwsService.isNSFW(file.buffer);
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
        formData.append("image", fileBuffer);
        const headers = {
            'Content-Type': 'multipart/form-data',
            'X-RapidAPI-Key': process.env.X_RAPIDAPI_KEY,
            'X-RapidAPI-Host': process.env.X_RAPIDAPI_HOST
        };
        const httpService = new HttpService();
        console.log(headers);
        await httpService.axiosRef.post('https://nsfw3.p.rapidapi.com/v1/results', formData, { headers }).then((response) => {
            isNSFW = response.data.results[0].entities[0].classes.nsfw > 0.5;
        }).catch((error) => {
            throw new HttpException("ERROR_FROM_AXIOS: ", error);
        });
        return isNSFW;
    }
}
