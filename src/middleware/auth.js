// auth.js contiene los middlewares que protegen las rutas del backend.
// Verifica que el token JWT sea válido y que el usuario tenga
// los permisos necesarios para acceder a determinadas rutas.

import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../utils/auth.js';
import Usuario from '../models/usuarios.model.js';

/**
 * verificarToken
 *
 * Lee el token JWT enviado en:
 *
 * Authorization: Bearer <token>
 *
 * Si el token es válido, guarda la información del usuario
 * en req.user y permite continuar con la petición.
 */
export const verificarToken = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({
                estado: false,
                mensaje: 'No se proporcionó un token de autenticación',
            });
        }

        // Obtenemos únicamente el token.
        const token = authHeader.split(' ')[1];

        // Verificamos que el token sea válido.
        const payload = jwt.verify(token, JWT_SECRET);

        // Guardamos los datos del usuario.
        req.user = payload;

        next();

    } catch (error) {
        return res.status(401).json({
            estado: false,
            mensaje: 'Token inválido o expirado',
            error: error.message,
        });
    }
};


/**
 * verificarUsuario
 *
 * Middleware para rutas que requieren que el usuario
 * esté autenticado.
 *
 * Además del token, buscamos al usuario en la base de datos.
 */
export const verificarUsuario = async (req, res, next) => {
    try {

        if (!req.user || !req.user.id) {
            return res.status(401).json({
                estado: false,
                mensaje: 'Usuario no autenticado',
            });
        }

        const usuario = await Usuario.findByPk(req.user.id);

        if (!usuario) {
            return res.status(404).json({
                estado: false,
                mensaje: 'Usuario no encontrado',
            });
        }

        // Guardamos el usuario encontrado.
        req.usuario = usuario;

        next();

    } catch (error) {
        console.error('Error en verificarUsuario:', error);

        return res.status(500).json({
            estado: false,
            mensaje: 'Error al verificar usuario',
            error: error.message,
        });
    }
};


/**
 * verificarAdmin
 *
 * Middleware para rutas que solamente pueden utilizar
 * los administradores.
 *
 * Primero verifica que exista un usuario autenticado
 * y después comprueba su rol.
 */
export const verificarAdmin = async (req, res, next) => {
    try {

        if (!req.user || !req.user.id) {
            return res.status(401).json({
                estado: false,
                mensaje: 'Usuario no autenticado',
            });
        }

        const usuario = await Usuario.findByPk(req.user.id);

        if (!usuario) {
            return res.status(404).json({
                estado: false,
                mensaje: 'Usuario no encontrado',
            });
        }

        // Comprobamos el rol del usuario.
        if (usuario.rol !== 'admin' && usuario.rol !== 'administrador') {
            return res.status(403).json({
                estado: false,
                mensaje: 'Acceso solo para administradores',
            });
        }

        req.usuario = usuario;

        next();

    } catch (error) {
        console.error('Error en verificarAdmin:', error);

        return res.status(500).json({
            estado: false,
            mensaje: 'Error al verificar administrador',
            error: error.message,
        });
    }
};