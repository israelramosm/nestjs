export const mockRepository = {
  save: jest.fn(),
  find: jest.fn(),
  findOne: jest.fn(),
  delete: jest.fn(),
};

export const mockRestService = {
  create: jest.fn(),
  findAll: jest.fn(),
  findOneById: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
};

export const mockAuthService = {
  validateUser: jest.fn(),
  login: jest.fn(),
};

export const mockRestServiceData = (resolvedValue) => ({
  create: jest.fn().mockResolvedValue(resolvedValue),
  findAll: jest.fn().mockResolvedValue([resolvedValue]),
  findOneById: jest.fn().mockResolvedValue(resolvedValue),
  update: jest.fn().mockResolvedValue(resolvedValue),
  remove: jest.fn().mockResolvedValue(resolvedValue),
});

export const mockUserRestService = {
  ...mockRestService,
  findOneByEmail: jest.fn(),
};
