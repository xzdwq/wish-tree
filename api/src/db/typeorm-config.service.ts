import { DatabaseConfig } from '@/config/db.config';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';

@Injectable()
export class TypeOrmConfigService implements TypeOrmOptionsFactory {
  constructor(private configService: ConfigService) {}

  createTypeOrmOptions(): TypeOrmModuleOptions {
    return {
      type: this.configService.get<DatabaseConfig['type']>('db.type', {
        infer: true,
      }),
      host: this.configService.get<DatabaseConfig['host']>('db.host', {
        infer: true,
      }),
      port: this.configService.get<DatabaseConfig['port']>('db.port', {
        infer: true,
      }),
      username: this.configService.get<DatabaseConfig['user']>('db.user', {
        infer: true,
      }),
      password: this.configService.get<DatabaseConfig['password']>(
        'db.password',
        {
          infer: true,
        },
      ),
      database: this.configService.get<DatabaseConfig['name']>('db.name', {
        infer: true,
      }),
      synchronize: this.configService.get<DatabaseConfig['synchronize']>(
        'db.synchronize',
        {
          infer: true,
        },
      ),
      dropSchema: false,
      keepConnectionAlive: true,
      logging: this.configService.get<DatabaseConfig['log']>('db.log', {
        infer: true,
      }),
      entities: [__dirname + '/../**/*.entity{.ts,.js}'],
      migrations: [__dirname + '/migrations/**/*{.ts,.js}'],
      cli: {
        entitiesDir: 'src',
        migrationsDir: 'src/db/migrations',
        subscribersDir: 'subscriber',
      },
      uuidExtension: 'uuid-ossp',
      extra: {
        max: this.configService.get<DatabaseConfig['maxConnections']>(
          'db.maxConnections',
          { infer: true },
        ),
      },
      autoLoadEntities: true,
      namingStrategy: new SnakeNamingStrategy(),
    } as TypeOrmModuleOptions;
  }
}
