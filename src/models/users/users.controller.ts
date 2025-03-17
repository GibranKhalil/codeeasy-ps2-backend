import { Controller, Post, Get, Body, Query, HttpCode, HttpStatus, UseGuards, Req } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { ThrottlerGuard } from '@nestjs/throttler';
import { PaginationQueryDto } from '../common/dto/pagination-query.dto';
import { createPaginatedResponse } from '../common/utils/pagination.util';
import { Request } from 'express';

@Controller('users')
@UseGuards(ThrottlerGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createUserDto: CreateUserDto) {
    try {
      const user = await this.usersService.create(
        createUserDto.email,
        createUserDto.password,
      );
      const { password, ...result } = user;
      return {
        statusCode: HttpStatus.CREATED,
        message: 'User created successfully',
        data: result,
      };
    } catch (error) {
      throw error;
    }
  }

  @Get()
  async findAll(@Query() paginationQuery: PaginationQueryDto, @Req() request: Request) {
    const { page, limit } = paginationQuery;
    const { users, total } = await this.usersService.findAll(page, limit);
    
    const baseUrl = `${request.protocol}://${request.get('host')}${request.path}`;
    return createPaginatedResponse(
      users.map(user => {
        const { password, ...result } = user;
        return result;
      }),
      total,
      page || 0,
      limit || 10,
      baseUrl
    );
  }
}