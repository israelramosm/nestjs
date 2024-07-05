import 'dotenv/config';
import { DataSourceOptions } from 'typeorm';

const mysqlConfig: DataSourceOptions = {
  name: 'default',
  type: 'mysql',
  host: process.env.MYSQL_HOST,
  port: +process.env.MYSQL_PORT,
  username: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
  synchronize: process.env.MYSQL_SYNCHRONIZE === 'true',
  migrations: [__dirname + '/../database/migrations/mysql/**/*{.ts,.js}'],
  entities: [__dirname + '/../modules/**/*.entity{.ts,.js}'],
  migrationsRun: process.env.MYSQL_RUN_MIGRATIONS === 'true',
  // logging: process.env.MYSQL_LOGGING,
  ssl: {
    rejectUnauthorized: false,
  },
};

export default mysqlConfig;
