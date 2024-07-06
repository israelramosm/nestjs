import { Password } from 'src/modules/passwords/entities/password.entity';
import { CreateUserDto } from '../dto/create-user.dto';
import { Profile } from 'src/modules/profiles/entities/profile.entity';
import { User } from '../entities/user.entity';

export const createUserDto = {
  firstname: 'Israel',
  lastname: 'Ramos',
  username: 'israelramos',
  email: 'israel_ramos@email.com',
  password: 'M1P@ssw0rd',
} as CreateUserDto;

export const password = {
  user: null,
  password_id: 'uuid',
  password: createUserDto.password,
  reset_password_code: null,
  created_at: new Date(),
  updated_at: new Date(),
  deleted_at: null,
} as Password;

export const profile = {
  profile_id: 'uuid',
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
  password: password,
  profile: profile,
  is_verified: false,
} as User;

export const userResult = {
  user_id: 'uuid',
  first_name: createUserDto.firstname,
  last_name: createUserDto.lastname,
  email: createUserDto.email,
  password: password,
  profile: profile,
  is_verified: false,
  created_at: new Date(),
  updated_at: new Date(),
  deleted_at: null,
} as User;
