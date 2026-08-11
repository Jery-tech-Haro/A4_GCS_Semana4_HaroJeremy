import { test, expect } from 'bun:test';
import { generateToken, verifyToken } from '../src/auth.js';

test('un token firmado se valida correctamente y devuelve el payload', () => {
  const secret = 'clave-de-prueba';
  const token = generateToken({ sub: 'usuario1' }, secret);
  const payload = verifyToken(token, secret);
  expect(payload.sub).toBe('usuario1');
});

test('un token firmado con otra llave es rechazado', () => {
  const token = generateToken({ sub: 'usuario1' }, 'clave-a');
  expect(() => verifyToken(token, 'clave-b')).toThrow();
});
