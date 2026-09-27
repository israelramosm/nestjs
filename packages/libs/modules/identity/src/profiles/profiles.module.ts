import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Profile } from '#src/profiles/entities/profile.entity';
import { ProfileController } from '#src/profiles/profiles.controller';
import { ProfilesService } from '#src/profiles/profiles.service';

@Module({
	imports: [TypeOrmModule.forFeature([Profile])],
	controllers: [ProfileController],
	providers: [ProfilesService],
	exports: [ProfilesService],
})
export class ProfilesModule {}
