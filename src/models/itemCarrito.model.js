import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const itemCarrito = sequelize.define('itemCarrito', {

    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,      // PK
        autoIncrement: true,  
    },
    cantidad: {
        type: DataTypes.INTEGER,
        allowNull: false,      
    },
    subtotal: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
    },
    idCarrito: {
        type: DataTypes.INTEGER, 
        allowNull: false,       
    },
    idExcursion: {
        type: DataTypes.INTEGER,
        allowNull: false,           
    },
}, {
    tableName: 'itemscarrito',
    timestamps: false,         
});

export default itemCarrito;