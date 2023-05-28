import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { APP_FILTER } from "@nestjs/core";
import { SequelizeModule } from "@nestjs/sequelize";
import {
    AllExceptionsFilter, RmqService,
} from "inq-shared-lib";
import { ImageAwsModule } from "./image-aws/image-aws.module";
import { Image } from "../model/images.model";
import { ImageAwsRmqController } from "./image-aws/image-aws-rmq.controller";
import { ImageAwsController } from "./image-aws/image-aws.controller";
import { ImageSearchModule } from "./image-aws-search/image-search.module";

@Module({
    controllers: [ImageAwsRmqController, ImageAwsController],
    imports: [
        ConfigModule.forRoot({
            envFilePath: ['.env'],
            isGlobal: true,
        }),
        // ServeStaticModule.forRoot({
        //     rootPath: join(__dirname, '..', '/src/', 'static'),
        // }),
        SequelizeModule.forRoot({
            dialect: 'postgres',
            host: process.env.POSTGRES_HOST,
            port: Number(process.env.POSTGRES_PORT),
            username: process.env.POSTGRES_USER,
            password: process.env.POSTGRES_PASSWORD,
            database: process.env.POSTGRES_DB,
            models: [Image],
            autoLoadModels: true,
            // dialectOptions: {
            //     ssl: {
            //         require: true,
            //         rejectUnauthorized: false,
            //     }
            // }
        }),
        ImageSearchModule,
        ImageAwsModule,
        ImageSearchModule
    ],
    providers: [
        // {
        //     provide: APP_GUARD,
        //     useClass: JwtAuthGuard
        // },
        // {
        //     provide: APP_GUARD,
        //     useClass: RolesGuard
        //  },
        {
            provide: APP_FILTER,
            useClass: AllExceptionsFilter,
        },
        {
            provide: RmqService,
            useFactory: (configService: ConfigService) => {
                console.log(`POSTGRES:::::::${process.env.POSTGRES_HOST}`);
                return new RmqService(configService);
            },
            inject: [ConfigService],
        },
    ],
})
export class AppModule { }
