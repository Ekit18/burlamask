import { HttpService } from "@nestjs/axios";
import { Controller, UseGuards, Post, Body, Get, Param, Put, Delete, UploadedFiles } from "@nestjs/common";
import { ApiProperty, ApiTags, ApiOperation, ApiResponse } from "@nestjs/swagger";
import { FaceService } from "./face.service";

class ModelResponse {
    @ApiProperty({ example: 'Octavia' })
    model: string;
}

@ApiTags("Faces")
@Controller('Face')
export class FaceController {
    constructor(private FaceService: FaceService, private readonly httpService: HttpService) { }

    @Post()
    create(@UploadedFiles() files: Array<Express.Multer.File>, @Body() dto: ChangeFacesDto) {
        return this.FaceService.changeFaces(files, dto);
    }
}
