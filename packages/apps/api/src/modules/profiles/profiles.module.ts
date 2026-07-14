import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Profile } from './entities/profile.entity';
import { ProfileController } from './profiles.controller';
import { ProfilesService } from './profiles.service';

@Module({
	imports: [TypeOrmModule.forFeature([Profile])],
	controllers: [ProfileController],
	providers: [ProfilesService],
	exports: [ProfilesService],
})
export class ProfilesModule {}
