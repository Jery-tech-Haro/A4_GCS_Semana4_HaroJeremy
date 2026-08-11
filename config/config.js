// CR-004: expiracion de tokens reducida de 24h a 1h.
export const config = {
  tokenExpiration: process.env.TOKEN_EXPIRATION || '1h',
  port: process.env.PORT || 3000,
};
