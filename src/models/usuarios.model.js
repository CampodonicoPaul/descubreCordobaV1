// usuarios.model.js
// Modelo de Usuario.
// La contraseña se guarda en el campo "contrasenia"
// y se encripta automáticamente con bcrypt.

import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';
import { encriptarPassword } from '../utils/auth.js';

const Usuario = sequelize.define(
    'Usuario',
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },

        nombre: {
            type: DataTypes.STRING,
            allowNull: false,
        },

        apellido: {
            type: DataTypes.STRING,
        },

        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },

        contrasenia: {
            type: DataTypes.STRING,
            allowNull: false,
        },

        telefono: {
            type: DataTypes.STRING,
        },
    },
    {
        tableName: 'usuarios',
        timestamps: false,

        hooks: {
            // Antes de crear el usuario,
            // encriptamos la contraseña.
            beforeCreate: async (usuario) => {
                if (usuario.contrasenia) {
                    usuario.contrasenia =
                        await encriptarPassword(
                            usuario.contrasenia
                        );
                }
            },

            // Si el usuario cambia la contraseña,
            // volvemos a encriptarla.
            beforeUpdate: async (usuario) => {
                if (usuario.changed('contrasenia')) {
                    usuario.contrasenia =
                        await encriptarPassword(
                            usuario.contrasenia
                        );
                }
            },
        },
    }
);

export default Usuario;