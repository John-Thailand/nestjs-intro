import { SetMetadata } from '@nestjs/common';
import { AUTH_TYPE_KEY } from '../constants/constants';
import { AuthType } from '../enums/auth-type.enum';

export const Auth = (...authTypes: AuthType[]) =>
  SetMetadata(AUTH_TYPE_KEY, authTypes);
