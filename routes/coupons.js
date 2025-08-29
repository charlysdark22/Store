const express = require('express');
const Coupon = require('../models/Coupon');
const { auth, adminAuth } = require('../middleware/auth');

const router = express.Router();

// Validar cupón (público)
router.post('/validate', async (req, res) => {
  try {
    const { code, cart, userId } = req.body;

    if (!code || !cart) {
      return res.status(400).json({
        success: false,
        message: 'Código de cupón y carrito son requeridos',
        messageEs: 'Código de cupón y carrito son requeridos',
        messageEn: 'Coupon code and cart are required'
      });
    }

    const coupon = await Coupon.findOne({ 
      code: code.toUpperCase(),
      isActive: true 
    }).populate('applicableProducts excludedProducts');

    if (!coupon) {
      return res.status(404).json({
        success: false,
        message: 'Cupón no encontrado o inválido',
        messageEs: 'Cupón no encontrado o inválido',
        messageEn: 'Coupon not found or invalid'
      });
    }

    if (!coupon.isValid()) {
      return res.status(400).json({
        success: false,
        message: 'El cupón ha expirado o no está activo',
        messageEs: 'El cupón ha expirado o no está activo',
        messageEn: 'Coupon has expired or is not active'
      });
    }

    // Verificar si el usuario puede usar el cupón
    if (userId) {
      const canUse = await coupon.canUserUse(userId);
      if (!canUse) {
        return res.status(400).json({
          success: false,
          message: 'No puedes usar este cupón',
          messageEs: 'No puedes usar este cupón',
          messageEn: 'You cannot use this coupon'
        });
      }
    }

    const discount = coupon.calculateDiscount(cart);

    if (discount === 0) {
      return res.status(400).json({
        success: false,
        message: 'El cupón no es aplicable a tu carrito actual',
        messageEs: 'El cupón no es aplicable a tu carrito actual',
        messageEn: 'Coupon is not applicable to your current cart'
      });
    }

    res.json({
      success: true,
      data: {
        coupon: {
          code: coupon.code,
          name: coupon.name,
          description: coupon.description,
          type: coupon.type,
          value: coupon.value
        },
        discount,
        applicableAmount: cart.subtotal,
        finalAmount: Math.max(0, cart.subtotal - discount)
      }
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Error al validar el cupón'
    });
  }
});

// Aplicar cupón a pedido (autenticado)
router.post('/apply', auth, async (req, res) => {
  try {
    const { code, orderId } = req.body;

    const coupon = await Coupon.findOne({ 
      code: code.toUpperCase(),
      isActive: true 
    });

    if (!coupon || !coupon.isValid()) {
      return res.status(400).json({
        success: false,
        message: 'Cupón inválido o expirado'
      });
    }

    const canUse = await coupon.canUserUse(req.user.userId);
    if (!canUse) {
      return res.status(400).json({
        success: false,
        message: 'No puedes usar este cupón'
      });
    }

    // Aquí se aplicaría al pedido real
    // Por ahora solo devolvemos éxito
    res.json({
      success: true,
      message: 'Cupón aplicado exitosamente',
      data: { coupon: coupon.code }
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Error al aplicar el cupón'
    });
  }
});

// Obtener cupones del usuario
router.get('/my-coupons', auth, async (req, res) => {
  try {
    const now = new Date();
    
    // Cupones disponibles para el usuario
    const availableCoupons = await Coupon.find({
      isActive: true,
      validFrom: { $lte: now },
      validUntil: { $gte: now },
      $or: [
        { 'usageLimit.total': { $exists: false } },
        { $expr: { $lt: ['$usedCount', '$usageLimit.total'] } }
      ]
    }).select('code name description type value validUntil minimumAmount');

    // Filtrar cupones que el usuario puede usar
    const userCoupons = [];
    for (const coupon of availableCoupons) {
      const canUse = await coupon.canUserUse(req.user.userId);
      if (canUse) {
        userCoupons.push(coupon);
      }
    }

    res.json({
      success: true,
      data: userCoupons
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener cupones'
    });
  }
});

// ADMIN ROUTES
router.use(auth, adminAuth);

// Obtener todos los cupones (Admin)
router.get('/', async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 20, 
      search, 
      type, 
      isActive,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    const filters = {};

    if (search) {
      filters.$or = [
        { code: new RegExp(search, 'i') },
        { 'name.es': new RegExp(search, 'i') },
        { 'name.en': new RegExp(search, 'i') }
      ];
    }

    if (type) filters.type = type;
    if (isActive !== undefined) filters.isActive = isActive === 'true';

    const skip = (page - 1) * limit;
    const sort = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

    const coupons = await Coupon.find(filters)
      .populate('createdBy', 'firstName lastName')
      .sort(sort)
      .skip(skip)
      .limit(Number(limit));

    const total = await Coupon.countDocuments(filters);

    res.json({
      success: true,
      data: coupons,
      pagination: {
        current: Number(page),
        pages: Math.ceil(total / limit),
        total,
        limit: Number(limit)
      }
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener cupones'
    });
  }
});

// Crear cupón (Admin)
router.post('/', async (req, res) => {
  try {
    const couponData = {
      ...req.body,
      createdBy: req.user.userId,
      code: req.body.code.toUpperCase()
    };

    // Verificar que el código no exista
    const existingCoupon = await Coupon.findOne({ code: couponData.code });
    if (existingCoupon) {
      return res.status(400).json({
        success: false,
        message: 'Ya existe un cupón con este código'
      });
    }

    const coupon = new Coupon(couponData);
    await coupon.save();

    res.status(201).json({
      success: true,
      data: coupon,
      message: 'Cupón creado exitosamente'
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Error al crear el cupón',
      error: error.message
    });
  }
});

// Obtener cupón por ID (Admin)
router.get('/:id', async (req, res) => {
  try {
    const coupon = await Coupon.findById(req.params.id)
      .populate('createdBy', 'firstName lastName')
      .populate('applicableProducts', 'name images')
      .populate('excludedProducts', 'name images')
      .populate('usageHistory.user', 'firstName lastName email')
      .populate('usageHistory.order', 'orderNumber total');

    if (!coupon) {
      return res.status(404).json({
        success: false,
        message: 'Cupón no encontrado'
      });
    }

    res.json({
      success: true,
      data: coupon
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener el cupón'
    });
  }
});

// Actualizar cupón (Admin)
router.put('/:id', async (req, res) => {
  try {
    const coupon = await Coupon.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!coupon) {
      return res.status(404).json({
        success: false,
        message: 'Cupón no encontrado'
      });
    }

    res.json({
      success: true,
      data: coupon,
      message: 'Cupón actualizado exitosamente'
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Error al actualizar el cupón'
    });
  }
});

// Desactivar cupón (Admin)
router.delete('/:id', async (req, res) => {
  try {
    const coupon = await Coupon.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    );

    if (!coupon) {
      return res.status(404).json({
        success: false,
        message: 'Cupón no encontrado'
      });
    }

    res.json({
      success: true,
      message: 'Cupón desactivado exitosamente'
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Error al desactivar el cupón'
    });
  }
});

// Estadísticas de cupones (Admin)
router.get('/stats/overview', async (req, res) => {
  try {
    const now = new Date();
    
    const stats = await Coupon.aggregate([
      {
        $facet: {
          total: [{ $count: 'count' }],
          active: [
            { $match: { isActive: true, validUntil: { $gte: now } } },
            { $count: 'count' }
          ],
          expired: [
            { $match: { validUntil: { $lt: now } } },
            { $count: 'count' }
          ],
          mostUsed: [
            { $sort: { usedCount: -1 } },
            { $limit: 5 },
            { $project: { code: 1, name: 1, usedCount: 1, type: 1 } }
          ],
          typeDistribution: [
            { $group: { _id: '$type', count: { $sum: 1 } } }
          ],
          totalDiscountGiven: [
            { $unwind: '$usageHistory' },
            { $group: { _id: null, total: { $sum: '$usageHistory.discountAmount' } } }
          ]
        }
      }
    ]);

    const result = {
      totalCoupons: stats[0].total[0]?.count || 0,
      activeCoupons: stats[0].active[0]?.count || 0,
      expiredCoupons: stats[0].expired[0]?.count || 0,
      mostUsedCoupons: stats[0].mostUsed,
      typeDistribution: stats[0].typeDistribution,
      totalDiscountGiven: stats[0].totalDiscountGiven[0]?.total || 0
    };

    res.json({
      success: true,
      data: result
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener estadísticas'
    });
  }
});

// Generar cupones masivos (Admin)
router.post('/bulk-generate', async (req, res) => {
  try {
    const {
      count = 10,
      prefix = '',
      couponTemplate
    } = req.body;

    const coupons = [];
    
    for (let i = 0; i < count; i++) {
      const code = await Coupon.generateUniqueCode(prefix);
      const coupon = new Coupon({
        ...couponTemplate,
        code,
        createdBy: req.user.userId
      });
      coupons.push(coupon);
    }

    await Coupon.insertMany(coupons);

    res.json({
      success: true,
      data: coupons.map(c => ({ code: c.code, id: c._id })),
      message: `${count} cupones generados exitosamente`
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Error al generar cupones masivos'
    });
  }
});

module.exports = router;