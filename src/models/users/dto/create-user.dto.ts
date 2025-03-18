import type { eUserRoles } from 'src/@types/enums/eUserRoles.enum';

export class CreateUserDto {
  username: string;
  password?: string;
  email: string;
  githubId?: string;
  avatarUrl?: string;
  role?: eUserRoles;
}
