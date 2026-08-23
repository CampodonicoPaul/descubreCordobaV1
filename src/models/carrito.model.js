
import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Carrito = sequelize.define('Carrito', {
    
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,      
        autoIncrement: true,  
    },
    fechaCreacion: {
        type: DataTypes.DATE,
        allowNull: false,      
    },
    idUsuario: {
        type: DataTypes.INTEGER,
        allowNull: true
    }
},{ 
    tableName: 'carritos',   
    timestamps: false,         // No agregamos columnas createdAt ni updatedAt.
});

export default Carrito;