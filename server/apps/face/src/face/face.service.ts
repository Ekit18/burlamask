import { Injectable, HttpException, HttpStatus } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { Face, FaceDto, GetFaceByModelDto, GetFaceByBrandIdDto, UpdateFaceDto } from "inq-shared-lib";

@Injectable()
export class FaceService {
    constructor(@InjectModel(Face) private FaceRepository: typeof Face) { }

    async changeFaces(files: )
}
