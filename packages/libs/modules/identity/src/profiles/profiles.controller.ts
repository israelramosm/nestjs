import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { CreateProfileDto } from '#src/profiles/dto/create-profile.dto';
import { UpdateProfileDto } from '#src/profiles/dto/update-profile.dto';
import { ProfilesService } from '#src/profiles/profiles.service';

@Controller('profiles')
export class ProfileController {
	constructor(private readonly profilesService: ProfilesService) {}

	@Post()
	create(@Body() createProfileDto: CreateProfileDto) {
		return this.profilesService.create(createProfileDto);
	}

	@Get()
	findAll() {
		return this.profilesService.findAll();
	}

	@Get(':profileId')
	findOneById(@Param('profileId') profileId: string) {
		return this.profilesService.findOneById(profileId);
	}

	@Patch(':profileId')
	update(@Param('profileId') profileId: string, @Body() updateProfileDto: UpdateProfileDto) {
		return this.profilesService.update(profileId, updateProfileDto);
	}

	@Delete(':profileId')
	remove(@Param('profileId') profileId: string) {
		return this.profilesService.remove(profileId);
	}
}
