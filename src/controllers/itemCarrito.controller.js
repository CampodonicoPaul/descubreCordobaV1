import {ItemCarrito} from '../models/index.js';

// GET /itemsCarrito
export const obtener = async (req, res) => {
    try {
        const data = await ItemCarrito.findAll();
        res.json({
            estado: true,
            data,
        });
    } catch (error) {
        console.error('Error al obtener itemsCarrito:', error);
        res.status(500).json({
            estado: false,
            mensaje: 'Error al obtener itemsCarrito',
            error: error.message,
        });
    }
};

// GET /itemsCarrito/:id
export const obtenerPorId = async (req, res) => {
    try {
        const id = parseInt(req.params.id, 10);
        const data = await ItemCarrito.findByPk(id);

        if (!data) {
            return res.status(404).json({
                estado: false,
                mensaje: 'itemCarrito no encontrado',
            });
        }

        res.json({
            estado: true,
            data,
        });
    } catch (error) {
        console.error('Error al obtener itemCarrito:', error);
        res.status(500).json({
            estado: false,
            mensaje: 'Error al obtener itemCarrito',
            error: error.message,
        });
    }
};

// POST /itemsCarrito
export const crear = async (req, res) => {
    try {
        const data = await ItemCarrito.create(req.body);
        res.status(201).json({
            estado: true,
            data,
        });
    } catch (error) {
        console.error('Error al crear itemCarrito:', error);
        res.status(400).json({
            estado: false,
            mensaje: 'Error al crear itemCarrito',
            error: error.message,
        });
    }
};

// PUT /itemsCarrito/:id
export const actualizar = async (req, res) => {
    try {
        const id = parseInt(req.params.id, 10);
        const itemCarrito = await ItemCarrito.findByPk(id);

        if (!itemCarrito) {
            return res.status(404).json({
                estado: false,
                mensaje: 'itemCarrito no encontrado',
            });
        }

        await itemCarrito.update(req.body);
        res.json({
            estado: true,
            data: itemCarrito,
        });
    } catch (error) {
        console.error('Error al actualizar itemCarrito:', error);
        res.status(400).json({
            estado: false,
            mensaje: 'Error al actualizar itemCarrito',
            error: error.message,
        });
    }
};

// DELETE /itemsCarrito/:id
export const eliminar = async (req, res) => {
    try {
        const id = parseInt(req.params.id, 10);
        const itemCarrito = await ItemCarrito.findByPk(id);

        if (!itemCarrito) {
            return res.status(404).json({
                estado: false,
                mensaje: 'ItemCarrito no encontrado',
            });
        }

        await itemCarrito.destroy();
        res.json({
            estado: true,
            mensaje: 'ItemCarrito eliminado correctamente',
        });
    } catch (error) {
        console.error('Error al eliminar itemCarrito:', error);
        res.status(500).json({
            estado: false,
            mensaje: 'Error al eliminar itemCarrito',
            error: error.message,
        });
    }
};