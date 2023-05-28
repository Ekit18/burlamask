import { HttpModule } from "@nestjs/axios";
import { Module, forwardRef } from "@nestjs/common";
import { SequelizeModule } from "@nestjs/sequelize";
import { FaceController } from "./face.controller";
import { FaceService } from "./face.service";
import { JwtModule } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import { AWS_QUEUE, RmqModule, RmqService } from "inq-shared-lib";

@Module({
  controllers: [FaceController],
  providers: [
    FaceService,
  ],
  imports: [
    HttpModule,
    RmqModule.register({ name: AWS_QUEUE }),
  ],
  exports: [FaceService]
})
export class FaceModule { }
