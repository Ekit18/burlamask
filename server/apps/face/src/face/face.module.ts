import { HttpModule } from "@nestjs/axios";
import { Module, forwardRef } from "@nestjs/common";
import { SequelizeModule } from "@nestjs/sequelize";
import { FaceController } from "./face.controller";
import { FaceService } from "./face.service";
import { JwtModule } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";

@Module({
  controllers: [FaceController],
  providers: [FaceService],
  imports: [HttpModule,
    SequelizeModule.forFeature([Face]),
  ],
  exports: [FaceService]
})
export class FaceModule { }
