import Compra from '../models/compra.model.js';

// GET /compras
export const obtener = async (req, res) => {
    try {
        const data = await Compra.findAll();
        res.json({
            estado: true,
            data,
        });
    } catch (error) {
        console.error('Error al obtener compras:', error);
        res.status(500).json({
            estado: false,
            mensaje: 'Error al obtener compras',
            error: error.message,
        });
    }
};

// GET /compras/:id
export const obtenerPorId = async (req, res) => {
    try {
        const id = parseInt(req.params.id, 10);
        const data = await Compra.findByPk(id);

        if (!data) {
            return res.status(404).json({
                estado: false,
                mensaje: 'Compra no encontrada',
            });
        }

        res.json({
            estado: true,
            data,
        });
    } catch (error) {
        console.error('Error al obtener compra:', error);
        res.status(500).json({
            estado: false,
            mensaje: 'Error al obtener compra',
            error: error.message,
        });
    }
};

// POST /compras
export const crear = async (req, res) => {
    try {
        const data = await Compra.create(req.body);
        res.status(201).json({
            estado: true,
            data,
        });
    } catch (error) {
        console.error('Error al crear compra:', error);
        res.status(400).json({
            estado: false,
            mensaje: 'Error al crear compra',
            error: error.message,
        });
    }
};

// PUT /compra/:id
export const actualizar = async (req, res) => {
    try {
        const id = parseInt(req.params.id, 10);
        const compra = await Compra.findByPk(id);

        if (!compra) {
            return res.status(404).json({
                estado: false,
                mensaje: 'Compra no encontrada',
            });
        }

        await compra.update(req.body);
        res.json({
            estado: true,
            data: compra,
        });
    } catch (error) {
        console.error('Error al actualizar compra:', error);
        res.status(400).json({
            estado: false,
            mensaje: 'Error al actualizar compra',
            error: error.message,
        });
    }
};

// DELETE /compras/:id
export const eliminar = async (req, res) => {
    try {
        const id = parseInt(req.params.id, 10);
        const compra = await Compra.findByPk(id);

        if (!compra) {
            return res.status(404).json({
                estado: false,
                mensaje: 'Compra no encontrada',
            });
        }

        await compra.destroy();
        res.json({
            estado: true,
            mensaje: 'Compra eliminada correctamente',
        });
    } catch (error) {
        console.error('Error al eliminar la compra:', error);
        res.status(500).json({
            estado: false,
            mensaje: 'Error al eliminar compra',
            error: error.message,
        });
    }
};