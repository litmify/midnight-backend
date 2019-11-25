import * as jwt from 'jsonwebtoken';
import { logger } from '@utils/logger';

const generateJWT = async (payload: string, subject: string): Promise<any> => {
  jwt.sign(
    payload,
    process.env.JWT_SECRET_KEY,
    {
      issuer: 'midnight.celenil.com',
      expiresIn: 60 * 60 * 24,
      subject,
    },
    (error, token) => {
      if (error) {
        logger('jwt').log(`Unexpected Error: ${error}`);
        return null;
      }

      logger('jwt').log(`Token generated: ${token}`);
      return token;
    },
  );
};

const validateJWT = async (token: string): Promise<any> => {
  jwt.verify(token, (error, decoded) => {
    if (error) {
      logger('jwt').log(`Unexpected Error: ${error}`);
      return null;
    }

    return decoded;
  });
};

export { generateJWT, validateJWT };
