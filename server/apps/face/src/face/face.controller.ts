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
        // await FaceService.checkNSFWFiles(files, FaceController.errObj);
        // if (FaceController.errObj.isError) {
        //     throw new HttpException(FaceController.errObj.msg, HttpStatus.BAD_REQUEST);
        // }
        console.log(files[0].buffer);
        // {
        // descriptions: string[],
        // detections: Detection[],
        // files: Buffer[]
        // }
        // 2023-05-28 15:40:40 {
        // 2023-05-28 15:40:40   fieldname: 'file',
        // 2023-05-28 15:40:40   originalname: '000N7AIAFT.jpg',
        // 2023-05-28 15:40:40   encoding: '7bit',
        // 2023-05-28 15:40:40   mimetype: 'image/jpeg',
        // 2023-05-28 15:40:40   buffer: <Buffer ff d8 ff e0 00 10 4a 46 49 46 00 01 01 00 00 01 00 01 00 00 ff db 00 43 00 08 06 06 07 06 05 08 07 07 07 09 09 08 0a 0c 14 0d 0c 0b 0b 0c 19 12 13 0f ... 89222 more bytes>,
        // 2023-05-28 15:40:40   size: 89272
        // 2023-05-28 15:40:40 }
        // 2023-05-28 15:40:40 [Object: null prototype] {
        // 2023-05-28 15:40:40   detections: '[{"width":153.33304256945848,"height":191.53843656554818,"top":61.135043283091406,"left":73.7217373760326},{"width":159.07767963409424,"height":185.96794247627258,"top":69.10345960295301,"left":70.87107754037297}]',
        // 2023-05-28 15:40:40   descriptions: '["000N7AIAFT.jpg","00H858UYSD.jpg"]'
        // 2023-05-28 15:40:40 }
        const result = await this.faceService.handleAllFaces(files, JSON.parse(dto.descriptions), JSON.parse(dto.detections));
        return result;
    }

    @Get()
    test() {
        return "test";
    }
}
