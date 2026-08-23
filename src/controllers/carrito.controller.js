import { Carrito } from '../models/index.js';

// GET /carritos
export const obtener = async (req, res) => {
    try {
        const data = await Carrito.findAll();
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
export const obtenerPorId = async (req, res) => {
    try {
        const id = parseInt(req.params.id, 10);
        const data = await Carrito.findByPk(id);

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
export const crear = async (req, res) => {
    try {
        const data = await Carrito.create(req.body);
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
export const actualizar = async (req, res) => {
    try {
        const id = parseInt(req.params.id, 10);
        const carrito = await Carrito.findByPk(id);

        if (!carrito) {
            return res.status(404).json({
                estado: false,
                mensaje: 'Carrito no encontrado',
            });
        }

        await carrito.update(req.body);
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

// DELETE /categorias/:id
export const eliminar = async (req, res) => {
    try {
        const id = parseInt(req.params.id, 10);
        const carrito = await Carrito.findByPk(id);

        if (!carrito) {
            return res.status(404).json({
                estado: false,
                mensaje: 'Carrito no encontrada',
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