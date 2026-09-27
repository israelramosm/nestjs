import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PasswordsModule } from '#src/passwords/passwords.module';
import { ProfilesModule } from '#src/profiles/profiles.module';
import { User } from '#src/users/entities/user.entity';
import { UsersController } from '#src/users/users.controller';
import { UsersService } from '#src/users/users.service';

@Module({
	imports: [TypeOrmModule.forFeature([User]), ProfilesModule, PasswordsModule],
	controllers: [UsersController],
	providers: [UsersService],
	exports: [UsersService],
})
export class UsersModule {}
