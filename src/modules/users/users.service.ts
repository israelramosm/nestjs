import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, FindOneOptions, Repository } from 'typeorm';
import {
  findUserByEmailQuery,
  findUserByUserIdQuery,
} from './queries/user.queries';
import { ProfilesService } from '../profiles/profiles.service';
import { PasswordsService } from '../passwords/passwords.service';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly passwordsService: PasswordsService,
    private readonly profilesService: ProfilesService,
  ) {}

  /**
   * this function used to get data of use whose id is passed in parameter
   * @param options is type of FindOneOptions, which represent the options to search a user.
   * @returns promise of user
   */
  private findOneOnRepository(options?: FindOneOptions): Promise<User> {
    return this.userRepository.findOne(options);
  }

  /**
   * this is function is used to create User in User Entity.
   * @param createUserDto this will type of createUserDto in which
   * we have defined what are the keys we are expecting from body
   * @returns promise of user
   */
  async create(createUserDto: CreateUserDto): Promise<User> {
    const { email, firstname, lastname, username, password } = createUserDto;
    this.logger.log(`Create user :: ${email} ...`);
    const userExist = await this.findOneOnRepository(
      findUserByEmailQuery(email),
    );

    if (userExist) {
      this.logger.error('User email already exist');
      throw new HttpException('User email already exist', HttpStatus.CONFLICT);
    }

    const pass = await this.passwordsService.create({ password });
    const profile = await this.profilesService.create({ username });

    const user: User = new User();
    user.first_name = firstname;
    user.last_name = lastname;
    user.email = email;
    user.password = pass;
    user.profile = profile;

    return this.userRepository.save(user);
  }

  /**
   * this function is used to get all the user's list
   * @param options is type of FindManyOptions, which represent the options to search users.
   * @returns promise of array of users
   */
  findAll(options?: FindManyOptions): Promise<User[]> {
    this.logger.log('Find all users ...');
    return this.userRepository.find(options);
  }

  /**
   * this function used to get data of use whose id is passed in parameter
   * @param options is type of FindOneOptions, which represent the options to search a user.
   * @returns promise of user
   */
  findOneById(userId?: string): Promise<User> {
    this.logger.log(`Find one by user id :: ${userId} ...`);
    return this.findOneOnRepository(findUserByUserIdQuery(userId));
  }

  /**
   * this function used to get data of use whose email is passed in parameter
   * @param email is type of string
   * @returns promise of user
   */
  findOneByEmail(email?: string): Promise<User> {
    this.logger.log(`Find one by email :: ${email} ...`);
    return this.findOneOnRepository(findUserByEmailQuery(email));
  }

  /**
   * this function is used to updated specific user whose id is passed in
   * parameter along with passed updated data
   * @param userId is type of number, which represent the id of user.
   * @param updateUserDto this is partial type of createUserDto.
   * @returns promise of udpate user
   */
  async update(userId: string, updateUserDto: UpdateUserDto): Promise<User> {
    const { email, firstname, lastname } = updateUserDto;
    this.logger.log(`Update user :: ${userId} ...`);

    const user: User = new User();
    user.first_name = firstname;
    user.last_name = lastname;
    user.email = email;
    user.user_id = userId;

    return this.userRepository.save(user);
  }

  /**
   * this function is used to remove or delete user from database.
   * @param userId is the type of number, which represent id of user
   * @returns number of rows deleted or affected +info
   */
  async remove(userId: string) {
    this.logger.log(`Remove user :: ${userId} ...`);
    const user = await this.findOneById(userId);
    const { user_id, email, first_name, last_name, profile, password } = user;

    const userResultRemoved = await this.userRepository.delete(user_id);

    const profileRemoved = await this.profilesService.remove(
      profile.profile_id,
    );

    const passwordRemoved = await this.passwordsService.remove(
      password.password_id,
    );
    return {
      ...userResultRemoved,
      user_id,
      email,
      first_name,
      last_name,
      profile: profileRemoved,
      password: passwordRemoved,
    };
  }
}
