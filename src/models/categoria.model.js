
import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Categoria = sequelize.define('Categoria', {
    
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,      
        autoIncrement: true,  
    },
    nombre: {
        type: DataTypes.STRING,
        allowNull: false,      
        unique: true,          // No puede haber dos categorías con el mismo nombre.
    },
    descripcion: {
        type: DataTypes.TEXT,  },
        
           idUsuarioAdmin: {
        type: DataTypes.INTEGER,
        allowNull: true
    }
},{ 
    tableName: 'categorias',   
    timestamps: false,         // No agregamos columnas createdAt ni updatedAt.
});

export default Categoria;