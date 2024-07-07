import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { PasswordsService } from './passwords.service';
import { CreatePasswordDto } from './dto/create-password.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';

@Controller('passwords')
export class PasswordsController {
  constructor(private readonly passwordsService: PasswordsService) {}

  @Post()
  create(@Body() createPasswordDto: CreatePasswordDto) {
    return this.passwordsService.create(createPasswordDto);
  }

  @Get()
  findAll() {
    return this.passwordsService.findAll();
  }

  @Get(':passwordId')
  findOneById(@Param('passwordId') passwordId: string) {
    return this.passwordsService.findOneById(passwordId);
  }

  @Patch(':passwordId')
  update(
    @Param('passwordId') passwordId: string,
    @Body() updatePasswordDto: UpdatePasswordDto,
  ) {
    return this.passwordsService.update(passwordId, updatePasswordDto);
  }

  @Delete(':passwordId')
  remove(@Param('passwordId') passwordId: string) {
    return this.passwordsService.remove(passwordId);
  }
}
