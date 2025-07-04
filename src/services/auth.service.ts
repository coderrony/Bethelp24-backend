import createHttpError from 'http-errors';
import { CreateUserType } from '../types/userTypes';
import validator from 'validator';
import { UserModel } from '../model';

export const createUser = async (userData: CreateUserType) => {
  try {
    const { fullName, phone, password } = userData;
    //check if fields are empty
    if (!fullName || !phone || !password) {
      throw createHttpError.BadRequest('Please fill all fields.');
    }

    //check name length
    if (
      !validator.isLength(fullName, {
        min: 3,
        max: 25,
      })
    ) {
      throw createHttpError.BadRequest(
        'Please make sure your name is between 3 and 16 characters.',
      );
    }
    //check if phone  is valid
    if (!validator.isMobilePhone(phone, 'bn-BD', { strictMode: false })) {
      throw createHttpError.BadRequest('Please provide a valid Bangladeshi phone number.');
    }

    //check password length
    if (
      !validator.isLength(password, {
        min: 6,
        max: 128,
      })
    ) {
      throw createHttpError.BadRequest(
        'Please make sure your password is between 6 and 128 characters.',
      );
    }

    //check if user already exist
    const checkDb = await UserModel.findOne({ phone });
    if (checkDb) {
      throw createHttpError.Conflict(
        'User with this phone number already exists.',
      );
    }

    //hash password--->to be done in the UserModel
    //adding user to database
    const user = await new UserModel({
      fullName,
      phone,
      password,
    
    }).save();

    return user;
  } catch (error: any) {
    throw new Error(` ${error.message}`);
  }
};
