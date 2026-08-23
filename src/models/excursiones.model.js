import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const Excursion = sequelize.define(
  "Excursion",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true, // PK
      autoIncrement: true,
    },
    nombre: {
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
    fecha: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    ubicacion: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    duracion: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    cupos: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    imagen: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    idUsuarioAdmin: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    idCategoria: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
  },
  {
    tableName: "excursiones",
    timestamps: false,
  },
);

export default Excursion;
