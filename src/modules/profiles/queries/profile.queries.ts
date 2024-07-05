import { FindOneOptions } from 'typeorm';

export const findProfileByProfileIdQuery = (
  profile_id: string,
): FindOneOptions => ({
  where: { profile_id },
});

export const findProfileByUsernameQuery = (
  username: string,
): FindOneOptions => ({
  where: { username },
});
