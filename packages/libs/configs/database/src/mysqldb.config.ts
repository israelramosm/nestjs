import 'dotenv/config';
import { DataSourceOptions } from 'typeorm';
import { mysqlMigrations } from '#src/database/migrations/mysql/index';

const mysqlConfig: DataSourceOptions = {
	name: 'default',
	type: 'mysql',
	host: process.env.MYSQL_HOST,
	port: Number(process.env.MYSQL_PORT ?? '3306'),
	username: process.env.MYSQL_USER,
	password: process.env.MYSQL_PASSWORD,
	database: process.env.MYSQL_DATABASE,
	synchronize: process.env.MYSQL_SYNCHRONIZE === 'true',
	migrations: mysqlMigrations,
	migrationsRun: process.env.MYSQL_RUN_MIGRATIONS === 'true',
	// logging: process.env.MYSQL_LOGGING,
	ssl: {
		rejectUnauthorized: false,
	},
};

export default mysqlConfig;
