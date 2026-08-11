import { test, expect } from 'bun:test';
import jwt from 'jsonwebtoken';
import { KeyStore } from '../src/keys.js';
import { generateToken, verifyToken } from '../src/auth.js';

test('CR-004: un token firmado con la llave actual se valida correctamente', () => {
  const keyStore = new KeyStore();
  const token = generateToken({ sub: 'usuario1' }, keyStore);
  const payload = verifyToken(token, keyStore);
  expect(payload.sub).toBe('usuario1');
});

test('CR-004: un token expira pasado su tiempo de vida', async () => {
  const keyStore = new KeyStore();
  const key = keyStore.currentKey();
  const tokenDeCortaVida = jwt.sign({ sub: 'usuario1' }, key.secret, { expiresIn: '1ms', keyid: key.id });
  await new Promise((resolve) => setTimeout(resolve, 50));
  expect(() => verifyToken(tokenDeCortaVida, keyStore)).toThrow(/jwt expired/);
});

test('CR-004: durante el periodo de gracia, un token firmado con la llave anterior sigue siendo valido', () => {
  const keyStore = new KeyStore();
  const tokenAntesDeRotar = generateToken({ sub: 'usuario1' }, keyStore);
  keyStore.rotate();
  const payload = verifyToken(tokenAntesDeRotar, keyStore);
  expect(payload.sub).toBe('usuario1');
});

test('CR-004: un token queda invalido cuando su llave sale del periodo de gracia', () => {
  const keyStore = new KeyStore(2);
  const tokenConLlaveMasAntigua = generateToken({ sub: 'usuario1' }, keyStore);
  keyStore.rotate();
  keyStore.rotate();
  expect(() => verifyToken(tokenConLlaveMasAntigua, keyStore)).toThrow(/Llave de firma no reconocida/);
});
