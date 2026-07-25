import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { Public } from '#src/common/decorators/public';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
	constructor(private readonly usersService: UsersService) {}

	@Post()
	@Public()
	create(@Body() createUserDto: CreateUserDto) {
		return this.usersService.create(createUserDto);
	}

	@Get()
	findAll() {
		return this.usersService.findAll();
	}

	@Get(':userId')
	findOneById(@Param('userId') userId: string) {
		return this.usersService.findOneById(userId);
	}

	@Patch(':userId')
	update(@Param('userId') userId: string, @Body() updateUserDto: UpdateUserDto) {
		return this.usersService.update(userId, updateUserDto);
	}

	@Delete(':userId')
	remove(@Param('userId') userId: string) {
		return this.usersService.remove(userId);
	}
}
