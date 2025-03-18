export class GithubUser {
  id: string;
  username: string;
  emails: Array<{ value: string }>;
  photos: Array<{ value: string }>;
}
