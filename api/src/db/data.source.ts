import 'reflect-metadata';
import { DataSource, type DataSourceOptions } from 'typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';

const DataSourceConfig = {
  type: process.env.DB_TYPE,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : 5432,
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  synchronize: process.env.DB_SYNCHRONIZE === 'true',
  dropSchema: false,
  keepConnectionAlive: true,
  logging:
    process.env.NODE_ENV === 'production' ? ['error'] : ['warn', 'error'],
  entities: [__dirname + '/../**/*.entity{.ts,.js}'],
  migrations: [__dirname + '/migrations/**/*{.ts,.js}'],
  cli: {
    entitiesDir: 'src',
    migrationsDir: 'src/db/migrations',
    subscribersDir: 'subscriber',
  },
  uuidExtension: 'uuid-ossp',
  extra: {
    max: process.env.DB_MAX_CONNECTIONS
      ? parseInt(process.env.DB_MAX_CONNECTIONS, 10)
      : 100,
    connectionTimeoutMillis: 10000,
  },
  autoLoadEntities: true,
  namingStrategy: new SnakeNamingStrategy(),
} as DataSourceOptions;

const connToDS = async (): Promise<DataSource> => {
  const dataSourseConn = new DataSource(DataSourceConfig);
  try {
    if (!dataSourseConn.isInitialized) await dataSourseConn.initialize();
  } catch (err) {
    console.error('Error during Data Source initialization', err);
  } finally {
    return dataSourseConn;
  }
};

export const dataSource = connToDS();
