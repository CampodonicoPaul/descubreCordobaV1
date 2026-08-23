import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const DetalleCompra = sequelize.define('DetalleCompra', {
    
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,      
        autoIncrement: true,  
    },
    cantidad: {
        type: DataTypes.INTEGER,
        allowNull: false,      
    },
    precioUnitario: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,              
    },
    idCompra: {
        type: DataTypes.INTEGER, 
        allowNull: false
      },
    idExcursion: {
        type: DataTypes.INTEGER, 
        allowNull: false
      }
},{ 
    tableName: 'detalleCompra',   
    timestamps: false,         // No agregamos columnas createdAt ni updatedAt.
});

export default DetalleCompra;