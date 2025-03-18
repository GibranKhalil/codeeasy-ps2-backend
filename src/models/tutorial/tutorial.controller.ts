import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import { TutorialService } from './tutorial.service';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import type { CreateTutorialDto } from './dto/create-tutorial.dto';
import type { UpdateTutorialDto } from './dto/update-tutorial.dto';

@Controller('tutorials')
@UseGuards(JwtAuthGuard)
export class TutorialController {
  constructor(private readonly tutorialsService: TutorialService) {}

  @Post()
  create(@Body() createTutorialDto: CreateTutorialDto) {
    return this.tutorialsService.create(createTutorialDto);
  }

  @Get()
  findAll() {
    return this.tutorialsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.tutorialsService.findOne(+id);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() updateTutorialDto: UpdateTutorialDto,
  ) {
    return this.tutorialsService.update(+id, updateTutorialDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.tutorialsService.remove(+id);
  }
}
