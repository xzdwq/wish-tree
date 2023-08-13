import validateConfig from '@/common/validate/validate.config';
import { registerAs } from '@nestjs/config';
import {
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  IsUrl,
  Max,
  Min,
} from 'class-validator';

export type AppConfig = {
  nodeEnv: string;
  workingDirectory: string;
  apiHost: string;
  apiPort: number;
  apiPrefix: string;
};

enum Environment {
  Development = 'development',
  Production = 'production',
  Qa = 'qa',
}

class EnvironmentVariablesValidator {
  @IsEnum(Environment)
  @IsOptional()
  NODE_ENV: Environment;

  @IsUrl({ require_tld: false })
  API_HOST: string;

  @IsInt()
  @Min(0)
  @Max(65535)
  @IsOptional()
  API_PORT: number;

  @IsString()
  @IsOptional()
  API_PREFIX: string;
}

export default registerAs<AppConfig>('app', () => {
  validateConfig(process.env, EnvironmentVariablesValidator);

  return {
    nodeEnv: process.env.NODE_ENV || 'development',
    workingDirectory: process.env.PWD || process.cwd(),
    apiHost: process.env.API_HOST ?? 'http://localhost',
    apiPort: parseInt(process.env.API_PORT, 10) || 7000,
    apiPrefix: process.env.API_PREFIX || 'api',
  };
});
