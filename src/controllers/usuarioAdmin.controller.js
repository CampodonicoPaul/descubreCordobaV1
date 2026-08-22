import UsuarioAdmin from '../models/index.js';

// Crear un nuevo administrador
export const crearUsuarioAdmin = async (req, res) => {
    try {

         console.log("ENTRÓ AL POST");
        console.log(req.body);
        const { nombre, apellido, email, contrasenia, rol } = req.body;

        const nuevoAdmin = await UsuarioAdmin.create({
            nombre,
            apellido,
            email,
            contrasenia, // El hook beforeCreate se encarga de encriptarla
            rol
        });

        // Ocultar la contraseña en la respuesta
        const adminResponse = nuevoAdmin.toJSON();
        delete adminResponse.contrasenia;

        return res.status(201).json(adminResponse);
} catch (error) {
    console.log("ERROR REAL:", error);
    return res.status(500).json({
        mensaje: 'Error al crear el usuario',
        error: error.message
    });
}
};

// Obtener todos los administradores
export const obtenerUsuariosAdmin = async (req, res) => {
    try {
        const usuarios = await UsuarioAdmin.findAll({
            attributes: { exclude: ['contrasenia'] }
        });
        return res.status(200).json(usuarios);
    } catch (error) {
        return res.status(500).json({ mensaje: 'Error al obtener usuarios', error: error.message });
    }
};

// Obtener un administrador por ID
export const obtenerUsuarioAdminPorId = async (req, res) => {
    try {
        const { id } = req.params;
        const admin = await UsuarioAdmin.findByPk(id, {
            attributes: { exclude: ['contrasenia'] }
        });

        if (!admin) {
            return res.status(404).json({ mensaje: 'Usuario administrador no encontrado' });
        }

        return res.status(200).json(admin);
    } catch (error) {
        return res.status(500).json({ mensaje: 'Error al obtener el usuario', error: error.message });
    }
};

// Actualizar un administrador
export const actualizarUsuarioAdmin = async (req, res) => {
    try {
        const { id } = req.params;
        const { nombre, apellido, email, contrasenia, rol } = req.body;

        const admin = await UsuarioAdmin.findByPk(id);

        if (!admin) {
            return res.status(404).json({ mensaje: 'Usuario administrador no encontrado' });
        }

        // Asignamos cambios campo por campo para que Sequelize detecte cambios en 'contrasenia'
        if (nombre !== undefined) admin.nombre = nombre;
        if (apellido !== undefined) admin.apellido = apellido;
        if (email !== undefined) admin.email = email;
        if (contrasenia !== undefined) admin.contrasenia = contrasenia; // El hook beforeUpdate se ejecutará al llamar save()
        if (rol !== undefined) admin.rol = rol;

        await admin.save();

        const adminResponse = admin.toJSON();
        delete adminResponse.contrasenia;

        return res.status(200).json(adminResponse);
    } catch (error) {
        if (error.name === 'SequelizeUniqueConstraintError') {
            return res.status(400).json({ mensaje: 'El email ya está registrado por otro usuario' });
        }
        return res.status(500).json({ mensaje: 'Error al actualizar el usuario', error: error.message });
    }
};

// Eliminar un administrador
export const eliminarUsuarioAdmin = async (req, res) => {
    try {
        const { id } = req.params;
        const admin = await UsuarioAdmin.findByPk(id);

        if (!admin) {
            return res.status(404).json({ mensaje: 'Usuario administrador no encontrado' });
        }

        await admin.destroy();
        return res.status(200).json({ mensaje: 'Usuario administrador eliminado correctamente' });
    } catch (error) {
        return res.status(500).json({ mensaje: 'Error al eliminar el usuario', error: error.message });
    }
};