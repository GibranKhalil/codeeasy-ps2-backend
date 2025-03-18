export class CreateUserDto {
  username: string;
  password?: string;
  email: string;
  githubId?: string;
  avatarUrl?: string;
}
