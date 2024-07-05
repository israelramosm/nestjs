import { FindOneOptions } from 'typeorm';

export const findPasswordByPasswordIdQuery = (
  password_id: string,
): FindOneOptions => ({
  where: { password_id },
});
