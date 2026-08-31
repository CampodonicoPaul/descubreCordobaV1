// auth.js contiene los middlewares que protegen las rutas del backend.
// Un middleware se ejecuta antes de llegar al controlador.
//
// Usamos un secreto distinto para:
// - usuarios normales
// - administradores

import jwt from 'jsonwebtoken';

import {
    JWT_SECRET_CLIENT,
    JWT_SECRET_ADMIN,
} from '../utils/auth.js';

import Usuario from '../models/usuarios.model.js';
import UsuarioAdmin from '../models/usuarioAdmin.model.js';
import Rol from '../models/roles.model.js';


// ==========================================================
// VERIFICAR TOKEN
// ==========================================================

/**
 * verificarToken
 *
 * Recibe el secreto con el que se debe validar el JWT
 * y devuelve un middleware.
 *
 * Ejemplo:
 *
 * verificarToken(JWT_SECRET_CLIENT)
 *
 * o
 *
 * verificarToken(JWT_SECRET_ADMIN)
 */
export const verificarToken = (secret) => (req, res, next) => {

    try {

        // El token llega así:
        //
        // Authorization: Bearer TOKEN
        const authHeader =
            req.headers.authorization;


        if (
            !authHeader ||
            !authHeader.startsWith('Bearer ')
        ) {

            return res.status(401).json({
                estado: false,
                mensaje:
                    'No se proporcionó un token de autenticación',
            });
        }


        // Separamos:
        //
        // Bearer eyJ...
        //
        // y nos quedamos con:
        //
        // eyJ...
        const token =
            authHeader.split(' ')[1];


        // Validamos:
        // - firma
        // - secreto correcto
        // - vencimiento
        const payload =
            jwt.verify(
                token,
                secret
            );


        // Guardamos los datos del token.
        req.user = payload;


        next();

    } catch (error) {

        return res.status(401).json({
            estado: false,
            mensaje:
                'Token inválido o expirado',
            error: error.message,
        });
    }
};


// ==========================================================
// VERIFICAR USUARIO
// ==========================================================

/**
 * verificarUsuario
 *
 * Se usa para las rutas de usuarios normales.
 *
 * 1. Verifica JWT con JWT_SECRET_CLIENT
 * 2. Comprueba que tipo sea "usuario"
 * 3. Busca al usuario en la base de datos
 * 4. Lo guarda en req.usuario
 */
export const verificarUsuario = (
    req,
    res,
    next
) => {

    // Igual que el profesor,
    // reutilizamos verificarToken.
    verificarToken(
        JWT_SECRET_CLIENT
    )(
        req,
        res,
        async (err) => {

            if (err) {
                return next(err);
            }

            try {

                // En auth.controller.js ustedes generan:
                //
                // tipo: 'usuario'
                if (
                    !req.user ||
                    req.user.tipo !== 'usuario'
                ) {

                    return res.status(403).json({
                        estado: false,
                        mensaje:
                            'Acceso restringido para usuarios',
                    });
                }


                // Buscamos al usuario utilizando
                // el id que vino dentro del JWT.
                const usuario =
                    await Usuario.findByPk(
                        req.user.id
                    );


                if (!usuario) {

                    return res.status(403).json({
                        estado: false,
                        mensaje:
                            'Usuario no encontrado',
                    });
                }


                // Dejamos disponible el usuario
                // para el controller.
                //
                // Ejemplo:
                //
                // const usuario = req.usuario;
                req.usuario = usuario;


                next();

            } catch (error) {

                console.error(
                    'Error en verificarUsuario:',
                    error
                );


                return res.status(500).json({
                    estado: false,
                    mensaje:
                        'Error al verificar usuario',
                    error: error.message,
                });
            }
        }
    );
};


// ==========================================================
// VERIFICAR ADMIN
// ==========================================================

/**
 * verificarAdmin
 *
 * Se usa solamente para rutas de administradores.
 *
 * 1. Verifica JWT con JWT_SECRET_ADMIN
 * 2. Comprueba tipo "admin"
 * 3. Busca al administrador
 * 4. Comprueba su rol
 */
export const verificarAdmin = (
    req,
    res,
    next
) => {

    verificarToken(
        JWT_SECRET_ADMIN
    )(
        req,
        res,
        async (err) => {

            if (err) {
                return next(err);
            }

            try {

                // El token del administrador
                // se crea con tipo: 'admin'.
                if (
                    !req.user ||
                    req.user.tipo !== 'admin'
                ) {

                    return res.status(403).json({
                        estado: false,
                        mensaje:
                            'Acceso solo para administradores',
                    });
                }


                // En su proyecto el administrador
                // está en un modelo separado.
                const usuarioAdmin =
                    await UsuarioAdmin.findByPk(
                        req.user.id, {
                include: {
                    model: Rol,
                    as: 'rol',
                },
            });


                if (!usuarioAdmin || !usuarioAdmin.rol) {
                return res.status(403).json({
                    estado: false,
                    mensaje: 'Usuario o rol no encontrado',
                });
            }


            // Permitimos tanto ADMIN como OPERADOR. Si el rol no está
            // en esta lista, el token era válido pero el usuario no tiene
            // acceso al panel de administración.
            const rol = usuarioAdmin.rol.nombre.toUpperCase();
            if (!['ADMIN', 'OPERADOR'].includes(rol)) {
                return res.status(403).json({
                    estado: false,
                    mensaje: 'El usuario no tiene permisos de administrador',
                });
            }


                req.usuarioAdmin =
                    usuarioAdmin;


                next();

            } catch (error) {

                console.error(
                    'Error en verificarAdmin:',
                    error
                );


                return res.status(500).json({
                    estado: false,
                    mensaje:
                        'Error al verificar administrador',
                    error: error.message,
                });
            }
        }
    );
};

export const verificarRolAdmin = (req, res, next) => {
    if (!req.usuarioAdmin || !req.usuarioAdmin.rol) {
        return res.status(403).json({
            estado: false,
            mensaje: 'No se pudo verificar el rol del usuario',
        });
    }

    // Comparamos en mayúsculas para evitar problemas de mayúsculas/minúsculas.
    const rol = req.usuarioAdmin.rol.nombre.toUpperCase();
    if (rol !== 'ADMIN') {
        return res.status(403).json({
            estado: false,
            mensaje: 'Esta acción requiere permisos de ADMIN',
        });
    }

    next();
};