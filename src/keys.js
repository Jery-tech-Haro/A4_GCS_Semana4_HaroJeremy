import { randomBytes } from 'node:crypto';

// CR-004: reemplaza la llave unica y estatica por un almacen de llaves con
// rotacion. Se retienen las ultimas `maxRetained` llaves para dar un periodo
// de gracia: un token firmado con la llave anterior sigue siendo valido
// hasta que esa llave tambien sea desplazada.
export class KeyStore {
  constructor(maxRetained = 2) {
    this.maxRetained = maxRetained;
    this.keys = [];
    this.rotate();
  }

  rotate() {
    const key = { id: `k${Date.now()}${Math.random().toString(16).slice(2, 6)}`, secret: randomBytes(32).toString('hex') };
    this.keys.push(key);
    if (this.keys.length > this.maxRetained) {
      this.keys.shift();
    }
    return this.currentKey();
  }

  currentKey() {
    return this.keys[this.keys.length - 1];
  }

  findById(id) {
    return this.keys.find((k) => k.id === id);
  }
}
