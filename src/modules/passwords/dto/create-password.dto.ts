import { IsNotEmpty, Matches } from 'class-validator';
import { PASSWORD_REGEX } from 'src/common/constants';

export class CreatePasswordDto {
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
