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
import { PaginationParams } from 'src/@types/paginationParams.type';
import { IRoleRepository } from 'src/@types/interfaces/repositories/iRolesRepository.interface';
import { JwtPayload } from 'src/@types/interfaces/jwtPayload.interface';

@Injectable()
export class UsersService {
  constructor(
    @Inject('IUsersRepository')
    private readonly usersRepository: IUsersRepository,
    @Inject('IRoleRepository')
    private readonly rolesRepository: IRoleRepository,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async login(loginUserDto: LoginUserDto): Promise<{ access_token: string }> {
    const user = await this.findUserByEmailOrUsername(loginUserDto, {
      withPassword: true,
    });
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
    return this.usersRepository.save(user);
  }

  findAll(page = 1, limit = 10) {
    return this.usersRepository.find(page, limit);
  }

  async findAllWithRole(pagination: PaginationParams) {
    return this.usersRepository.findAllWithRoles(pagination);
  }

  async findOne(id: number) {
    const user = await this.usersRepository.findOneBy({ id });

    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }

    return user;
  }

  async findUserByToken(token: string) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const decoded = this.jwtService.verify(token, {
      secret: this.configService.get('JWT_SECRET'),
    });
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    const userId = Number(decoded.sub);
    const user = await this.usersRepository.findUserWithRoles({ id: userId });

    if (!user) {
      throw new NotFoundException('Usuário não encontrado via token');
    }

    return user;
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

  async addRoleToUser(userId: number, roleId: number) {
    const user = await this.usersRepository.findOne({
      where: { id: userId },
      relations: ['roles'],
    });

    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }

    const role = await this.rolesRepository.findOneBy({ id: roleId });

    if (!role) {
      throw new NotFoundException('Role não encontrada');
    }

    const alreadyHasRole = user.roles.some((r) => r.id === role.id);

    if (alreadyHasRole) {
      throw new BadRequestException('O Usuáiro já têm essa role');
    }

    user.roles.push(role);
    await this.usersRepository.save(user);

    return user;
  }

  async deleteRoleFromUser(userId: number, roleId: number) {
    const user = await this.usersRepository.findOne({
      where: { id: userId },
      relations: ['roles'],
    });

    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }

    const hasRole = user.roles.some((r) => r.id === Number(roleId));

    if (!hasRole) {
      throw new BadRequestException('Usuário não tem essa role');
    }

    user.roles = user.roles.filter((role) => role.id !== Number(roleId));

    await this.usersRepository.save(user);

    return user;
  }

  private async findUserByEmailOrUsername(
    loginUserDto: LoginUserDto,
    password?: { withPassword: boolean },
  ): Promise<User> {
    const { email, username } = loginUserDto;
    let user: User | null = null;

    if (email) {
      user = await this.usersRepository.findUserWithRoles(
        { email },
        { withPassword: password?.withPassword },
      );
    } else if (username) {
      user = await this.usersRepository.findUserWithRoles(
        { username },
        { withPassword: password?.withPassword },
      );
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
    const payload: JwtPayload = {
      sub: user.id.toString(),
      username: user.username,
      role: user.roles.map((role) => role.name),
    };
    return {
      access_token: await this.jwtService.signAsync(payload, {
        secret: this.configService.get('JWT_SECRET'),
        expiresIn: '1h',
      }),
    };
  }
}
