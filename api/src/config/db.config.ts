import validateConfig from '@/common/validate/validate.config';
import { registerAs } from '@nestjs/config';
import { IsInt, IsString, Max, Min } from 'class-validator';
import { LoggerOptions } from 'typeorm';

export type DatabaseConfig = {
  type: string;
  host: string;
  port: number;
  user: string;
  password: string;
  name: string;
  synchronize: boolean;
  maxConnections?: number;
  log: LoggerOptions;
};

class EnvironmentVariablesValidator {
  @IsString()
  DB_TYPE: string;

  @IsString()
  DB_HOST: string;

  @IsInt()
  @Min(0)
  @Max(65535)
  DB_PORT: number;

  @IsString()
  DB_USER: string;

  @IsString()
  DB_PASSWORD: string;

  @IsString()
  DB_NAME: string;
}

export default registerAs<DatabaseConfig>('db', () => {
  validateConfig(process.env, EnvironmentVariablesValidator);

  return {
    type: process.env.DB_TYPE,
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT, 10),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    name: process.env.DB_NAME,
    synchronize: process.env.DB_SYNCHRONIZE === 'true',
    maxConnections: process.env.DB_MAX_CONNECTIONS
      ? parseInt(process.env.DB_MAX_CONNECTIONS, 10)
      : 100,
    log:
      process.env.NODE_ENV === 'production'
        ? ['error']
        : ['query', 'info', 'warn', 'error'],
  };
});
