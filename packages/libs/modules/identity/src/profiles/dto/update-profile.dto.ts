import { PartialType } from '@nestjs/mapped-types';
import { CreateProfileDto } from '#src/profiles/dto/create-profile.dto';

export class UpdateProfileDto extends PartialType(CreateProfileDto) {}
