import * as jwt from 'jsonwebtoken';
import { logger } from '@utils/logger';

const generateJWT = (payload: object, subject: string): any => {
  return jwt.sign(payload, process.env.JWT_SECRET_KEY, {
    issuer: 'midnight.celenil.com',
    expiresIn: 60 * 60 * 24,
    subject,
  });
};

const validateJWT = (token: string): any => {
  return jwt.verify(token, process.env.JWT_SECRET_KEY);
};

export { generateJWT, validateJWT };
