import { Body, Controller, Get, Post, Request } from '@nestjs/common';
import { JwtPayload } from '#src/auth/auth';
import { AuthService } from '#src/auth/auth.service';
import { SignInUserDto } from '#src/auth/dto/sign-in.dto';
import { Public } from '#src/common/decorators/public';

@Controller('auth')
export class AuthController {
	constructor(private authService: AuthService) {}

	@Public()
	@Post('login')
	async login(@Body() body: SignInUserDto) {
		return this.authService.login(body);
	}

	@Get('profile')
	getProfile(@Request() req: { user: JwtPayload }) {
		return req.user;
	}
}
