import {
  IsAlphanumeric,
  IsDateString,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateProfileDto {
  @IsNotEmpty()
  @MinLength(3, { message: 'Username must have atleast 3 characters.' })
  @IsAlphanumeric(undefined, {
    message: 'Username does not allow other than alpha numeric chars.',
  })
  username: string;

  @IsString()
  photo_url?: string;

  @IsString()
  gender?: string;

  @MaxLength(10)
  @IsDateString()
  birthday?: string;
}
