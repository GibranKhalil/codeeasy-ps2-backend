import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
  Query,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
} from '@nestjs/common';
import { TutorialService } from './tutorial.service';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import type { CreateTutorialDto } from './dto/create-tutorial.dto';
import type { UpdateTutorialDto } from './dto/update-tutorial.dto';
import { PaginationParams } from 'src/@types/paginationParams.type';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('tutorials')
export class TutorialController {
  constructor(private readonly tutorialsService: TutorialService) {}

  @Post()
  @UseInterceptors(FileInterceptor('coverImage'))
  @UseGuards(JwtAuthGuard)
  create(
    @Body() createTutorialDto: CreateTutorialDto,
    @UploadedFile() coverImage: Express.Multer.File,
  ) {
    if (!coverImage) {
      throw new BadRequestException(
        'É preciso que o tutorial tenha uma foto de capa',
      );
    }

    if (!createTutorialDto.creatorId) {
      throw new BadRequestException(
        'É preciso que o tutorial tenha um criador',
      );
    }

    if (!createTutorialDto.categoryId) {
      throw new BadRequestException(
        'É preciso que o tutorial tenha uma categoria',
      );
    }

    const imageSizeInBytes = coverImage.size;
    const imageSizeInMB = imageSizeInBytes / (1024 * 1024);

    if (imageSizeInMB > 5) {
      throw new BadRequestException(
        'A imagem de capa não pode ser maior que 5MB',
      );
    }

    return this.tutorialsService.create(createTutorialDto, coverImage);
  }

  @Get()
  findAll() {
    return this.tutorialsService.findAll();
  }

  @Get('/featured')
  findFeaturedContent() {
    return this.tutorialsService.findFeaturedTutorialsWithCreator();
  }

  @Get('/creator/:id')
  @UseGuards(JwtAuthGuard)
  findTutorialsByCreator(
    @Param('id') id: number,
    @Query() pagination: PaginationParams,
  ) {
    return this.tutorialsService.findByCreator(id, pagination);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.tutorialsService.findOne(+id);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  update(
    @Param('id') id: string,
    @Body() updateTutorialDto: UpdateTutorialDto,
  ) {
    return this.tutorialsService.update(+id, updateTutorialDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  remove(@Param('id') id: string) {
    return this.tutorialsService.remove(+id);
  }
}
