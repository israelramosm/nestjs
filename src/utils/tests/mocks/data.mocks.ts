import { Password } from 'src/modules/passwords/entities/password.entity';
import { CreateUserDto } from '../../../modules/users/dto/create-user.dto';
import { Profile } from 'src/modules/profiles/entities/profile.entity';
import { User } from '../../../modules/users/entities/user.entity';
import { v4 as uuidv4 } from 'uuid';
import { CreateProfileDto } from 'src/modules/profiles/dto/create-profile.dto';
import { CreatePasswordDto } from 'src/modules/passwords/dto/create-password.dto';

const passwordId = uuidv4();
const profileId = uuidv4();
const userId = uuidv4();

export const createUserDto = {
  firstname: 'Israel',
  lastname: 'Ramos',
  username: 'israelramos',
  email: 'israel_ramos@email.com',
  password: 'M1P@ssw0rd',
} as CreateUserDto;

export const createProfileDto = {
  username: createUserDto.username,
} as CreateProfileDto;

export const createPasswordDto = {
  password: createUserDto.password,
} as CreatePasswordDto;

export const passwordResult = {
  user: null,
  password_id: passwordId,
  password: createUserDto.password,
  reset_password_code: null,
  created_at: new Date(),
  updated_at: new Date(),
  deleted_at: null,
} as Password;

export const profileResult = {
  profile_id: profileId,
  username: createUserDto.username,
  user: null,
  photo_url: '',
  gender: null,
  birthday: null,
  created_at: new Date(),
  updated_at: new Date(),
  deleted_at: null,
} as Profile;

export const userCallWith = {
  first_name: createUserDto.firstname,
  last_name: createUserDto.lastname,
  email: createUserDto.email,
  password: passwordResult,
  profile: profileResult,
  is_verified: false,
} as User;

export const userResult = {
  user_id: userId,
  first_name: createUserDto.firstname,
  last_name: createUserDto.lastname,
  email: createUserDto.email,
  password: passwordResult,
  profile: profileResult,
  is_verified: false,
  created_at: new Date(),
  updated_at: new Date(),
  deleted_at: null,
} as User;

export const profileRemovedResult = {
  raw: [],
  affected: 1,
  profile_id: profileId,
  username: createUserDto.username,
};

export const passwordRemovedResult = {
  raw: [],
  affected: 1,
  password_id: passwordId,
};

export const userRemovedResult = {
  raw: [],
  affected: 1,
  user_id: userId,
  email: createUserDto.email,
  first_name: createUserDto.firstname,
  last_name: createUserDto.lastname,
  profile: profileRemovedResult,
  password: passwordRemovedResult,
};
