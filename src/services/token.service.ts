import jwt from "jsonwebtoken";
import logger from "../configs/logger.config";

export const generateToken = async (
  payload: string | object | Buffer,
  expiresIn: jwt.SignOptions["expiresIn"], // ✅ correct typing here
  secret: jwt.Secret
): Promise<string> => {
  return new Promise((resolve, reject) => {
    jwt.sign(
      payload,
      secret,
      {
        expiresIn, // no type conflict
      },
      (error, token) => {
        if (error) {
          logger.error(error);
          reject(error);
        } else if (token) {
          resolve(token);
        } else {
          reject(new Error("Token generation failed"));
        }
      }
    );
  });
};

export const verifyToken = async (token:string, secret: jwt.Secret) => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, secret, (error, payload) => {
      if (error) {
        logger.error(error);
        resolve(null);
      } else {
        resolve(payload);
      }
    });
  });
};