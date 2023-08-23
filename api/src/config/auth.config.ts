import validateConfig from '@/common/validate/validate.config';
import { registerAs } from '@nestjs/config';
import { IsUrl, IsUUID } from 'class-validator';

export type DatabaseConfig = {
  oidcClientId: string;
  oidcIssuer: string;
  oidcTokenUri: string;
  oidcUserInfoUri: string;
  oidcJwksUri: string;
};

class EnvironmentVariablesValidator {
  @IsUUID('4')
  OIDC_CLIENT_ID: string;

  @IsUrl()
  OIDC_ISSUER: string;

  @IsUrl()
  OIDC_TOKEN_URI: string;

  @IsUrl()
  OIDC_USERINFO_URI: string;

  @IsUrl()
  OIDC_JWKS_URI: string;
}

export default registerAs<DatabaseConfig>('auth', () => {
  validateConfig(process.env, EnvironmentVariablesValidator);

  return {
    oidcClientId: process.env.OIDC_CLIENT_ID,
    oidcIssuer: process.env.OIDC_ISSUER,
    oidcTokenUri: process.env.OIDC_TOKEN_URI,
    oidcUserInfoUri: process.env.OIDC_USERINFO_URI,
    oidcJwksUri: process.env.OIDC_JWKS_URI,
  };
});
