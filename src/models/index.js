import sequelize from '../config/database.js';

// Importamos solo los modelos iniciales
import Usuario from './usuarios.model.js';
import Categoria from './categorias.model.js';
import Excursion from './excursiones.model.js';
import UsuarioAdmin from './usuarioAdmin.model.js';

Categoria.hasMany(Excursion, {
    foreignKey: 'categoriaId',
    as: 'excursiones',
});
Excursion.belongsTo(Categoria, {
    foreignKey: 'categoriaId',
    as: 'categoria',
});

// Exportamos solo los modelos activos
export {
    sequelize,
    Usuario,
    Categoria,
    Excursion,
    UsuarioAdmin
};

export default {
    sequelize,
    Usuario,
    Categoria,
    Excursion,
    UsuarioAdmin
};