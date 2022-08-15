var dotenv = require('dotenv')
var dotenvExpand = require('dotenv-expand')

var myEnv = dotenv.config()
dotenvExpand.expand(myEnv)

import { User as TUser } from '@prisma/client';
import { Schema, model } from 'mongoose'


const userSchema = new Schema<TUser>({
  name: { type: String, required: false },
  email: { type: String, required: true, unique: true },
});

export const User = model<TUser>('User', userSchema);
