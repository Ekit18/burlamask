import { Controller } from '@nestjs/common';
import { Ctx, MessagePattern, Payload, RmqContext } from '@nestjs/microservices';
import { Part, RmqService } from "inq-shared-lib";
import { FaceService } from './face.service';

@Controller()
export class FacedRmqController {
    constructor(private FaceService: FaceService, private readonly rmqService: RmqService) { }

    @MessagePattern({ role: "Face", cmd: 'getFaceById' })
    findOneByPartId(@Payload() FaceId: number, @Ctx() context: RmqContext) {
        this.rmqService.ack(context);
        console.log(FaceId);
        return this.FaceService.getFaceById(FaceId);
    }
}
