import jwt from 'jsonwebtoken';
import { config } from '../config/config.js';

// CR-004: firma incluyendo el id de la llave (kid) para poder verificar
// contra la llave correcta del KeyStore, incluso durante la rotacion.
export function generateToken(payload, keyStore) {
  const key = keyStore.currentKey();
  return jwt.sign(payload, key.secret, {
    expiresIn: config.tokenExpiration,
    keyid: key.id,
  });
}

export function verifyToken(token, keyStore) {
  const decoded = jwt.decode(token, { complete: true });
  if (!decoded) throw new Error('Token invalido');

  const key = keyStore.findById(decoded.header.kid);
  if (!key) throw new Error('Llave de firma no reconocida (token expirado o fuera del periodo de gracia de rotacion)');

  return jwt.verify(token, key.secret);
}
