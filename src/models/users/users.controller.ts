import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { UsersService } from './users.service';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { AuthGuard } from '@nestjs/passport';
import type { UpdateUserDto } from './dto/update-user.dto';
import type { CreateUserDto } from './dto/create-user.dto';
import type { LoginUserDto } from './dto/login-user.dto';
import { GithubUser } from './dto/github-user.dto';
import { PaginationParams } from 'src/@types/paginationParams.type';
import { AddRoleToUserDto } from './dto/add-role-to-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('login')
  async login(@Body() loginUserDto: LoginUserDto) {
    return await this.usersService.login(loginUserDto);
  }

  @Get('auth/github')
  @UseGuards(AuthGuard('github'))
  async githubAuth() {
    // Essa rota redirecionará para o github
  }

  @Get('auth/github/callback')
  @UseGuards(AuthGuard('github'))
  async githubAuthCallback(@Req() req: Request, @Res() res: Response) {
    const token = await this.usersService.githubLogin(req.user as GithubUser);
    return res.json({ token });
  }

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  findAll() {
    return this.usersService.findAll();
  }

  @Get('roles')
  @UseGuards(JwtAuthGuard)
  findAllWithRole(@Query() pagination: PaginationParams) {
    return this.usersService.findAllWithRole(pagination);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(+id);
  }

  @Get('token/:token')
  findOneByToken(@Param('token') token: string) {
    return this.usersService.findUserByToken(token);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(+id, updateUserDto);
  }

  @Patch(':id/roles')
  @UseGuards(JwtAuthGuard)
  async addRole(@Param('id') userId: number, @Body() dto: AddRoleToUserDto) {
    return this.usersService.addRoleToUser(userId, dto.roleId);
  }

  @Delete(':userId/:roleId')
  @UseGuards(JwtAuthGuard)
  async deleteRole(
    @Param('userId') userId: number,
    @Param('roleId') roleId: number,
  ) {
    return this.usersService.deleteRoleFromUser(userId, roleId);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }
}
