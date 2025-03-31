import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtPayload } from 'src/@types/interfaces/jwtPayload.interface';
import { ROLES_KEY } from 'src/decorators/roles.decorators';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    const { user }: { user: JwtPayload } = context.switchToHttp().getRequest();

    const hasRole = user.role?.some((role: string) =>
      requiredRoles.includes(role),
    );

    if (!hasRole) {
      throw new ForbiddenException(
        'Você não tem permissão para acessar esta rota.',
      );
    }

    return hasRole;
  }
}
