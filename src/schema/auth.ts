import type {JSONSchema7} from 'json-schema';
import type {UserRoleType} from './users.js';

export const Login: JSONSchema7 = {
  type: 'object',
  required: ['email', 'password'],
  maxProperties: 2,
  properties: {
    email: {
      type: 'string',
      format: 'email',
    },
    password: {
      type: 'string',
      minLength: 8,
      maxLength: 255,
    },
  },
};

export interface LoginType {
  email: string;
  password: string;
}

export const Signup: JSONSchema7 = {
  type: 'object',
  required: ['displayname', 'username', 'email', 'password'],
  maxProperties: 5,
  additionalProperties: false,
  properties: {
    displayname: {
      type: 'string',
      minLength: 1,
      maxLength: 48,
    },
    username: {
      type: 'string',
      minLength: 2,
      maxLength: 16,
      pattern: '^[0-9a-zA-Z_-]+$',
      description:
        'Username may only contain alphanumeric characters or single hyphens, and cannot begin or end with a hyphen.',
    },
    email: {
      type: 'string',
      format: 'email',
    },
    password: {
      type: 'string',
      minLength: 8,
      maxLength: 255,
    },
    sex: {
      type: 'string',
      enum: ['male', 'female', 'unknown'],
      default: 'unknown',
    },
  },
};

export interface SignupType extends LoginType {
  displayname: string;
  username: string;
  password: string;
  sex: string;
  role: UserRoleType;
}
