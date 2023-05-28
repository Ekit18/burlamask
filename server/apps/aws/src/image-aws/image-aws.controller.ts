import { Controller, HttpException, HttpStatus, Param, Post, Get, UploadedFiles, UseInterceptors, Delete, Inject, Body } from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { ApiOperation } from '@nestjs/swagger';
import { DeleteStaticDTO, GetPartTypesByBrandDTO, getAllStaticByBrandAndTypeDTO } from 'inq-shared-lib';
import { ImageAwsService } from './image-aws.service';
import { ConfigService } from '@nestjs/config';
import { config } from './file-options';
import { GetImageDTO } from 'apps/aws/dto/get-image.dto';
import { Image } from 'apps/aws/model/images.model';
import { DeleteImageDTO } from 'apps/aws/dto/delete-image.dto';
import { CreateImageDTO } from 'apps/aws/dto/create-image.dto';

export type FilesErrorObject = {
    isError: boolean,
    msg: string
}

@Controller('faceswap-aws')
export class ImageAwsController {
    static errObj: FilesErrorObject = Object();
    @Inject()
    static configService: ConfigService;
    constructor(
        private ImageAwsService: ImageAwsService
    ) { }

    static imageFilter(req: Request, file: Express.Multer.File, callback: (error: Error, acceptFile: boolean) => void) {
        ImageAwsController.errObj.isError = false;
        if (!file.mimetype.match(/(image\/)?(jpg|jpeg|png)/) || !file.originalname.match(/\.(jpg|jpeg|png)/)) {
            ImageAwsController.errObj.isError = true;
            ImageAwsController.errObj.msg = "Wrong data type";
        }
        if (file.size > config.MAX_FILE_SIZE) {
            ImageAwsController.errObj.isError = true;
            ImageAwsController.errObj.msg = "Wrong data size";
        }
        console.log(config.MAX_FILE_SIZE);
        callback(null, true);
    }


    // @ApiOperation({ summary: 'Get all images from S3' })
    // @Get()
    // async getAllImages(): Promise<Image[]> {
    //     const images: Image[] = await this.ImageAwsService.getAllImages();
    //     return images;
    // }

    // @ApiOperation({ summary: 'Get image from S3 by id' })
    // @Get(':imageId')
    // async getImage(@Param() imageId: GetImageDTO): Promise<Image> {
    //     const image: Image = await this.ImageAwsService.getImage(imageId.imageId);
    //     return image;
    // }

    // @ApiOperation({ summary: 'Push image of a part to S3' })
    // @Post()
    // @UseInterceptors(FilesInterceptor('file', config.MAX_NUM_FILES, { limits: { fieldSize: config.MAX_FILE_SIZE }, fileFilter: ImageAwsController.imageFilter }))
    // async addPartImg(
    //     @UploadedFiles() files: Array<Express.Multer.File>,
    //     @Body() imageData: CreateImageDTO// ??? There must be description array instead of one string
    // ) {
    //     if (ImageAwsController.errObj.isError) {
    //         throw new HttpException(ImageAwsController.errObj.msg, HttpStatus.BAD_REQUEST);
    //     }
    //     await ImageAwsService.checkNSFWFiles(files, ImageAwsController.errObj);
    //     if (ImageAwsController.errObj.isError) {
    //         throw new HttpException(ImageAwsController.errObj.msg, HttpStatus.BAD_REQUEST);
    //     }
    //     const urls: string[] = await Promise.all(
    //         files.map(
    //             (file, index) => this.ImageAwsService.addImage(file.buffer, file.originalname, imageData[index])
    //         )
    //     );
    //     return urls;
    // }

    // @ApiOperation({ summary: 'Delete static file from S3 and DB' })
    // @Delete(':imageId')
    // deleteStaticFile(@Param() imageId: DeleteImageDTO) {
    //     console.log(imageId.imageId);
    //     this.ImageAwsService.deletePublicFile(imageId.imageId);
    //     return true;
    // }
}
