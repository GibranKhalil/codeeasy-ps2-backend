import { Inject, Injectable } from '@nestjs/common';
import { CreateSubmissionDto } from './dto/create-submission.dto';
import { UpdateSubmissionDto } from './dto/update-submission.dto';
import { ISubmissionsRepository } from 'src/@types/interfaces/repositories/iSubmissionsRepository';
import { PaginationParams } from 'src/@types/paginationParams.type';

@Injectable()
export class SubmissionsService {
  constructor(
    @Inject('ISubmissionsRepository')
    private readonly submissionRepository: ISubmissionsRepository,
  ) {}

  create(createSubmissionDto: CreateSubmissionDto) {
    const newSubmission = this.submissionRepository.create(createSubmissionDto);

    return this.submissionRepository.save(newSubmission);
  }

  findAll(pagination: PaginationParams) {
    return this.submissionRepository.find(pagination.page, pagination.limit);
  }

  findOne(id: number) {
    return this.submissionRepository.findOneBy({ id });
  }

  async update(id: number, updateSubmissionDto: UpdateSubmissionDto) {
    return this.submissionRepository.update(id, updateSubmissionDto);
  }

  remove(id: number) {
    return this.submissionRepository.delete(id);
  }
}
