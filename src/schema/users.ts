import {ObjectId} from 'mongodb';
import type {JSONSchema7} from 'json-schema';

export const Users: JSONSchema7 = {
  type: 'object',
  additionalProperties: false,
  maxProperties: 2,
  properties: {
    limit: {
      type: 'integer',
      minimum: 1,
      maximum: 100,
      default: 20,
    },
    page: {
      type: 'integer',
      minimum: 1,
      default: 1,
    },
  },
};

export type UserRoleType = 'admin' | 'subscriber';

export interface UserTypeMinimal {
  _id?: ObjectId;
  displayname: string;
  username: string;
  avatar: string;
  bio?: string;
  website?: string;
  location?: string;
  social: {
    facebook?: string;
    twitter?: string;
    instagram?: string;
    whatsapp?: string;
    telegram?: string;
    signal?: string;
    github?: string;
    linkedin?: string;
    youtube?: string;
  };
  last_seen?: string | null;
  role: UserRoleType;
}

export interface UserType extends UserTypeMinimal {
  status: 'active' | 'suspended';
  created_at: string;
  cover?: string;
  updated_at?: string;
}
