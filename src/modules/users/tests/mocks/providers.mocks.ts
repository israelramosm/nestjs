import { password, profile } from './data.mocks';

export const mockUserRepository = {
  save: jest.fn(),
  find: jest.fn(),
  findOne: jest.fn(),
  delete: jest.fn(),
};

export const mockProfileService = {
  create: jest.fn().mockResolvedValue(profile),
  findAll: jest.fn().mockResolvedValue([profile]),
  findOneById: jest.fn().mockResolvedValue(profile),
  update: jest.fn().mockResolvedValue(profile),
  remove: jest.fn().mockResolvedValue(profile),
};

export const mockPasswordService = {
  create: jest.fn().mockResolvedValue(password),
  findAll: jest.fn().mockResolvedValue([password]),
  findOneById: jest.fn().mockResolvedValue(password),
  update: jest.fn().mockResolvedValue(password),
  remove: jest.fn().mockResolvedValue(password),
};

export const mockUserService = {
  create: jest.fn(),
  findAll: jest.fn(),
  findOneById: jest.fn(),
  findOneByEmail: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
};
