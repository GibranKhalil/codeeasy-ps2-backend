/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
import {
  Controller,
  Post,
  Get,
  Delete,
  UploadedFile,
  Param,
  UseInterceptors,
  UseGuards,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { StorageService } from './storage.service';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';

@Controller('storage')
@UseGuards(JwtAuthGuard)
export class StorageController {
  constructor(private readonly storageService: StorageService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadImage(@UploadedFile() file: Express.Multer.File) {
    const url = await this.storageService.uploadFile(
      file.buffer,
      file.originalname,
      file.mimetype,
    );

    return { url };
  }

  @Get(':fileName')
  async getFileUrl(@Param('fileName') fileName: string) {
    const url = await this.storageService.getFileUrl(fileName);
    return { url };
  }

  @Delete(':fileName')
  async deleteFile(@Param('fileName') fileName: string) {
    return await this.storageService.deleteFile(fileName);
  }
}
