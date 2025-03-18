import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';

// eslint-disable-next-line @typescript-eslint/no-unsafe-call
export class UpdateUserDto extends PartialType(CreateUserDto, {
  skipNullProperties: true,
}) {}
