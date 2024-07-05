import {
  IsAlphanumeric,
  IsEmail,
  IsNotEmpty,
  IsString,
  Matches,
  MinLength,
} from 'class-validator';
import { PASSWORD_REGEX } from 'src/common/constants';

export class CreateUserDto {
  @IsString()
  @MinLength(2, { message: 'Fisrt name must have atleast 2 characters.' })
  @IsNotEmpty()
  first_name: string;

  @IsString()
  @MinLength(2, { message: 'Last name must have atleast 2 characters.' })
  @IsNotEmpty()
  last_name: string;

  @IsNotEmpty()
  @MinLength(3, { message: 'Username must have atleast 3 characters.' })
  @IsAlphanumeric(undefined, {
    message: 'Username does not allow other than alpha numeric chars.',
  })
  username: string;

  @IsNotEmpty()
  @IsEmail(undefined, { message: 'Please provide valid Email.' })
  email: string;

  @IsNotEmpty()
  @Matches(PASSWORD_REGEX, {
    message: `Password must contain Minimum 8 and maximum 20 characters, 
      at least one uppercase letter, 
      one lowercase letter, 
      one number and 
      one special character`,
  })
  password: string;
}
