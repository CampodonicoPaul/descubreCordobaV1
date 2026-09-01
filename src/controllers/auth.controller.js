// authController.js maneja el inicio de sesión.
// Hay dos logins separados:
// - /auth/usuario/login para clientes del ecommerce.
// - /auth/admin/login para usuarios administradores del sistema.
// Cada uno genera un JWT distinto, por eso un token de usuario
// no sirve para acceder a rutas de admin, y viceversa.

import { compararPassword, generarToken, JWT_SECRET_CLIENT, JWT_SECRET_ADMIN } from '../utils/auth.js';
import { Usuario,
    UsuarioAdmin,
    Rol,
} from '../models/index.js';

/**
 * loginCliente
 * Recibe email y contrasenia, valida contra el modelo Usuario y
 * devuelve un token JWT con tipo 'usuario'.
 */
export const loginCliente = async (req, res) => {
    try {
        const { email, contrasenia } = req.body;

        // Validamos que vengan los datos mínimos.
        if (!email || !contrasenia) {
            return res.status(400).json({
                estado: false,
                mensaje: 'Debe proporcionar email y contrasenia',
            });
        }

        // Buscamos el usuario por email.
        const usuario = await Usuario.findOne({ where: { email } });

        if (!usuario) {
            return res.status(401).json({
                estado: false,
                mensaje: 'Credenciales inválidas',  
            });
        }

        // Comparamos la contraseña enviada con el hash guardado.
        const passwordValido = await compararPassword(contrasenia, usuario.contrasenia);

        if (!passwordValido) {
            return res.status(401).json({
                estado: false,
                mensaje: 'Credenciales inválidas',
            });
        }

        // Generamos el token con datos públicos del usuario.
        // Usamos el secreto de usuario para que no sirva en rutas de admin.
        const token = generarToken({
            id: usuario.id,
            email: usuario.email,
            tipo: 'usuario',
        }, JWT_SECRET_CLIENT);

        res.json({
            estado: true,
            mensaje: 'Login de usuario exitoso',
            token,
            usuario: {
                id: usuario.id,
                nombre: usuario.nombre,
                email: usuario.email,
            },
        });
    } catch (error) {
        console.error('Error en login usuario:', error);
        res.status(500).json({
            estado: false,
            mensaje: 'Error al iniciar sesión',
            error: error.message,
        });
    }
};

/**
 * registrarUsuario
 * Recibe nombre, email y contrasenia, crea el usuario y devuelve un token JWT.
 * La contraseña se encripta automáticamente con el hook del modelo Usuario.
 */
export const registrarUsuario = async (req, res) => {
    try {
        const { nombre, apellido, email, contrasenia, telefono } = req.body;

        // Validamos que vengan los datos mínimos.
        if (!nombre || !email || !contrasenia) {
            return res.status(400).json({
                estado: false,
                mensaje: 'Debe proporcionar nombre, email y contrasenia',
            });
        }

        // Verificamos que el email no esté registrado.
        const existe = await Usuario.findOne({ where: { email } });

        if (existe) {
            return res.status(400).json({
                estado: false,
                mensaje: 'El email ya está registrado',
            });
        }

        // Creamos el usuario. El hook beforeCreate encripta la contraseña.
        const usuario = await Usuario.create({ nombre, apellido, email, contrasenia, telefono });

        // Generamos el token con datos públicos del usuario.
        const token = generarToken({
            id: usuario.id,
            email: usuario.email,
            tipo: 'usuario',
        }, JWT_SECRET_CLIENT);

        res.status(201).json({
            estado: true,
            mensaje: 'Registro de usuario exitoso',
            token,
            usuario: {
                id: usuario.id,
                nombre: usuario.nombre,
                apellido: usuario.apellido,
                email: usuario.email,
                telefono: usuario.telefono,
            },
        });
    } catch (error) {
        console.error('Error en registrar usuario:', error);
        res.status(500).json({
            estado: false,
            mensaje: 'Error al registrar usuario',
            error: error.message,
        });
    }
};

/**
 * refreshTokenUsuario
 * Valida el token del usuario mediante el middleware verificarUsuario
 * y emite un nuevo token renovado con los datos actualizados del usuario.
 */
export const refreshTokenCliente = async (req, res) => {
    try {
        const usuario = req.usuario;

        const token = generarToken({
            id: usuario.id,
            email: usuario.email,
            tipo: 'usuario',
        }, JWT_SECRET_CLIENT);

        res.json({
            estado: true,
            mensaje: 'Token validado y renovado correctamente',
            token,
            usuario: {
                    id: usuario.id,
                    nombre: usuario.nombre,
                    apellido: usuario.apellido,
                    email: usuario.email,
                    telefono: usuario.telefono,
                },
        });
    } catch (error) {
        console.error('Error en refreshToken usuario:', error);
        res.status(500).json({
            estado: false,
            mensaje: 'Error al validar o renovar token',
            error: error.message,
        });
    }
};

/**
 * obtenerPerfilUsuario
 * Devuelve los datos del perfil del usuario logueado (sin contraseña).
 */
export const obtenerPerfilCliente = async (req, res) => {
    try {
        const usuario = await Usuario.findByPk(req.usuario.id, {
            attributes: { exclude: ['contrasenia'] },
        });

        if (!usuario) {
            return res.status(404).json({
                estado: false,
                mensaje: 'Usuario no encontrado',
            });
        }

        res.json({
            estado: true,
            data: usuario,
        });
    } catch (error) {
        console.error('Error al obtener perfil del usuario:', error);
        res.status(500).json({
            estado: false,
            mensaje: 'Error al obtener perfil',
            error: error.message,
        });
    }
};

/**
 * actualizarPerfilUsuario
 * Permite al usuario logueado actualizar sus datos personales.
 */
export const actualizarPerfilCliente = async (req, res) => {
    try {
        const usuario = await Usuario.findByPk(req.usuario.id);

        if (!usuario) {
            return res.status(404).json({
                estado: false,
                mensaje: 'Usuario no encontrado',
            });
        }

        const { nombre, apellido, email, telefono, contrasenia } = req.body;

        // Validamos que el email no pertenezca a otro usuario
        if (email && email !== usuario.email) {
            const existeEmail = await Usuario.findOne({ where: { email } });
            if (existeEmail && existeEmail.id !== usuario.id) {
                return res.status(400).json({
                    estado: false,
                    mensaje: 'El email ya se encuentra registrado por otro usuario',
                });
            }
        }

        const campos = {};
        if (nombre !== undefined) campos.nombre = nombre;
        if (apellido !== undefined) campos.apellido = apellido;
        if (email !== undefined) campos.email = email;
        if (telefono !== undefined) campos.telefono = telefono;
        if (contrasenia && contrasenia.trim() !== '') {
            campos.contrasenia = contrasenia; // Hook beforeUpdate de Usuario lo encripta
        }

        await usuario.update(campos);

        res.json({
            estado: true,
            mensaje: 'Perfil actualizado correctamente',
            usuario: {
                id: usuario.id,
                nombre: usuario.nombre,
                apellido: usuario.apellido,
                email: usuario.email,
                telefono: usuario.telefono,
            },
        });
    } catch (error) {
        console.error('Error al actualizar perfil del usuario:', error);
        res.status(400).json({
            estado: false,
            mensaje: 'Error al actualizar perfil',
            error: error.message,
        });
    }
};

export const loginAdmin = async (req, res) => {
    try {
        const { email, contrasenia } = req.body;

        if (!email || !contrasenia) {
            return res.status(400).json({
                estado: false,
                mensaje: 'Debe proporcionar email y contrasenia',
            });
        }

        // Buscamos el administrador junto con su rol
        const usuarioAdmin = await UsuarioAdmin.findOne({
            where: { email },
            include: {
                model: Rol,
                as: 'rol'
            }
        });

        // Verificamos que exista el usuario y tenga un rol
        if (!usuarioAdmin || !usuarioAdmin.rol) {
            return res.status(401).json({
                estado: false,
                mensaje: 'Credenciales inválidas o rol no asignado',
            });
        }

        // Verificamos que el rol sea ADMIN
        if (usuarioAdmin.rol.nombre.toUpperCase() !== 'ADMIN') {
            return res.status(403).json({
                estado: false,
                mensaje: 'Acceso solo para administradores',
            });
        }

        // Verificamos la contraseña
        const passwordValido = await compararPassword(
            contrasenia,
            usuarioAdmin.contrasenia
        );

        if (!passwordValido) {
            return res.status(401).json({
                estado: false,
                mensaje: 'Credenciales inválidas',
            });
        }

        // Generamos el JWT
        const token = generarToken({
            id: usuarioAdmin.id,
            email: usuarioAdmin.email,
            tipo: 'admin',
            idRol: usuarioAdmin.idRol,
            rol: usuarioAdmin.rol.nombre
        }, JWT_SECRET_ADMIN);

        res.json({
            estado: true,
            mensaje: 'Login de administrador exitoso',
            token,
            usuarioAdmin: {
                id: usuarioAdmin.id,
                nombre: usuarioAdmin.nombre,
                apellido: usuarioAdmin.apellido,
                email: usuarioAdmin.email,
                idRol: usuarioAdmin.idRol,
                rol: usuarioAdmin.rol.nombre
            },
        });

    } catch (error) {
        console.error('Error en loginAdmin:', error);

        res.status(500).json({
            estado: false,
            mensaje: 'Error al iniciar sesión',
            error: error.message,
        });
    }
};

/**
 * refreshTokenAdmin
 * Valida el token del administrador y emite uno nuevo con datos actualizados.
 * El middleware verificarAdmin ya cargó al usuarioAdmin en req.usuarioAdmin,
 * por lo que podemos confiar en esa información.
 */
export const refreshTokenAdmin = async (req, res) => {
    try {
        const usuario = req.usuarioAdmin;

        const token = generarToken({
            id: usuario.id,
            email: usuario.email,
            tipo: 'admin',
            idRol: usuario.idRol,
            rolNombre: usuario.rol.nombre,
        }, JWT_SECRET_ADMIN);

        res.json({
            estado: true,
            mensaje: 'Token de administrador validado y renovado',
            token,
            usuario: {
                id: usuario.id,
                nombre: usuario.nombre,
                apellido: usuario.apellido,
                email: usuario.email,
                rol: usuario.rol.nombre,
                idRol: usuario.idRol,
            },
        });
    } catch (error) {
        console.error('Error en refreshTokenAdmin:', error);
        res.status(500).json({
            estado: false,
            mensaje: 'Error al renovar token de administrador',
            error: error.message,
        });
    }
};

/**
 * obtenerPerfilAdmin
 * Devuelve el perfil del administrador logueado.
 * Excluye el campo password de la respuesta.
 */
export const obtenerPerfilAdmin = async (req, res) => {
    try {
        const usuario = await UsuarioAdmin.findByPk(req.usuarioAdmin.id, {
            include: { model: Rol, as: 'rol' },
            attributes: { exclude: ['contrasenia'] },
        });

        if (!usuario) {
            return res.status(404).json({
                estado: false,
                mensaje: 'Administrador no encontrado',
            });
        }

        res.json({
            estado: true,
            data: usuario,
        });
    } catch (error) {
        console.error('Error al obtener perfil de administrador:', error);
        res.status(500).json({
            estado: false,
            mensaje: 'Error al obtener perfil de administrador',
            error: error.message,
        });
    }
};