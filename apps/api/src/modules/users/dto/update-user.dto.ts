import { PartialType } from '@nestjs/swagger';
import type { UpdateUserInput } from '@aboutMe/contracts';

import { CreateUserDto } from './create-user.dto';

export class UpdateUserDto extends PartialType(CreateUserDto) implements UpdateUserInput {}
