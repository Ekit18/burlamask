import { Controller } from '@nestjs/common';
import { Ctx, MessagePattern, Payload, RmqContext } from '@nestjs/microservices';
import { Part, RmqService } from "inq-shared-lib";
import { ImageAwsService } from './image-aws.service';
import ImageSearchService from '../image-aws-search/image-search.service';

interface AddImagePayload {
    file: Express.Multer.File,
    description: string;
    originalName: string;
}
interface IndexImagePayload {
    imageId: number,
    description: string;
}

interface RMQBuffer extends Buffer {
    data: number[]
}

@Controller()
export class ImageAwsRmqController {
    constructor(
        private imageAwsService: ImageAwsService,
        private readonly rmqService: RmqService,
        private readonly searchService: ImageSearchService,
    ) { }

    @MessagePattern({ role: "aws", cmd: 'addImage' })
    addImage(@Payload() payload: AddImagePayload, @Ctx() context: RmqContext) {
        this.rmqService.ack(context);
        console.log("RMQMRMQ");
        console.log(payload.file);
        console.log(payload.file.originalname);
        return this.imageAwsService.addImage(Buffer.from((payload.file.buffer as RMQBuffer).data), payload.file.originalname, payload.description);
    }
    @MessagePattern({ role: "aws", cmd: 'addModifiedImage' })
    addModifiedImage(@Payload() payload: AddImagePayload, @Ctx() context: RmqContext) {
        this.rmqService.ack(context);
        console.log("RMQMRMQ222222222222222222222222222222");
        console.log(payload);
        console.log(payload.file.originalname);
        return this.imageAwsService.addModifiedImage(Buffer.from((payload.file.buffer as RMQBuffer).data), payload.file.originalname, payload.description);
    }

    @MessagePattern({ role: "elastic", cmd: 'indexImage' })
    indexImages(@Payload() payload: IndexImagePayload, @Ctx() context: RmqContext) {
        this.rmqService.ack(context);
        console.log(payload);
        return this.searchService.indexImages(payload.imageId, payload.description);
    }
}
