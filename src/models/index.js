import sequelize from '../config/database.js';

// Importamos solo los modelos iniciales
import Usuario from './usuarios.model.js';
import Categoria from './categoria.model.js';
import Excursion from './excursiones.model.js';
import UsuarioAdmin from './usuarioAdmin.model.js';
import Compra from './compra.model.js';
import DetalleCompra from './detalleCompra.model.js';
import Favorito from './favorito.model.js';


import Carrito from "./carrito.model.js"
import ItemCarrito from "./itemCarrito.model.js"


Categoria.hasMany(Excursion, {
    foreignKey: 'categoriaId',
    as: 'excursiones',
});
Excursion.belongsTo(Categoria, {
    foreignKey: 'categoriaId',
    as: 'categoria',
});

// Un Usuario tiene muchas Compras
Usuario.hasMany(Compra, { 
  foreignKey: 'idUsuario', 
  as: 'compras' // Alias en plural para traer todas las compras de un usuario
});

// Una Compra pertenece a un Usuario
Compra.belongsTo(Usuario, { 
  foreignKey: 'idUsuario', 
  as: 'usuario' // Alias en singular para saber quién hizo la compra
});

/////////
Compra.hasMany(DetalleCompra, {
  foreignKey: 'idCompra',
  as: 'detalles'
})

DetalleCompra.belongsTo(Compra, {
  foreignKey: 'idCompra',
  as: 'compra'
})

/////////
Excursion.hasMany(DetalleCompra, {
  foreignKey: 'idExcursion',
  as: 'detallesCompra'
})

DetalleCompra.belongsTo(Excursion, {
  foreignKey: 'idExcursion',
  as: 'excursion'
})



// Exportamos solo los modelos activos
export {
    sequelize,
    Usuario,
    Categoria,
    Excursion,
    UsuarioAdmin, 
    Compra, 
    DetalleCompra,
    Carrito,
    ItemCarrito,
    Favorito
};

export default {
    sequelize,
    Usuario,
    Categoria,
    Excursion,
    UsuarioAdmin,
    Compra, 
    DetalleCompra,
    Carrito,
    ItemCarrito,
    Favorito
};