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
  Patch,
} from '@nestjs/common';
import { TutorialService } from './tutorial.service';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import type { CreateTutorialDto } from './dto/create-tutorial.dto';
import type { UpdateTutorialDto } from './dto/update-tutorial.dto';
import { PaginationParams } from 'src/@types/paginationParams.type';
import { FileInterceptor } from '@nestjs/platform-express';
import { InteractDto } from '../games/dto/interact.dto';

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
  findAll(
    @Query('page') page: number,
    @Query('limit') limit: number,
    @Query('category') category: number,
  ) {
    return this.tutorialsService.findAll(page, limit, { category });
  }

  @Get('/featured')
  findFeaturedContent() {
    return this.tutorialsService.findFeaturedTutorialsWithCreator();
  }

  @Get('/similar/:pid')
  findSimilarsTutorials(
    @Param('pid') pid: string,
    @Query('page') page: number,
    @Query('limit') limit: number,
  ) {
    return this.tutorialsService.findSimilars(page, limit, pid);
  }

  @Get('/creator/:id')
  @UseGuards(JwtAuthGuard)
  findTutorialsByCreator(
    @Param('id') id: number,
    @Query() pagination: PaginationParams,
  ) {
    return this.tutorialsService.findByCreator(id, pagination);
  }

  @Get('/pid/:pid')
  findOneByPid(@Param(':pid') pid: string) {
    return this.tutorialsService.findOneByPid(pid);
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

  @Patch(':pid/interact')
  addInteraction(
    @Param('pid') pid: string,
    @Body() interactionDto: InteractDto,
  ) {
    const validInteractions = ['views', 'likes'];
    if (!validInteractions.includes(interactionDto.type)) {
      throw new BadRequestException(
        `Tipo de interação inválido. Deve ser um dos seguintes: ${validInteractions.join(', ')}`,
      );
    }

    return this.tutorialsService.addInteraction(pid, interactionDto.type);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  remove(@Param('id') id: string) {
    return this.tutorialsService.remove(+id);
  }
}
