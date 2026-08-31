import { Carrito } from '../models/index.js';

// GET /carritos
// Obtiene los carritos pertenecientes al usuario autenticado.
export const obtener = async (req, res) => {
    try {
        const data = await Carrito.findAll({
            where: {
                idUsuario: req.usuario.id,
            },
        });

        res.json({
            estado: true,
            data,
        });
    } catch (error) {
        console.error('Error al obtener carritos:', error);

        res.status(500).json({
            estado: false,
            mensaje: 'Error al obtener carritos',
            error: error.message,
        });
    }
};


// GET /carritos/:id
// Obtiene un carrito únicamente si pertenece al usuario autenticado.
export const obtenerPorId = async (req, res) => {
    try {
        const id = parseInt(req.params.id, 10);

        const data = await Carrito.findOne({
            where: {
                id,
                idUsuario: req.usuario.id,
            },
        });

        if (!data) {
            return res.status(404).json({
                estado: false,
                mensaje: 'Carrito no encontrado',
            });
        }

        res.json({
            estado: true,
            data,
        });
    } catch (error) {
        console.error('Error al obtener carrito:', error);

        res.status(500).json({
            estado: false,
            mensaje: 'Error al obtener carrito',
            error: error.message,
        });
    }
};


// POST /carritos
// Crea un carrito para el usuario autenticado.
export const crear = async (req, res) => {
    try {
        const data = await Carrito.create({
            fechaCreacion: req.body.fechaCreacion,
            idUsuario: req.usuario.id,
        });

        res.status(201).json({
            estado: true,
            data,
        });
    } catch (error) {
        console.error('Error al crear carrito:', error);

        res.status(400).json({
            estado: false,
            mensaje: 'Error al crear carrito',
            error: error.message,
        });
    }
};


// PUT /carritos/:id
// Actualiza únicamente un carrito perteneciente al usuario autenticado.
export const actualizar = async (req, res) => {
    try {
        const id = parseInt(req.params.id, 10);

        const carrito = await Carrito.findOne({
            where: {
                id,
                idUsuario: req.usuario.id,
            },
        });

        if (!carrito) {
            return res.status(404).json({
                estado: false,
                mensaje: 'Carrito no encontrado',
            });
        }

        await carrito.update({
            fechaCreacion: req.body.fechaCreacion,
        });

        res.json({
            estado: true,
            data: carrito,
        });
    } catch (error) {
        console.error('Error al actualizar carrito:', error);

        res.status(400).json({
            estado: false,
            mensaje: 'Error al actualizar carrito',
            error: error.message,
        });
    }
};


// DELETE /carritos/:id
// Elimina únicamente un carrito perteneciente al usuario autenticado.
export const eliminar = async (req, res) => {
    try {
        const id = parseInt(req.params.id, 10);

        const carrito = await Carrito.findOne({
            where: {
                id,
                idUsuario: req.usuario.id,
            },
        });

        if (!carrito) {
            return res.status(404).json({
                estado: false,
                mensaje: 'Carrito no encontrado',
            });
        }

        await carrito.destroy();

        res.json({
            estado: true,
            mensaje: 'Carrito eliminado correctamente',
        });
    } catch (error) {
        console.error('Error al eliminar carrito:', error);

        res.status(500).json({
            estado: false,
            mensaje: 'Error al eliminar carrito',
            error: error.message,
        });
    }
};