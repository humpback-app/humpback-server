import {createHash} from 'crypto';
import dayjs from 'dayjs';
import {usersAccounts} from '../database.js';
import * as Schema from '../schema/index.js';

export const setUserInfo = async (user: Schema.SignupType): Promise<Schema.UserType> => {
  const info = {
    displayname: user.displayname,
    username: user.username,
    avatar: 'https://www.gravatar.com/avatar/' + createHash('md5').update(user.email).digest('hex'),
    social: {},
    meta: {},
    created_at: dayjs().toISOString(),
    role: user.role,
  };

  const {insertedId} = await usersAccounts.insertOne(info);

  return {_id: insertedId, status: 'active', ...info};
};
