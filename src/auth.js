import jwt from 'jsonwebtoken';
import { config } from '../config/config.js';

export function generateToken(payload, secret) {
  return jwt.sign(payload, secret, { expiresIn: config.tokenExpiration });
}

export function verifyToken(token, secret) {
  return jwt.verify(token, secret);
}
