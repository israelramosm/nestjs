import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { CreateProfileDto } from './dto/create-profile.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { Profile } from './entities/profile.entity';
import { FindManyOptions, FindOneOptions, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import {
  findProfileByProfileIdQuery,
  findProfileByUsernameQuery,
} from './queries/profile.queries';

@Injectable()
export class ProfilesService {
  private readonly logger = new Logger(ProfilesService.name);

  constructor(
    @InjectRepository(Profile)
    private readonly profileRepository: Repository<Profile>,
  ) {}
  /**
   * this function used to get data of use whose id is passed in parameter
   * @param options is type of FindOneOptions, which represent the options to search a profile.
   * @returns promise of profile
   */
  private findOneOnRepository(options?: FindOneOptions): Promise<Profile> {
    return this.profileRepository.findOne(options);
  }

  /**
   * this is function is used to create Profile in Profile Entity.
   * @param createProfileDto this will type of CreateProfileDto in which
   * we have defined what are the keys we are expecting from body
   * @returns promise of Profile
   */
  async create(createProfileDto: CreateProfileDto): Promise<Profile> {
    const { username, photo_url, gender, birthday } = createProfileDto;
    this.logger.log(`Create profile :: ${username} ...`);

    const usernameExist = await this.findOneOnRepository(
      findProfileByUsernameQuery(username),
    );

    if (usernameExist) {
      this.logger.error('Username already exist');
      throw new HttpException('Username already exist', HttpStatus.CONFLICT);
    }

    const profile: Profile = new Profile();
    profile.username = username;
    profile.photo_url = photo_url;
    profile.gender = gender;
    profile.birthday = birthday;

    return this.profileRepository.save(profile);
  }

  /**
   * this function is used to get all the profile's list
   * @param options is type of FindManyOptions, which represent the options to search profiles.
   * @returns promise of array of profiles
   */
  findAll(options?: FindManyOptions): Promise<Profile[]> {
    this.logger.log('Find all ...');
    return this.profileRepository.find(options);
  }

  /**
   * this function used to get data of use whose id is passed in parameter
   * @param profileId is type of string, which represent the id of profile.
   * @returns promise of profile
   */
  findOneById(profileId: string): Promise<Profile> {
    this.logger.log(`Find one by profile id :: ${profileId} ...`);
    return this.findOneOnRepository(findProfileByProfileIdQuery(profileId));
  }

  /**
   * this function used to get data of use whose id is passed in parameter
   * @param username is type of string, which represents the username of profile
   * @returns promise of profile
   */
  findOneByUsername(username: string): Promise<Profile> {
    this.logger.log(`Find one by username :: ${username} ...`);
    return this.findOneOnRepository(findProfileByUsernameQuery(username));
  }

  /**
   * this function is used to updated specific profile whose id is passed in
   * parameter along with passed updated data
   * @param profileId is type of string, which represent the id of profile.
   * @param updateProfileDto this is partial type of createProfileDto.
   * @returns promise of udpate profile
   */
  update(profileId: string, updateProfileDto: UpdateProfileDto) {
    const { username, photo_url, gender, birthday } = updateProfileDto;
    this.logger.log(`Update profile :: ${username} ...`);

    const profile: Profile = new Profile();
    profile.username = username;
    profile.photo_url = photo_url;
    profile.gender = gender;
    profile.birthday = birthday;
    profile.profile_id = profileId;

    return this.profileRepository.save(profile);
  }

  /**
   * this function is used to remove or delete profile from database.
   * @param profileId is the type of string, which represent id of profile
   * @returns number of rows deleted or affected +info
   */
  async remove(profileId: string) {
    this.logger.log(`Remove profile :: ${profileId} ...`);
    const profile = await this.findOneById(profileId);
    const { profile_id, username } = profile;
    const profileRemovedResult = await this.profileRepository.delete(profileId);
    return {
      ...profileRemovedResult,
      profile_id,
      username,
    };
  }
}
