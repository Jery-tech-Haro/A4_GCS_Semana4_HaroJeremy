# Changelog

## [1.1.0] - 2026-08-11
- CR-004: expiracion de tokens reducida de 24h a 1h.
- CR-004: rotacion de llaves de firma con periodo de gracia (KeyStore, `src/keys.js`).
- CR-004: nuevo endpoint `POST /admin/rotate-keys`.
- CR-004: pruebas de expiracion y rotacion en `tests/auth.test.js`.

## [1.0.0] - 2026-08-11
- API REST base con autenticacion JWT.
- Expiracion de tokens: 24h.
- Sin rotacion de llaves de firma.
