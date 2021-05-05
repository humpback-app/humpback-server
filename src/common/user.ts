import {createHash} from 'crypto';
import dayjs from 'dayjs';
import {usersAccounts} from '../database.js';
import * as Schema from '../schema/index.js';

export const setUserInfo = async (user: Schema.SignupType) => {
  const info: Schema.UserType = {
    ...user,
    avatar: 'https://www.gravatar.com/avatar/' + createHash('md5').update(user.email).digest('hex'),
    social: {},
    created_at: dayjs().toISOString(),
    role: user.role,
    status: 'active',
  };

  return await usersAccounts.insertOne(info);
};
