import { FindOneOptions } from 'typeorm';

export const findUserByUserIdQuery = (user_id: string): FindOneOptions => ({
  relations: {
    password: true,
    profile: true,
  },
  where: { user_id },
});

export const findUserByEmailQuery = (email: string): FindOneOptions => ({
  relations: {
    password: true,
    profile: true,
  },
  where: { email },
});
