import { HttpService } from "@nestjs/axios";
import { Controller, UseGuards, Post, Body, Get, Param, Put, Delete, UploadedFiles, UseInterceptors, Inject, HttpException, HttpStatus } from "@nestjs/common";
import { ApiProperty, ApiTags, ApiOperation, ApiResponse } from "@nestjs/swagger";
import { FaceService } from "./face.service";
import { ChangeFacesDto } from "./dto/faces.dto";
import { FilesInterceptor } from '@nestjs/platform-express';
import { FilesErrorObject } from "apps/aws/src/image-aws/image-aws.controller";
import { ConfigService } from "@nestjs/config";
import { config } from './file-options';

@ApiTags("Faces")
@Controller('face')
export class FaceController {
    static errObj: FilesErrorObject = Object();
    @Inject()
    static configService: ConfigService;
    constructor(
        private faceService: FaceService
    ) { }

    static imageFilter(req: Request, file: Express.Multer.File, callback: (error: Error, acceptFile: boolean) => void) {
        FaceController.errObj.isError = false;
        if (!file.mimetype.match(/(image\/)?(jpg|jpeg|png)/) || !file.originalname.match(/\.(jpg|jpeg|png)/)) {
            FaceController.errObj.isError = true;
            FaceController.errObj.msg = "Wrong data type";
        }
        if (file.size > config.MAX_FILE_SIZE) {
            FaceController.errObj.isError = true;
            FaceController.errObj.msg = "Wrong data size";
        }
        console.log(config.MAX_FILE_SIZE);
        callback(null, true);
    }

    @Post()
    @UseInterceptors(FilesInterceptor('file', 5, { limits: { fieldSize: 3072 } }))
    async handleAllFaces(@UploadedFiles() files: Array<Express.Multer.File>, @Body() dto: ChangeFacesDto) {
        console.log(JSON.parse(dto.detections));

        if (FaceController.errObj.isError || files.length < 2) {
            throw new HttpException(`${FaceController.errObj.msg}test`, HttpStatus.BAD_REQUEST);
        }
        // console.log("test");
        // // await FaceService.checkNSFWFiles(files, FaceController.errObj);
        // // if (FaceController.errObj.isError) {
        // //     throw new HttpException(FaceController.errObj.msg, HttpStatus.BAD_REQUEST);
        // // }
        console.log(files[0].mimetype);
        const result = await this.faceService.handleAllFaces(files, JSON.parse(dto.descriptions), JSON.parse(dto.detections));
        return result;
        // return [
        //     { id: 1, url: "https://parts-guides.s3.eu-central-1.amazonaws.com/73f3391e-0f7b-409e-8ee8-71f68835668a", description: "test1" },
        //     { id: 2, url: "https://parts-guides.s3.eu-central-1.amazonaws.com/55094875-bffa-46ec-9fb5-58b99f4c43ed", description: "test2" },
        //     { id: 3, url: "https://parts-guides.s3.eu-central-1.amazonaws.com/96d2ec38-e3c1-4ba2-9eb2-52f649f7d0ff", description: "test3" },

        // ];
    }

    @Get()
    test() {
        return "test";
    }
}
