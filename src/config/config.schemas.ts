import * as Joi from '@hapi/joi';

export class ConfigSchemas {
  static validations = Joi.object({
    PORT: Joi.number(),
    MODE: Joi.string().required(),
    POSTGRES_HOST: Joi.string().required(),
    POSTGRES_PORT: Joi.number().required(),
    POSTGRES_USER: Joi.string().required(),
    POSTGRES_PASSWORD: Joi.string().required(),
    POSTGRES_DATABASE: Joi.string().required(),
    POSTGRES_SYNCHRONIZE: Joi.boolean().required(),
    POSTGRES_RUN_MIGRATIONS: Joi.boolean().required(),
    POSTGRES_LOGGING: Joi.boolean().required(),
    MYSQL_HOST: Joi.string().required(),
    MYSQL_PORT: Joi.number().required(),
    MYSQL_USER: Joi.string().required(),
    MYSQL_PASSWORD: Joi.string().required(),
    MYSQL_DATABASE: Joi.string().required(),
    MYSQL_SYNCHRONIZE: Joi.boolean().required(),
    MYSQL_RUN_MIGRATIONS: Joi.boolean().required(),
    MYSQL_LOGGING: Joi.boolean().required(),
  });
}
