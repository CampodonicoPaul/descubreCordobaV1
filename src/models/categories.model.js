// categorias.model.js define el modelo de datos para la tabla "categorias".
// Un modelo en Sequelize representa una tabla de la base de datos.

import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Categoria = sequelize.define('Categoria', {
    // Cada propiedad representa una columna de la tabla.
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,      // Es la clave primaria.
        autoIncrement: true,   // Se incrementa automáticamente por MySQL.
    },
    nombre: {
        type: DataTypes.STRING,
        allowNull: false,      // Campo obligatorio.
        unique: true,          // No puede haber dos categorías con el mismo nombre.
    },
    descripcion: {
        type: DataTypes.TEXT,  // Permite descripciones más largas que STRING.
    },
}, {
    tableName: 'categorias',   // Nombre exacto de la tabla en la base de datos.
    timestamps: false,         // No agregamos columnas createdAt ni updatedAt.
});

export default Categoria;