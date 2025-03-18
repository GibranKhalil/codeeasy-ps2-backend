import type { eUserRoles } from 'src/@types/enums/eUserRoles.enum';
import type { SocialLinks } from 'src/@types/socialLinks.type';

export class User {
  id: number;
  username: string;
  password: string;
  email: string;
  bio: string;
  links: SocialLinks;
  createdAt: Date;
  updatedAt: Date;
  lastLoginAt: Date;
  githubId?: string;
  avatarUrl?: string;
  role: eUserRoles;
}
