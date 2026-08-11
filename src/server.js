import { randomBytes } from 'node:crypto';
import { generateToken, verifyToken } from './auth.js';
import { config } from '../config/config.js';

// Llave unica de firma, generada al iniciar el servidor (sin rotacion).
const SECRET = randomBytes(32).toString('hex');

export async function handleRequest(req) {
  const url = new URL(req.url);

  if (req.method === 'POST' && url.pathname === '/login') {
    const { username } = await req.json();
    if (!username) {
      return Response.json({ error: 'username requerido' }, { status: 400 });
    }
    const token = generateToken({ sub: username }, SECRET);
    return Response.json({ token, expiresIn: config.tokenExpiration });
  }

  if (req.method === 'GET' && url.pathname === '/protected') {
    const token = (req.headers.get('authorization') || '').replace('Bearer ', '');
    try {
      const payload = verifyToken(token, SECRET);
      return Response.json({ message: `Acceso concedido a ${payload.sub}` });
    } catch (err) {
      return Response.json({ error: err.message }, { status: 401 });
    }
  }

  return new Response('Not found', { status: 404 });
}

if (import.meta.main) {
  const server = Bun.serve({ port: config.port, fetch: handleRequest });
  console.log(`API escuchando en puerto ${server.port}`);
}
