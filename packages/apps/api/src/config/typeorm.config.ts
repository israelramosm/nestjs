import pgdbConfig from '@template/configs-database/pgdb.config';
import { Password } from '@template/modules-identity/passwords/entities/password.entity';
import { Profile } from '@template/modules-identity/profiles/entities/profile.entity';
import { User } from '@template/modules-identity/users/entities/user.entity';
import { DataSource } from 'typeorm';

// import mysqldbConfig from '@template/configs-database/mysqldb.config';

/**
 * This file is used to work with the TypeORM CLI
 * Made some testing, it can only have one data source to export
 * Depending on wich datasource you want to use you can comment the other one
 *
 * Entities are listed explicitly here: autoLoadEntities only works inside Nest,
 * and the CLI needs them to diff the schema on migration:generate.
 */
export const PgAppDataSource = new DataSource({
	...pgdbConfig,
	entities: [User, Password, Profile],
});
// export const MysqlAppDataSource = new DataSource({
// 	...mysqldbConfig,
// 	entities: [User, Password, Profile],
// });
