
import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Compra = sequelize.define('Compra', {
    
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,      
        autoIncrement: true,  
    },
    fechaCompra: {
        type: DataTypes.DATE,
        allowNull: false,      
    },
    total: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,              
    },
    estado: {
        type: DataTypes.STRING,
        allowNull: false,          
    },
    idUsuario: {
        type: DataTypes.INTEGER, 
        allowNull: false
      }
},{ 
    tableName: 'compras',   
    timestamps: false,         // No agregamos columnas createdAt ni updatedAt.
});

export default Compra;