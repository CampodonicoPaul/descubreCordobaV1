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
    rol: {
        type: DataTypes.STRING(45), 
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