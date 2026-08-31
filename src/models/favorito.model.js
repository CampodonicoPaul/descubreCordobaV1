import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Favorito = sequelize.define('Favorito', {
    
     id: {
        type: DataTypes.INTEGER,
        primaryKey: true,      
        autoIncrement: true,  
    },
    idUsuario: {
        type: DataTypes.INTEGER,
       allowNull : false
        
    },
    idExcursion: {
        type: DataTypes.INTEGER,
        allowNull:false      
    }
}, { 
    tableName: 'favorito',   
    timestamps: false        
});

export default Favorito;