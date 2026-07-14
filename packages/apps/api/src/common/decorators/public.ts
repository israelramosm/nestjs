import { SetMetadata } from '@nestjs/common';

// TODO: Change this to have a secret
export const IS_PUBLIC_KEY = 'isPublic';
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);
