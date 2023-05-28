import { S3Client } from "@aws-sdk/client-s3";
import { Module, forwardRef } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { SequelizeModule } from "@nestjs/sequelize";
import { PartsGuidesAWS, Part, RmqModule, PARTS_QUEUE, JWTGuardRegisterModule, RmqService } from "inq-shared-lib";
import { ImageAwsService } from "./image-aws.service";
import { ImageAwsController } from "./image-aws.controller";
import { Image } from "apps/aws/model/images.model";
import { ImageSearchModule } from "../image-aws-search/image-search.module";
import { ImageAwsRmqController } from "./image-aws-rmq.controller";


@Module({
  controllers: [],
  providers: [
    ImageAwsService,
    {
      provide: S3Client,
      useFactory: (configService: ConfigService) =>
        new S3Client({
          region: configService.get<string>('AWS_REGION'),
          credentials: {
            accessKeyId: configService.get<string>('AWS_ACCESS_KEY_ID'),
            secretAccessKey: configService.get<string>('AWS_SECRET_ACCESS_KEY',),
          },
        }),
      inject: [ConfigService],
    },
  ],
  imports: [
    SequelizeModule.forFeature([Image]),
    ImageSearchModule
  ],
  exports: [
    ImageAwsService
  ]
})
export class ImageAwsModule { }
