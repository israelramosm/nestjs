import { DataSource } from 'typeorm';
import pgdbConfig from 'src/config/pgdb.config';
// import mysqldbConfig from 'src/config/mysqldb.config';

/**
 * This file is used to work with the TypeORM CLI
 * Made some testing, it can only have one data source to export
 * Depending on wich datasource you want to use you can comment the other one
 */
export const PgAppDataSource = new DataSource(pgdbConfig);
// export const MysqlAppDataSource = new DataSource(mysqldbConfig);
