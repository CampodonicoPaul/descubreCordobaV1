import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';
import { encriptarPassword } from '../utils/auth.js';

const UsuarioAdmin = sequelize.define('UsuarioAdmin', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    nombre: {
        type: DataTypes.STRING(45),
        allowNull: false,
    },
    apellido: {
        type: DataTypes.STRING(45),
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING(45),
        allowNull: false,
        unique: true,
    },
    contrasenia: {
        type: DataTypes.STRING(255), 
        allowNull: false,
    },
    idRol: {
        type: DataTypes.STRING(45),
        allowNull: true,
    },
}, {
    tableName: 'usuarios_admin',
    timestamps: false,
    hooks: {
        beforeCreate: async (admin) => {
            if (admin.contrasenia) {
                admin.contrasenia = await encriptarPassword(admin.contrasenia);
            }
        },
        beforeUpdate: async (admin) => {
            if (admin.changed('contrasenia')) {
                admin.contrasenia = await encriptarPassword(admin.contrasenia);
            }
        },
    },
});

export default UsuarioAdmin;