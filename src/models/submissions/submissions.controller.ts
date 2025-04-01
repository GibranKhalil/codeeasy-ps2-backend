import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  BadRequestException,
} from '@nestjs/common';
import { SubmissionsService } from './submissions.service';
import { CreateSubmissionDto } from './dto/create-submission.dto';
import { UpdateSubmissionDto } from './dto/update-submission.dto';
import { PaginationParams } from 'src/@types/paginationParams.type';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { Roles } from 'src/decorators/roles.decorators';
import { RolesGuard } from 'src/guards/roles.guard';
import { eContentStatus } from 'src/@types/enums/eContentStatus.enum';

@Controller('submissions')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin', 'moderator')
export class SubmissionsController {
  constructor(private readonly submissionsService: SubmissionsService) {}

  @Post()
  create(@Body() createSubmissionDto: CreateSubmissionDto) {
    return this.submissionsService.create(createSubmissionDto);
  }

  @Get()
  findAll(@Query() pagination: PaginationParams) {
    return this.submissionsService.findAll(pagination);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.submissionsService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateSubmissionDto: UpdateSubmissionDto,
  ) {
    return this.submissionsService.update(+id, updateSubmissionDto);
  }

  @Patch('resolve/:id')
  resolveSubmission(
    @Param('id') id: string,
    @Body() updateSubmissionDto: UpdateSubmissionDto,
  ) {
    if (
      !updateSubmissionDto.game ||
      !updateSubmissionDto.snippet ||
      !updateSubmissionDto.tutorial
    ) {
      throw new BadRequestException(
        'É necessário que a submissão esteja envolvida com um conteúdo',
      );
    }

    if (
      !updateSubmissionDto.comment &&
      updateSubmissionDto.status === eContentStatus.REJECTED
    ) {
      throw new BadRequestException(
        'Para rejeitar uma submissão deve-se explicar os motivos',
      );
    }

    return this.submissionsService.resolveSubmission(+id, updateSubmissionDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.submissionsService.remove(+id);
  }
}
