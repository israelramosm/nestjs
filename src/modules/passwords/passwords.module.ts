import { Module } from '@nestjs/common';
import { PasswordsService } from './passwords.service';
import { Password } from './entities/password.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Password])],
  controllers: [],
  providers: [PasswordsService],
  exports: [PasswordsService],
})
export class PasswordsModule {}
