import { Router } from 'express';
import usuariosRoutes from './usuario.routes.js';
import categoriasRoutes from './categorias.routes.js';
import excursionesRoutes from './excursiones.routes.js';
import UsuarioAdminRoutes from './usuarioAdmin.routes.js';
import carritoRoutes from "./carrito.routes.js"
import itemCarrito from './itemCarrito.routes.js';

const router = Router();

// Registro de cada módulo con su prefijo
router.use('/usuarios', usuariosRoutes);
router.use('/categorias', categoriasRoutes);
router.use('/excursiones', excursionesRoutes);
router.use('/usuarioAdmin', UsuarioAdminRoutes);
router.use('/carrito', carritoRoutes);
router.use('/itemCarrito', itemCarrito);


export default router;