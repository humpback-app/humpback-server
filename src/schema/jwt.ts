import type {UserRoleType} from './users.js';

export type JWTType = {
  _id: string;
  username: string;
  role: UserRoleType;
  iat: number;
  exp: number;
};
