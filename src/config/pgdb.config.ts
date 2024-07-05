import 'dotenv/config';
import { DataSourceOptions } from 'typeorm';

const pgdbConfig: DataSourceOptions = {
  name: 'default',
  type: 'postgres',
  host: process.env.POSTGRES_HOST,
  port: +process.env.POSTGRES_PORT,
  username: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DATABASE,
  synchronize: process.env.POSTGRES_SYNCHRONIZE === 'true',
  migrations: [__dirname + '/../database/migrations/pg/**/*{.ts,.js}'],
  entities: [__dirname + '/../modules/**/*.entity{.ts,.js}'],
  migrationsRun: process.env.POSTGRES_RUN_MIGRATIONS === 'true',
  // logging: process.env.POSTGRES_LOGGING,
  ssl: false,
};

export default pgdbConfig;
