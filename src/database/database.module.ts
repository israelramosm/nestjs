import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule, TypeOrmModuleAsyncOptions } from '@nestjs/typeorm';
import pgdbConfig from 'src/config/pgdb.config';
import mysqldbConfig from 'src/config/mysqldb.config';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (): Promise<TypeOrmModuleAsyncOptions> => ({
        ...pgdbConfig,
      }),
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (): Promise<TypeOrmModuleAsyncOptions> => ({
        ...mysqldbConfig,
      }),
    }),
  ],
})
export class DatabaseModule {}
