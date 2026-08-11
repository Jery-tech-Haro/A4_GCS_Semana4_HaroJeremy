import { KeyStore } from './keys.js';
import { generateToken, verifyToken } from './auth.js';
import { config } from '../config/config.js';

// CR-004: la llave unica estatica es reemplazada por un KeyStore con rotacion.
const keyStore = new KeyStore();

export async function handleRequest(req) {
  const url = new URL(req.url);

  if (req.method === 'POST' && url.pathname === '/login') {
    const { username } = await req.json();
    if (!username) {
      return Response.json({ error: 'username requerido' }, { status: 400 });
    }
    const token = generateToken({ sub: username }, keyStore);
    return Response.json({ token, expiresIn: config.tokenExpiration });
  }

  if (req.method === 'GET' && url.pathname === '/protected') {
    const token = (req.headers.get('authorization') || '').replace('Bearer ', '');
    try {
      const payload = verifyToken(token, keyStore);
      return Response.json({ message: `Acceso concedido a ${payload.sub}` });
    } catch (err) {
      return Response.json({ error: err.message }, { status: 401 });
    }
  }

  // CR-004: endpoint administrativo para disparar la rotacion de llaves.
  if (req.method === 'POST' && url.pathname === '/admin/rotate-keys') {
    const newKey = keyStore.rotate();
    return Response.json({ message: 'Llaves rotadas', currentKeyId: newKey.id });
  }

  return new Response('Not found', { status: 404 });
}

if (import.meta.main) {
  const server = Bun.serve({ port: config.port, fetch: handleRequest });
  console.log(`API escuchando en puerto ${server.port}`);
}
