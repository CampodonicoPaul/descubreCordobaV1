import {
    Compra,
    DetalleCompra,
    Carrito,
    ItemCarrito,
    Excursion,
} from '../models/index.js';

import sequelize from '../config/database.js';

// GET /compras
export const obtener = async (req, res) => {
    try {
        const data = await Compra.findAll({
            where: {
                idUsuario: req.usuario.id,
            },
        });

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

        const data = await Compra.findOne({
            where: {
                id,
                idUsuario: req.usuario.id,
            },
        });

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
    const transaction = await sequelize.transaction();

    try {
        // 1. Buscamos el carrito ACTIVO del usuario autenticado.
        const carrito = await Carrito.findOne({
            where: {
                idUsuario: req.usuario.id,
                estado: 'ACTIVO',
            },
            transaction,
        });

        if (!carrito) {
            await transaction.rollback();

            return res.status(404).json({
                estado: false,
                mensaje: 'No tenés un carrito activo',
            });
        }

        // 2. Buscamos los items del carrito.
        const items = await ItemCarrito.findAll({
            where: {
                idCarrito: carrito.id,
            },
            transaction,
        });

        if (items.length === 0) {
            await transaction.rollback();

            return res.status(400).json({
                estado: false,
                mensaje: 'El carrito está vacío',
            });
        }

        // 3. Obtenemos las excursiones y calculamos
        //    los precios desde la base de datos.
        let total = 0;
        const detalles = [];

        for (const item of items) {
            const excursion = await Excursion.findByPk(
                item.idExcursion,
                { transaction }
            );

            if (!excursion) {
                throw new Error(
                    `La excursión ${item.idExcursion} no existe`
                );
            }

            const precioUnitario = Number(excursion.precio);
            const cantidad = Number(item.cantidad);

            total += precioUnitario * cantidad;

            detalles.push({
                idExcursion: excursion.id,
                cantidad,
                precioUnitario,
            });
        }

        // 4. Creamos la compra.
        const compra = await Compra.create(
            {
                idUsuario: req.usuario.id,
                total,
                estado: 'PENDIENTE',
                fechaCompra: new Date(),
            },
            { transaction }
        );

        // 5. Asociamos cada detalle a la compra.
        for (const detalle of detalles) {
            await DetalleCompra.create(
                {
                    idCompra: compra.id,
                    idExcursion: detalle.idExcursion,
                    cantidad: detalle.cantidad,
                    precioUnitario: detalle.precioUnitario,
                },
                { transaction }
            );
        }

        // 6. Marcamos el carrito como comprado.
        await carrito.update(
            {
                estado: 'COMPRADO',
            },
            { transaction }
        );

        // 7. Confirmamos toda la operación.
        await transaction.commit();

        res.status(201).json({
            estado: true,
            mensaje: 'Compra creada correctamente',
            data: compra,
        });

    } catch (error) {
        await transaction.rollback();

        console.error('Error al crear compra:', error);

        res.status(400).json({
            estado: false,
            mensaje: 'No se pudo crear la compra',
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