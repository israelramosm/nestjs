import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/modules/users/users.service';
import * as bcrypt from 'bcrypt';
import { SignInUserDto } from './dto/sign-in.dto';
import { User } from '../users/entities/user.entity';
import { JwtPayload } from './auth';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(
    email: string,
    pass: string,
  ): Promise<Omit<User, 'password'>> {
    const user = await this.usersService.findOneByEmail(email);

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    const isMatch = await bcrypt.compare(pass, user.password.password);

    if (!isMatch) {
      throw new UnauthorizedException('Incorrect password');
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...result } = user;
    return result;
  }

  async login(loginUser: SignInUserDto) {
    const user = await this.validateUser(loginUser.email, loginUser.password);
    const payload: JwtPayload = {
      username: user.profile.username,
      sub: user.user_id,
    };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
