import { PartialType } from '@nestjs/mapped-types';
import { CreatePasswordDto } from '#src/passwords/dto/create-password.dto';

export class UpdatePasswordDto extends PartialType(CreatePasswordDto) {}
