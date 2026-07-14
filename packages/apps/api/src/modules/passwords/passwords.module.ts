import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Password } from './entities/password.entity';
import { PasswordsService } from './passwords.service';

@Module({
	imports: [TypeOrmModule.forFeature([Password])],
	controllers: [],
	providers: [PasswordsService],
	exports: [PasswordsService],
})
export class PasswordsModule {}
