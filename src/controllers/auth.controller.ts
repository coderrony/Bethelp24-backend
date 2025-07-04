import { Request, Response, NextFunction } from 'express';
import { createUser } from '../services/auth.service';
import { generateToken } from '../services/token.service';

export const testFun = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  res.json({ message: 'test function' });
};

export const register = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    console.log('req.body ', req.body);

    const newUser = await createUser(req.body);
    console.log('newUser ', newUser);

    const access_token = await generateToken(
      { userId: newUser._id },
      '1d',
      process.env.ACCESS_TOKEN_SECRET!,
    );
    const refresh_token = await generateToken(
      { userId: newUser._id },
      '30d',
      process.env.REFRESH_TOKEN_SECRET!,
    );

    res.cookie('refreshtoken', refresh_token, {
      httpOnly: true, // JS থেকে অদৃশ্য
      secure: true, // শুধুমাত্র HTTPS-এ পাঠানো যাবে
      // sameSite: "Strict",                     // শুধুমাত্র সেম-সাইট থেকে রিকোয়েস্ট করলে পাঠানো যাবে
      path: '/api/v1/auth/refreshtoken', // নির্দিষ্ট রাউটে পাঠানো হবে
      maxAge: 30 * 24 * 60 * 60 * 1000, // ৩০ দিন
    });

    res.json({
      message: 'register success.',
      user: {
        _id: newUser._id,
        name: newUser.fullName,
        email: newUser.phone,
        profileImage: newUser.profileImage,

        token: access_token,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  res.json({ message: 'login page' });
};
