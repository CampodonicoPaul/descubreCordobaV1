import {UsuarioAdmin} from '../models/index.js';
import Rol from '../models/roles.model.js';

/**
 * listarAdministradores
 * Devuelve todos los usuarios con sus roles.
 * Accesible para ADMIN y OPERADOR.
 */
export const listarAdministradores = async (req, res) => {
    try {
        const data = await UsuarioAdmin.findAll({
            include: {
                model: Rol,
                as: 'rol',
            },
            attributes: { exclude: ['contrasenia'] },
            order: [['id', 'ASC']],
        });

        res.json({
            estado: true,
            data,
        });
    } catch (error) {
        console.error('Error al listar administradores:', error);
        res.status(500).json({
            estado: false,
            mensaje: 'Error al listar administradores',
            error: error.message,
        });
    }
};

/**
 * obtenerAdministradorPorId
 * Devuelve un usuario administrador por su id.
 * Accesible para ADMIN y OPERADOR.
 */
export const obtenerAdministradorPorId = async (req, res) => {
    try {
        const id = parseInt(req.params.id, 10);

        const usuario = await UsuarioAdmin.findByPk(id, {
            include: {
                model: Rol,
                as: 'rol',
            },
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
        console.error('Error al obtener administrador:', error);
        res.status(500).json({
            estado: false,
            mensaje: 'Error al obtener administrador',
            error: error.message,
        });
    }
};



/**
 * crearAdministrador
 * Crea un nuevo usuario con rol de administración.
 * Solo accesible para ADMIN.
 */
export const crearAdministrador = async (req, res) => {
    try {
        const { nombre, apellido, email, contrasenia, idRol } = req.body;

        if (!nombre || !email || !contrasenia || !idRol) {
            return res.status(400).json({
                estado: false,
                mensaje: 'Debe proporcionar nombre, email, contraseña y idRol',
            });
        }

        // Verificamos que el rol exista y sea ADMIN u OPERADOR.
        // Así evitamos asignar roles ajenos al panel de administración.
        const rol = await Rol.findByPk(idRol);
        if (!rol || !['ADMIN', 'OPERADOR'].includes(rol.nombre.toUpperCase())) {
            return res.status(400).json({
                estado: false,
                mensaje: 'El rol seleccionado no es válido para un usuario administrativo',
            });
        }

        // Verificamos que el email no esté registrado.
        // El modelo también tiene unique, pero validamos antes para un mensaje claro.
        const existe = await Usuario.findOne({ where: { email } });
        if (existe) {
            return res.status(400).json({
                estado: false,
                mensaje: 'El email ya está registrado',
            });
        }

        const data = await UsuarioAdmin.create({
            nombre,
            apellido,
            email,
            contrasenia,
            idRol,
        });

        res.status(201).json({
            estado: true,
            mensaje: 'Usuario administrativo creado correctamente',
            data: await UsuarioAdmin.findByPk(data.id, {
                include: { model: Rol, as: 'rol' },
                attributes: { exclude: ['contrasenia'] },
            }),
        });
    } catch (error) {
        console.error('Error al crear administrador:', error);
        res.status(400).json({
            estado: false,
            mensaje: 'Error al crear administrador',
            error: error.message,
        });
    }
};

/**
 * actualizarAdministrador
 * Actualiza los datos de un usuario administrativo.
 * Solo accesible para ADMIN.
 */
export const actualizarAdministrador = async (req, res) => {
    try {
        const id = parseInt(req.params.id, 10);
        const usuario = await UsuarioAdmin.findByPk(id);

        if (!usuario) {
            return res.status(404).json({
                estado: false,
                mensaje: 'Usuario no encontrado',
            });
        }

        const { nombre, apellido, email, contrasenia, idRol } = req.body;

        if (email && email !== usuario.email) {
            const existeEmail = await UsuarioAdmin.findOne({ where: { email } });
            if (existeEmail && existeEmail.id !== id) {
                return res.status(400).json({
                    estado: false,
                    mensaje: 'El email ya se encuentra registrado por otro usuario',
                });
            }
        }

        if (idRol) {
            const rol = await Rol.findByPk(idRol);
            if (!rol || !['ADMIN', 'OPERADOR'].includes(rol.nombre.toUpperCase())) {
                return res.status(400).json({
                    estado: false,
                    mensaje: 'El rol seleccionado no es válido para un usuario administrativo',
                });
            }
        }

        // Construimos un objeto solo con los campos enviados.
        // Así no sobrescribimos valores con undefined.
        const campos = {};
        if (nombre !== undefined) campos.nombre = nombre;
        if (apellido !== undefined) campos.apellido = apellido;
        if (email !== undefined) campos.email = email;
        if (idRol !== undefined) campos.idRol = idRol;
        if (contrasenia && contrasenia.trim() !== '') {
            campos.contrasenia = contrasenia; // El hook beforeUpdate de Sequelize encripta automáticamente
        }

        await usuario.update(campos);

        res.json({
            estado: true,
            mensaje: 'Usuario administrativo actualizado correctamente',
            data: await UsuarioAdmin.findByPk(usuario.id, {
                include: { model: Rol, as: 'rol' },
                attributes: { exclude: ['contrasenia'] },
            }),
        });
    } catch (error) {
        console.error('Error al actualizar administrador:', error);
        res.status(400).json({
            estado: false,
            mensaje: 'Error al actualizar administrador',
            error: error.message,
        });
    }
};

/**
 * eliminarAdministrador
 * Elimina un usuario administrativo.
 * Solo accesible para ADMIN.
 * Un administrador no puede eliminarse a sí mismo.
 */
export const eliminarAdministrador = async (req, res) => {
    try {
        const id = parseInt(req.params.id, 10);

        // Impedimos que un administrador se elimine a sí mismo,
        // evitando quedar sin acceso al panel.
        if (req.usuario.id === id) {
            return res.status(400).json({
                estado: false,
                mensaje: 'No podés eliminar tu propio usuario',
            });
        }

        const usuario = await UsuarioAdmin.findByPk(id);

        if (!usuario) {
            return res.status(404).json({
                estado: false,
                mensaje: 'Usuario no encontrado',
            });
        }

        await usuario.destroy();

        res.json({
            estado: true,
            mensaje: 'Usuario administrativo eliminado correctamente',
        });
    } catch (error) {
        console.error('Error al eliminar administrador:', error);
        res.status(500).json({
            estado: false,
            mensaje: 'Error al eliminar administrador',
            error: error.message,
        });
    }
};

/**
 * listarRoles
 * Devuelve los roles ADMIN y OPERADOR disponibles para asignar.
 * Solo accesible para ADMIN.
 */
export const listarRoles = async (req, res) => {
    try {
        const data = await Rol.findAll({
            where: {
                nombre: ['ADMIN', 'OPERADOR'],
            },
            order: [['nombre', 'ASC']],
        });

        res.json({
            estado: true,
            data,
        });
    } catch (error) {
        console.error('Error al listar roles:', error);
        res.status(500).json({
            estado: false,
            mensaje: 'Error al listar roles',
            error: error.message,
        });
    }
};