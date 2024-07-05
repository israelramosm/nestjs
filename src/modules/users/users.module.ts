import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { ProfilesModule } from '../profiles/profiles.module';
import { PasswordsModule } from '../passwords/passwords.module';

@Module({
  imports: [TypeOrmModule.forFeature([User]), ProfilesModule, PasswordsModule],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
