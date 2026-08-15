import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Excursion = sequelize.define('Excursion', {

    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,      // PK
        autoIncrement: true,  
    },
    titulo: {
        type: DataTypes.STRING,
        allowNull: false,      
    },
    descripcion: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    precio: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
    },
    ubicacion: {
        type: DataTypes.STRING,
    },
    duracion: {
        type: DataTypes.STRING,        
    },
    cupoMaximo: {
        type: DataTypes.INTEGER,
    },
    imagenUrl: {
        type: DataTypes.STRING,        
    },
    disponible: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,            
    },
}, {
    tableName: 'excursiones',  
    timestamps: false,         
});

export default Excursion;