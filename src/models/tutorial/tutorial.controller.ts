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
} from '@nestjs/common';
import { TutorialService } from './tutorial.service';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import type { CreateTutorialDto } from './dto/create-tutorial.dto';
import type { UpdateTutorialDto } from './dto/update-tutorial.dto';
import { PaginationParams } from 'src/@types/paginationParams.type';

@Controller('tutorials')
export class TutorialController {
  constructor(private readonly tutorialsService: TutorialService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  create(@Body() createTutorialDto: CreateTutorialDto) {
    return this.tutorialsService.create(createTutorialDto);
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
