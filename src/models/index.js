import sequelize from '../config/database.js';

// Importamos solo los modelos iniciales
import Usuario from './usuarios.model.js';
import Categoria from './categoria.model.js';
import Excursion from './excursiones.model.js';
import UsuarioAdmin from './usuarioAdmin.model.js';
import Rol from './roles.model.js'
import Compra from './compra.model.js';
import DetalleCompra from './detalleCompra.model.js';
import Carrito from "./carrito.model.js"
import ItemCarrito from "./itemCarrito.model.js"
import Favorito from './favorito.model.js';


Rol.hasMany(UsuarioAdmin, {
    foreignKey: 'idRol',
    as: 'UsuarioAdmin',       // alias para acceder a los usuarios de un rol
});
UsuarioAdmin.belongsTo(Rol, {
    foreignKey: 'idRol',
    as: 'rol',            // alias para acceder al rol de un usuario
});

Categoria.hasMany(Excursion, {
    foreignKey: 'idCategoria',
    as: 'excursiones',
});
Excursion.belongsTo(Categoria, {
    foreignKey: 'idCategoria',
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

// ===============================
// RELACIONES DEL CARRITO
// ===============================

// Un Usuario puede tener muchos Carritos
Usuario.hasMany(Carrito, {
  foreignKey: 'idUsuario',
  as: 'carritos',
});

// Un Carrito pertenece a un Usuario
Carrito.belongsTo(Usuario, {
  foreignKey: 'idUsuario',
  as: 'usuario',
});


// ===============================
// RELACIONES DE LOS ITEMS DEL CARRITO
// ===============================

// Un Carrito tiene muchos Items
Carrito.hasMany(ItemCarrito, {
  foreignKey: 'idCarrito',
  as: 'items',
});

// Un ItemCarrito pertenece a un Carrito
ItemCarrito.belongsTo(Carrito, {
  foreignKey: 'idCarrito',
  as: 'carrito',
});

// Una Excursion puede estar en muchos ItemsCarrito
Excursion.hasMany(ItemCarrito, {
  foreignKey: 'idExcursion',
  as: 'itemsCarrito',
});

// Un ItemCarrito pertenece a una Excursion
ItemCarrito.belongsTo(Excursion, {
  foreignKey: 'idExcursion',
  as: 'excursion',
});


// ===============================
// RELACIONES DE FAVORITOS
// ===============================

// Un Usuario puede tener muchos Favoritos
Usuario.hasMany(Favorito, {
  foreignKey: 'idUsuario',
  as: 'favoritos',
});

// Un Favorito pertenece a un Usuario
Favorito.belongsTo(Usuario, {
  foreignKey: 'idUsuario',
  as: 'usuario',
});

// Una Excursion puede ser favorita de muchos usuarios
Excursion.hasMany(Favorito, {
  foreignKey: 'idExcursion',
  as: 'favoritos',
});

// Un Favorito pertenece a una Excursion
Favorito.belongsTo(Excursion, {
  foreignKey: 'idExcursion',
  as: 'excursion',
});



// Exportamos solo los modelos activos
export {
    sequelize,
    Usuario,
    Categoria,
    Excursion,
    UsuarioAdmin,
    Rol,
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
    Rol,
    Compra, 
    DetalleCompra,
    Carrito,
    ItemCarrito,
    Favorito
};