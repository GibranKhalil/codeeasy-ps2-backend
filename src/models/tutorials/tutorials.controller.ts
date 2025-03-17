import { Controller, Post, Body, UseGuards, Request } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { TutorialsService } from './tutorials.service';
import { CreateTutorialDto } from './dto/create-tutorial.dto';

@Controller('tutorials')
@UseGuards(JwtAuthGuard)
export class TutorialsController {
  constructor(private readonly tutorialsService: TutorialsService) {}

  @Post()
  async create(@Body() createTutorialDto: CreateTutorialDto, @Request() req) {
    return this.tutorialsService.create(createTutorialDto, req.user.userId);
  }
}