import {
  Injectable,
  UnauthorizedException,
  NotFoundException,
  BadRequestException,
  Inject,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import type { User } from './entities/user.entity';
import type { LoginUserDto } from './dto/login-user.dto';
import type { CreateUserDto } from './dto/create-user.dto';
import type { UpdateUserDto } from './dto/update-user.dto';
import type { IUsersRepository } from 'src/@types/interfaces/repositories/iUserRepository.interface';
import type { GithubUser } from './dto/github-user.dto';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UsersService {
  constructor(
    @Inject('IUsersRepository')
    private readonly usersRepository: IUsersRepository,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async login(loginUserDto: LoginUserDto): Promise<{ access_token: string }> {
    const user = await this.findUserByEmailOrUsername(loginUserDto);
    await this.validatePassword(loginUserDto.password, user.password);
    return await this.generateAuthToken(user);
  }

  async githubLogin(githubUser: GithubUser) {
    let user = await this.usersRepository.findByGithubId(githubUser.id);

    if (!user) {
      user = await this.usersRepository.save({
        username: githubUser.username,
        email: githubUser.emails[0]?.value,
        githubId: githubUser.id,
        avatarUrl: githubUser.photos[0]?.value,
      });
    }

    return this.generateAuthToken(user);
  }

  async create(createUserDto: CreateUserDto): Promise<User> {
    if (!createUserDto.password) {
      throw new BadRequestException('A Senha é obrigatória');
    }

    const hashedPassword = await this.hashPassword(createUserDto.password);
    const user = this.usersRepository.create({
      ...createUserDto,
      password: hashedPassword,
    });

    console.log(user);
    return this.usersRepository.save(user);
  }

  findAll() {
    return this.usersRepository.find();
  }

  findOne(id: number) {
    return this.usersRepository.findOneBy({ id });
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    if (updateUserDto.password) {
      updateUserDto.password = await this.hashPassword(updateUserDto.password);
    }
    return this.usersRepository.update(id, updateUserDto);
  }

  remove(id: number) {
    return this.usersRepository.delete(id);
  }

  private async findUserByEmailOrUsername(
    loginUserDto: LoginUserDto,
  ): Promise<User> {
    const { email, username } = loginUserDto;
    let user: User | null = null;

    if (email) {
      user = await this.usersRepository.findByEmail(email);
    } else if (username) {
      user = await this.usersRepository.findByUsername(username);
    }

    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }
    return user;
  }

  private async validatePassword(
    password: string,
    hashedPassword: string,
  ): Promise<void> {
    const isPasswordValid = await bcrypt.compare(password, hashedPassword);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Verifique os dados e tente novamente');
    }
  }

  private async hashPassword(password: string): Promise<string> {
    return await bcrypt.hash(password, 10);
  }

  private async generateAuthToken(user: User) {
    const payload = { sub: user.id.toString(), username: user.username };
    return {
      access_token: await this.jwtService.signAsync(payload, {
        secret: this.configService.get('JWT_SECRET'),
        expiresIn: '1h',
      }),
    };
  }
}
