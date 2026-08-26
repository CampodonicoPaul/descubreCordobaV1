import { Router } from 'express';

import {
    loginCliente,
    registrarUsuario,
    refreshTokenCliente,
    obtenerPerfilCliente,
    actualizarPerfilCliente,
    loginAdmin,
} from '../controllers/auth.controller.js';

import {
    verificarUsuario,
} from '../middleware/auth.js';

const router = Router();


// ============================
// USUARIO
// ============================

// Registro
router.post(
    '/usuario/registro',
    registrarUsuario
);

// Login
router.post(
    '/usuario/login',
    loginCliente
);

// Renovar token
router.get(
    '/usuario/refresh',
    verificarUsuario,
    refreshTokenCliente
);

// Obtener perfil
router.get(
    '/usuario/perfil',
    verificarUsuario,
    obtenerPerfilCliente
);

// Actualizar perfil
router.put(
    '/usuario/perfil',
    verificarUsuario,
    actualizarPerfilCliente
);


// ============================
// ADMIN
// ============================

// Login admin
router.post(
    '/admin/login',
    loginAdmin
);


export default router;