import { Module } from '@nestjs/common';
import { ProfilesService } from './profiles.service';
import { ProfileController } from './profiles.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Profile } from './entities/profile.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Profile])],
  controllers: [ProfileController],
  providers: [ProfilesService],
  exports: [ProfilesService],
})
export class ProfilesModule {}
