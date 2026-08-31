import 'dotenv/config';

import sequelize from './src/config/database.js';
import UsuarioAdmin from './src/models/usuarioAdmin.model.js';
import Rol from './src/models/roles.model.js';

const crearAdmin = async () => {
    try {
        await sequelize.authenticate();

        console.log('Conectado a la base de datos.');

        const rol = await Rol.findOne({
            where: {
                nombre: 'ADMIN'
            }
        });

        if (!rol) {
            console.log('No existe el rol administrador.');
            return;
        }

        const adminExistente = await UsuarioAdmin.findOne({
            where: {
                email: 'admin@gmail.com'
            }
        });

        if (adminExistente) {
            console.log('El administrador ya existe.');
            return;
        }

        const admin = await UsuarioAdmin.create({
            nombre: 'Administrador',
            apellido: 'Principal',
            email: 'admin@gmail.com',
            contrasenia: '123456',
            idRol: rol.id
        });

        console.log('Administrador creado correctamente.');

        console.log({
            id: admin.id,
            nombre: admin.nombre,
            apellido: admin.apellido,
            email: admin.email,
            idRol: admin.idRol
        });

    } catch (error) {
        console.error('Error al crear administrador:', error);
    } finally {
        await sequelize.close();
    }
};

crearAdmin();