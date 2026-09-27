import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Password } from '#src/passwords/entities/password.entity';
import { PasswordsService } from '#src/passwords/passwords.service';

@Module({
	imports: [TypeOrmModule.forFeature([Password])],
	controllers: [],
	providers: [PasswordsService],
	exports: [PasswordsService],
})
export class PasswordsModule {}
