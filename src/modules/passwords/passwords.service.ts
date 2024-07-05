import { Injectable, Logger } from '@nestjs/common';
import { FindManyOptions, FindOneOptions, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { SALT_OR_ROUND } from 'src/common/constants';
import { CreatePasswordDto } from './dto/create-password.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { Password } from './entities/password.entity';
import { findPasswordByPasswordIdQuery } from './queries/password.queries';

@Injectable()
export class PasswordsService {
  private readonly logger = new Logger(PasswordsService.name);

  constructor(
    @InjectRepository(Password)
    private readonly passwordRepository: Repository<Password>,
  ) {}

  private setHashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, SALT_OR_ROUND);
  }

  /**
   * this function used to get data of use whose id is passed in parameter
   * @param options is type of FindOneOptions, which represent the options to search a password.
   * @returns promise of password
   */
  private findOneOnRepository(options?: FindOneOptions): Promise<Password> {
    return this.passwordRepository.findOne(options);
  }

  /**
   * this is function is used to create Password in Password Entity.
   * @param createPasswordDto this will type of CreatePasswordDto in which
   * we have defined what are the keys we are expecting from body
   * @returns promise of Password
   */
  async create(createPasswordDto: CreatePasswordDto): Promise<Password> {
    this.logger.log(`Create password ...`);
    const { password } = createPasswordDto;

    const pass: Password = new Password();
    pass.password = await this.setHashPassword(password);

    return this.passwordRepository.save(pass);
  }

  /**
   * this function is used to get all the password's list
   * @param options is type of FindManyOptions, which represent the options to search profiles.
   * @returns promise of array of profiles
   */
  findAll(options?: FindManyOptions): Promise<Password[]> {
    this.logger.log('Find all ...');
    return this.passwordRepository.find(options);
  }

  /**
   * this function used to get data of use whose id is passed in parameter
   * @param passwordId is type of string, which represent the id of password
   * @returns promise of password
   */
  findOneById(passwordId: string): Promise<Password> {
    this.logger.log(`Find one by password id :: ${passwordId} ...`);
    return this.findOneOnRepository(findPasswordByPasswordIdQuery(passwordId));
  }

  /**
   * this function is used to updated specific password whose id is passed in
   * parameter along with passed updated data
   * @param passwordId is type of string, which represent the id of password.
   * @param updateProfileDto this is partial type of createProfileDto.
   * @returns promise of udpate password
   */
  update(passwordId: string, updatePasswordDto: UpdatePasswordDto) {
    this.logger.log(`Update password :: ${passwordId} ...`);
    const { password } = updatePasswordDto;

    const pass: Password = new Password();
    pass.password = password;
    pass.password_id = passwordId;

    return this.passwordRepository.save(pass);
  }

  /**
   * this function is used to remove or delete password from database.
   * @param passwordId is the type of string, which represent id of password
   * @returns number of rows deleted or affected +info
   */
  async remove(passwordId: string) {
    this.logger.log(`Remove password :: ${passwordId} ...`);
    const password = await this.findOneById(passwordId);
    const { password_id } = password;

    const passwordRemovedResult =
      await this.passwordRepository.delete(passwordId);

    return {
      ...passwordRemovedResult,
      password_id,
    };
  }
}
