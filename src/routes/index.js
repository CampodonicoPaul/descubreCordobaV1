import { Router } from 'express';
import usuariosRoutes from './usuario.routes.js';
import categoriasRoutes from './categorias.routes.js';
import excursionesRoutes from './excursiones.routes.js';
import UsuarioAdminRoutes from './usuarioAdmin.routes.js';
import comprasRoutes from './compras.routes.js'
import detallesCompra from './detalleCompra.routes.js'

const router = Router();

// Registro de cada módulo con su prefijo
router.use('/usuarios', usuariosRoutes);
router.use('/categorias', categoriasRoutes);
router.use('/excursiones', excursionesRoutes);
router.use('/usuarioAdminRoutes', UsuarioAdminRoutes);
router.use('/compras', comprasRoutes);
router.use('/detallescompra', detallesCompra);


export default router;