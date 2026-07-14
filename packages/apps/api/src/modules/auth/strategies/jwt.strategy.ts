import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Environments } from '@template/configs-envs/Environments';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JwtPayload } from '../auth';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
	constructor(private configService: ConfigService) {
		super({
			jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
			ignoreExpiration: false,
			secretOrKey: configService.get<string>(Environments.JWT_SECRET),
		});
	}

	/**
	 * Validates the token and return to the client the user information
	 * associated with the JWT Passport strategy
	 * @param payload the login data about the user
	 * @returns The user register in this method
	 */
	async validate(payload: JwtPayload) {
		return payload;
	}
}
