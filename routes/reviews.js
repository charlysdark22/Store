const express = require('express');
const multer = require('multer');
const path = require('path');
const Review = require('../models/Review');
const Product = require('../models/Product');
const Order = require('../models/Order');
const { auth, adminAuth } = require('../middleware/auth');

const router = express.Router();

// Configurar multer para carga de imágenes y videos
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = file.mimetype.startsWith('video/') ? 
      'uploads/reviews/videos/' : 'uploads/reviews/images/';
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, `review-${uniqueSuffix}${path.extname(file.originalname)}`);
  }
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else if (file.mimetype.startsWith('video/')) {
    cb(null, true);
  } else {
    cb(new Error('Solo se permiten imágenes y videos'), false);
  }
};

const upload = multer({
  storage,
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB para videos
    files: 10 // máximo 10 archivos
  },
  fileFilter
});

// Obtener reseñas de un producto
router.get('/product/:productId', async (req, res) => {
  try {
    const { productId } = req.params;
    const {
      page = 1,
      limit = 10,
      sortBy = 'newest',
      filterBy = 'all',
      rating = 'all',
      verified = 'all',
      withMedia = 'all'
    } = req.query;

    // Construir filtros
    const filters = {
      product: productId,
      'moderation.status': 'approved',
      isActive: true
    };

    // Filtro por rating
    if (rating !== 'all') {
      filters['rating.overall'] = Number(rating);
    }

    // Filtro por verificación
    if (verified === 'true') {
      filters.verifiedPurchase = true;
    }

    // Filtro por media
    if (withMedia === 'true') {
      filters.$or = [
        { 'images.0': { $exists: true } },
        { 'videos.0': { $exists: true } }
      ];
    }

    // Configurar ordenamiento
    let sortOptions = {};
    switch (sortBy) {
      case 'newest':
        sortOptions = { createdAt: -1 };
        break;
      case 'oldest':
        sortOptions = { createdAt: 1 };
        break;
      case 'highest':
        sortOptions = { 'rating.overall': -1, createdAt: -1 };
        break;
      case 'lowest':
        sortOptions = { 'rating.overall': 1, createdAt: -1 };
        break;
      case 'helpful':
        sortOptions = { 'helpfulVotes.count': -1, createdAt: -1 };
        break;
      default:
        sortOptions = { createdAt: -1 };
    }

    const skip = (page - 1) * limit;

    const [reviews, total, stats] = await Promise.all([
      Review.find(filters)
        .populate('user', 'firstName lastName avatar')
        .populate('replies.user', 'firstName lastName avatar')
        .sort(sortOptions)
        .skip(skip)
        .limit(Number(limit)),
      Review.countDocuments(filters),
      Review.getProductStats(productId)
    ]);

    res.json({
      success: true,
      data: {
        reviews,
        stats,
        pagination: {
          current: Number(page),
          pages: Math.ceil(total / limit),
          total,
          limit: Number(limit)
        }
      }
    });

  } catch (error) {
    console.error('Get reviews error:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener reseñas'
    });
  }
});

// Obtener reseña específica
router.get('/:reviewId', async (req, res) => {
  try {
    const review = await Review.findById(req.params.reviewId)
      .populate('user', 'firstName lastName avatar')
      .populate('product', 'name images')
      .populate('replies.user', 'firstName lastName avatar');

    if (!review || !review.isActive) {
      return res.status(404).json({
        success: false,
        message: 'Reseña no encontrada'
      });
    }

    res.json({
      success: true,
      data: review
    });

  } catch (error) {
    console.error('Get review error:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener la reseña'
    });
  }
});

// Crear nueva reseña
router.post('/', auth, upload.array('media', 10), async (req, res) => {
  try {
    const {
      productId,
      orderId,
      rating,
      title,
      content,
      pros,
      cons,
      tags,
      usageDuration,
      recommendedFor
    } = req.body;

    // Verificar que el usuario compró el producto
    const order = await Order.findOne({
      _id: orderId,
      user: req.user.userId,
      'items.product': productId,
      status: 'delivered'
    });

    if (!order) {
      return res.status(400).json({
        success: false,
        message: 'Solo puedes reseñar productos que hayas comprado y recibido'
      });
    }

    // Verificar que no haya reseña previa
    const existingReview = await Review.findOne({
      user: req.user.userId,
      product: productId
    });

    if (existingReview) {
      return res.status(400).json({
        success: false,
        message: 'Ya has reseñado este producto'
      });
    }

    // Procesar archivos subidos
    const images = [];
    const videos = [];

    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        const fileData = {
          url: `/uploads/reviews/${file.mimetype.startsWith('video/') ? 'videos' : 'images'}/${file.filename}`,
          caption: '',
          uploadedAt: new Date()
        };

        if (file.mimetype.startsWith('video/')) {
          videos.push(fileData);
        } else {
          images.push(fileData);
        }
      }
    }

    // Crear reseña
    const reviewData = {
      user: req.user.userId,
      product: productId,
      order: orderId,
      rating: typeof rating === 'string' ? JSON.parse(rating) : rating,
      title,
      content,
      pros: pros ? (typeof pros === 'string' ? JSON.parse(pros) : pros) : [],
      cons: cons ? (typeof cons === 'string' ? JSON.parse(cons) : cons) : [],
      images,
      videos,
      tags: tags ? (typeof tags === 'string' ? JSON.parse(tags) : tags) : [],
      metadata: {
        userAgent: req.get('User-Agent'),
        purchaseDate: order.createdAt,
        usageDuration,
        recommendedFor: recommendedFor ? 
          (typeof recommendedFor === 'string' ? JSON.parse(recommendedFor) : recommendedFor) : []
      },
      moderation: {
        status: 'approved' // Auto-aprobar por ahora
      }
    };

    const review = new Review(reviewData);
    await review.save();

    // Actualizar estadísticas del producto
    await updateProductRating(productId);

    // Poblar datos para respuesta
    await review.populate('user', 'firstName lastName avatar');

    res.status(201).json({
      success: true,
      data: review,
      message: 'Reseña creada exitosamente'
    });

  } catch (error) {
    console.error('Create review error:', error);
    res.status(500).json({
      success: false,
      message: 'Error al crear la reseña',
      error: error.message
    });
  }
});

// Actualizar reseña
router.put('/:reviewId', auth, upload.array('media', 10), async (req, res) => {
  try {
    const review = await Review.findById(req.params.reviewId);

    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Reseña no encontrada'
      });
    }

    // Verificar que el usuario es el propietario
    if (review.user.toString() !== req.user.userId) {
      return res.status(403).json({
        success: false,
        message: 'No puedes editar esta reseña'
      });
    }

    // Actualizar campos permitidos
    const allowedUpdates = ['rating', 'title', 'content', 'pros', 'cons', 'tags'];
    allowedUpdates.forEach(field => {
      if (req.body[field] !== undefined) {
        if (field === 'pros' || field === 'cons' || field === 'tags') {
          review[field] = typeof req.body[field] === 'string' ? 
            JSON.parse(req.body[field]) : req.body[field];
        } else if (field === 'rating') {
          review[field] = typeof req.body[field] === 'string' ? 
            JSON.parse(req.body[field]) : req.body[field];
        } else {
          review[field] = req.body[field];
        }
      }
    });

    // Procesar nuevos archivos si los hay
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        const fileData = {
          url: `/uploads/reviews/${file.mimetype.startsWith('video/') ? 'videos' : 'images'}/${file.filename}`,
          caption: '',
          uploadedAt: new Date()
        };

        if (file.mimetype.startsWith('video/')) {
          review.videos.push(fileData);
        } else {
          review.images.push(fileData);
        }
      }
    }

    // Cambiar estado a pendiente si se modificó contenido importante
    if (req.body.content || req.body.rating) {
      review.moderation.status = 'pending';
    }

    await review.save();

    // Actualizar estadísticas del producto
    await updateProductRating(review.product);

    await review.populate('user', 'firstName lastName avatar');

    res.json({
      success: true,
      data: review,
      message: 'Reseña actualizada exitosamente'
    });

  } catch (error) {
    console.error('Update review error:', error);
    res.status(500).json({
      success: false,
      message: 'Error al actualizar la reseña'
    });
  }
});

// Votar utilidad de reseña
router.post('/:reviewId/vote', auth, async (req, res) => {
  try {
    const { helpful } = req.body;
    const review = await Review.findById(req.params.reviewId);

    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Reseña no encontrada'
      });
    }

    // No permitir votar en propia reseña
    if (review.user.toString() === req.user.userId) {
      return res.status(400).json({
        success: false,
        message: 'No puedes votar en tu propia reseña'
      });
    }

    await review.voteHelpful(req.user.userId, helpful);

    res.json({
      success: true,
      data: {
        helpfulCount: review.helpfulVotes.count,
        userVote: helpful
      },
      message: 'Voto registrado'
    });

  } catch (error) {
    console.error('Vote review error:', error);
    res.status(500).json({
      success: false,
      message: 'Error al votar'
    });
  }
});

// Responder a reseña
router.post('/:reviewId/reply', auth, async (req, res) => {
  try {
    const { content } = req.body;
    const review = await Review.findById(req.params.reviewId);

    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Reseña no encontrada'
      });
    }

    await review.addReply(req.user.userId, content, req.userProfile.role === 'admin');
    await review.populate('replies.user', 'firstName lastName avatar');

    res.json({
      success: true,
      data: review.replies[review.replies.length - 1],
      message: 'Respuesta agregada'
    });

  } catch (error) {
    console.error('Reply to review error:', error);
    res.status(500).json({
      success: false,
      message: 'Error al responder'
    });
  }
});

// Reportar reseña
router.post('/:reviewId/flag', auth, async (req, res) => {
  try {
    const { reason, description } = req.body;
    const review = await Review.findById(req.params.reviewId);

    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Reseña no encontrada'
      });
    }

    await review.flag(req.user.userId, reason, description);

    res.json({
      success: true,
      message: 'Reseña reportada. Será revisada por nuestro equipo.'
    });

  } catch (error) {
    console.error('Flag review error:', error);
    if (error.message === 'Ya has reportado esta reseña') {
      return res.status(400).json({
        success: false,
        message: error.message
      });
    }
    res.status(500).json({
      success: false,
      message: 'Error al reportar'
    });
  }
});

// Eliminar reseña (solo propietario)
router.delete('/:reviewId', auth, async (req, res) => {
  try {
    const review = await Review.findById(req.params.reviewId);

    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Reseña no encontrada'
      });
    }

    // Solo el propietario o admin puede eliminar
    if (review.user.toString() !== req.user.userId && req.userProfile.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'No tienes permisos para eliminar esta reseña'
      });
    }

    review.isActive = false;
    await review.save();

    // Actualizar estadísticas del producto
    await updateProductRating(review.product);

    res.json({
      success: true,
      message: 'Reseña eliminada exitosamente'
    });

  } catch (error) {
    console.error('Delete review error:', error);
    res.status(500).json({
      success: false,
      message: 'Error al eliminar la reseña'
    });
  }
});

// Obtener reseñas del usuario
router.get('/user/my-reviews', auth, async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;

    const [reviews, total] = await Promise.all([
      Review.find({ 
        user: req.user.userId,
        isActive: true 
      })
      .populate('product', 'name images')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit)),
      Review.countDocuments({ 
        user: req.user.userId,
        isActive: true 
      })
    ]);

    res.json({
      success: true,
      data: {
        reviews,
        pagination: {
          current: Number(page),
          pages: Math.ceil(total / limit),
          total,
          limit: Number(limit)
        }
      }
    });

  } catch (error) {
    console.error('Get user reviews error:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener tus reseñas'
    });
  }
});

// RUTAS ADMIN

// Obtener reseñas para moderación
router.get('/admin/moderation', auth, adminAuth, async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 20, 
      status = 'pending' 
    } = req.query;

    const skip = (page - 1) * limit;

    const [reviews, total] = await Promise.all([
      Review.find({ 'moderation.status': status })
        .populate('user', 'firstName lastName email')
        .populate('product', 'name images')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit)),
      Review.countDocuments({ 'moderation.status': status })
    ]);

    res.json({
      success: true,
      data: {
        reviews,
        pagination: {
          current: Number(page),
          pages: Math.ceil(total / limit),
          total,
          limit: Number(limit)
        }
      }
    });

  } catch (error) {
    console.error('Get moderation reviews error:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener reseñas para moderación'
    });
  }
});

// Moderar reseña
router.put('/admin/:reviewId/moderate', auth, adminAuth, async (req, res) => {
  try {
    const { status, reason } = req.body;
    
    const review = await Review.findByIdAndUpdate(
      req.params.reviewId,
      {
        'moderation.status': status,
        'moderation.moderatedBy': req.user.userId,
        'moderation.moderatedAt': new Date(),
        'moderation.reason': reason
      },
      { new: true }
    );

    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Reseña no encontrada'
      });
    }

    // Si se aprueba, actualizar estadísticas del producto
    if (status === 'approved') {
      await updateProductRating(review.product);
    }

    res.json({
      success: true,
      data: review,
      message: `Reseña ${status === 'approved' ? 'aprobada' : 'rechazada'} exitosamente`
    });

  } catch (error) {
    console.error('Moderate review error:', error);
    res.status(500).json({
      success: false,
      message: 'Error al moderar la reseña'
    });
  }
});

// Función auxiliar para actualizar rating del producto
async function updateProductRating(productId) {
  try {
    const stats = await Review.getProductStats(productId);
    
    await Product.findByIdAndUpdate(productId, {
      averageRating: stats.averageRating,
      totalReviews: stats.totalReviews
    });
  } catch (error) {
    console.error('Error updating product rating:', error);
  }
}

module.exports = router;