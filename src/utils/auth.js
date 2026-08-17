// auth.js contiene funciones reutilizables para manejar contraseñas y tokens.
// - bcryptjs: se usa para encriptar y comparar contraseñas.
// - jsonwebtoken: se usa para firmar y verificar tokens de sesión.

import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// Cost factor de bcrypt.
const SALT_ROUNDS = 10;

// Clave secreta para firmar y verificar los JWT.
export const JWT_SECRET =
    process.env.JWT_SECRET || 'clave_secreta_descubre_cordoba';

/**
 * Encripta una contraseña en texto plano.
 */
export const encriptarPassword = async (password) => {
    return bcrypt.hash(password, SALT_ROUNDS);
};

/**
 * Compara una contraseña en texto plano con un hash guardado.
 */
export const compararPassword = async (password, hash) => {
    return bcrypt.compare(password, hash);
};

/**
 * Genera un token JWT.
 */
export const generarToken = (payload) => {
    return jwt.sign(payload, JWT_SECRET, {
        expiresIn: '24h'
    });
};