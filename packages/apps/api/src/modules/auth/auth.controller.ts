import { Body, Controller, Get, Logger, Post, Request } from '@nestjs/common';
import { Public } from '#src/common/decorators/public';
import { JwtPayload } from './auth';
import { AuthService } from './auth.service';
import { SignInUserDto } from './dto/sign-in.dto';

@Controller('auth')
export class AuthController {
	private readonly logger = new Logger(AuthController.name);

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
