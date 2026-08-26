// auth.js contiene funciones reutilizables para manejar
// contraseñas y tokens.
//
// - bcryptjs: encripta y compara contraseñas.
// - jsonwebtoken: genera y verifica tokens JWT.

import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';


// ==========================================================
// BCRYPT
// ==========================================================

// Cantidad de rondas utilizadas para encriptar la contraseña.
const SALT_ROUNDS = 10;


// ==========================================================
// SECRETOS JWT
// ==========================================================

// Token para usuarios/clientes normales.
export const JWT_SECRET_CLIENT =
    process.env.JWT_SECRET_CLIENT ||
    'clave_secreta_usuario_descubre_cordoba';


// Token para administradores.
export const JWT_SECRET_ADMIN =
    process.env.JWT_SECRET_ADMIN ||
    'clave_secreta_admin_descubre_cordoba';


// Dejamos también JWT_SECRET por compatibilidad,
// por si algún archivo viejo todavía lo utiliza.
export const JWT_SECRET =
    process.env.JWT_SECRET ||
    JWT_SECRET_CLIENT;


// ==========================================================
// ENCRIPTAR CONTRASEÑA
// ==========================================================

/**
 * Recibe una contraseña en texto plano
 * y devuelve la contraseña encriptada.
 */
export const encriptarPassword = async (password) => {

    return bcrypt.hash(
        password,
        SALT_ROUNDS
    );
};


// ==========================================================
// COMPARAR CONTRASEÑA
// ==========================================================

/**
 * Compara:
 *
 * contraseña ingresada
 * VS
 * hash guardado en la base de datos
 *
 * Devuelve true o false.
 */
export const compararPassword = async (
    password,
    hash
) => {

    return bcrypt.compare(
        password,
        hash
    );
};


// ==========================================================
// GENERAR TOKEN
// ==========================================================

/**
 * Genera un JWT.
 *
 * payload:
 * datos que queremos guardar dentro del token.
 *
 * secret:
 * clave utilizada para firmarlo.
 *
 * Si no mandamos secret,
 * utiliza JWT_SECRET_CLIENT por defecto.
 */
export const generarToken = (
    payload,
    secret = JWT_SECRET_CLIENT
) => {

    return jwt.sign(
        payload,
        secret,
        {
            expiresIn: '24h',
        }
    );
};

//modificacion maca 
//.env modificaicon