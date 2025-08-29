const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  order: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order',
    required: true
  },
  rating: {
    overall: {
      type: Number,
      required: true,
      min: 1,
      max: 5
    },
    aspects: {
      quality: {
        type: Number,
        min: 1,
        max: 5
      },
      value: {
        type: Number,
        min: 1,
        max: 5
      },
      design: {
        type: Number,
        min: 1,
        max: 5
      },
      performance: {
        type: Number,
        min: 1,
        max: 5
      },
      batteryLife: {
        type: Number,
        min: 1,
        max: 5
      },
      easeOfUse: {
        type: Number,
        min: 1,
        max: 5
      }
    }
  },
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  content: {
    type: String,
    required: true,
    trim: true,
    maxlength: 2000
  },
  pros: [{
    type: String,
    trim: true,
    maxlength: 200
  }],
  cons: [{
    type: String,
    trim: true,
    maxlength: 200
  }],
  images: [{
    url: {
      type: String,
      required: true
    },
    caption: {
      type: String,
      trim: true,
      maxlength: 200
    },
    isMain: {
      type: Boolean,
      default: false
    },
    uploadedAt: {
      type: Date,
      default: Date.now
    }
  }],
  videos: [{
    url: {
      type: String,
      required: true
    },
    thumbnail: String,
    duration: Number, // en segundos
    caption: {
      type: String,
      trim: true,
      maxlength: 200
    },
    uploadedAt: {
      type: Date,
      default: Date.now
    }
  }],
  verified: {
    type: Boolean,
    default: false
  },
  verifiedPurchase: {
    type: Boolean,
    default: false
  },
  helpfulVotes: {
    count: {
      type: Number,
      default: 0
    },
    users: [{
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      },
      helpful: {
        type: Boolean,
        required: true
      },
      votedAt: {
        type: Date,
        default: Date.now
      }
    }]
  },
  replies: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    content: {
      type: String,
      required: true,
      trim: true,
      maxlength: 1000
    },
    isVendorReply: {
      type: Boolean,
      default: false
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  tags: [{
    type: String,
    trim: true,
    lowercase: true
  }],
  sentiment: {
    score: {
      type: Number,
      min: -1,
      max: 1
    },
    magnitude: {
      type: Number,
      min: 0
    },
    analyzedAt: Date
  },
  moderation: {
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected', 'flagged'],
      default: 'pending'
    },
    moderatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    moderatedAt: Date,
    reason: String,
    autoModerated: {
      type: Boolean,
      default: false
    }
  },
  flags: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    reason: {
      type: String,
      enum: ['spam', 'inappropriate', 'fake', 'offensive', 'other'],
      required: true
    },
    description: String,
    flaggedAt: {
      type: Date,
      default: Date.now
    }
  }],
  metadata: {
    userAgent: String,
    ipAddress: String,
    deviceInfo: {
      type: String,
      maxlength: 500
    },
    purchaseDate: Date,
    usageDuration: String, // "1 month", "6 months", etc.
    recommendedFor: [{
      type: String,
      enum: ['gaming', 'work', 'students', 'professionals', 'beginners', 'advanced']
    }]
  },
  featured: {
    type: Boolean,
    default: false
  },
  language: {
    type: String,
    enum: ['es', 'en', 'fr'],
    default: 'es'
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Índices para optimización
reviewSchema.index({ product: 1, createdAt: -1 });
reviewSchema.index({ user: 1, createdAt: -1 });
reviewSchema.index({ 'rating.overall': -1 });
reviewSchema.index({ verified: 1 });
reviewSchema.index({ 'moderation.status': 1 });
reviewSchema.index({ featured: 1 });
reviewSchema.index({ 'helpfulVotes.count': -1 });

// Índice compuesto para búsquedas eficientes
reviewSchema.index({ 
  product: 1, 
  'moderation.status': 1, 
  isActive: 1, 
  createdAt: -1 
});

// Validación: un usuario solo puede hacer una reseña por producto
reviewSchema.index({ user: 1, product: 1 }, { unique: true });

// Middleware para validar que el usuario compró el producto
reviewSchema.pre('save', async function(next) {
  if (this.isNew) {
    const Order = mongoose.model('Order');
    
    // Verificar que el usuario compró el producto
    const order = await Order.findOne({
      _id: this.order,
      user: this.user,
      'items.product': this.product,
      status: 'delivered'
    });

    if (!order) {
      const error = new Error('Solo puedes reseñar productos que hayas comprado');
      error.name = 'ValidationError';
      return next(error);
    }

    this.verifiedPurchase = true;
    this.metadata.purchaseDate = order.createdAt;
  }
  
  next();
});

// Método para calcular rating promedio de aspectos
reviewSchema.methods.calculateAverageAspectRating = function() {
  const aspects = this.rating.aspects;
  const validRatings = Object.values(aspects).filter(rating => rating && rating > 0);
  
  if (validRatings.length === 0) return 0;
  
  const sum = validRatings.reduce((acc, rating) => acc + rating, 0);
  return Math.round((sum / validRatings.length) * 10) / 10;
};

// Método para marcar como útil/no útil
reviewSchema.methods.voteHelpful = function(userId, helpful) {
  // Remover voto anterior si existe
  this.helpfulVotes.users = this.helpfulVotes.users.filter(
    vote => vote.user.toString() !== userId.toString()
  );
  
  // Agregar nuevo voto
  this.helpfulVotes.users.push({
    user: userId,
    helpful,
    votedAt: new Date()
  });
  
  // Recalcular contador
  this.helpfulVotes.count = this.helpfulVotes.users.filter(vote => vote.helpful).length;
  
  return this.save();
};

// Método para agregar respuesta
reviewSchema.methods.addReply = function(userId, content, isVendorReply = false) {
  this.replies.push({
    user: userId,
    content,
    isVendorReply,
    createdAt: new Date()
  });
  
  return this.save();
};

// Método para reportar reseña
reviewSchema.methods.flag = function(userId, reason, description = '') {
  // Verificar que el usuario no haya reportado ya
  const existingFlag = this.flags.find(flag => 
    flag.user.toString() === userId.toString()
  );
  
  if (existingFlag) {
    throw new Error('Ya has reportado esta reseña');
  }
  
  this.flags.push({
    user: userId,
    reason,
    description,
    flaggedAt: new Date()
  });
  
  // Si hay muchos reportes, marcar para moderación
  if (this.flags.length >= 3) {
    this.moderation.status = 'flagged';
  }
  
  return this.save();
};

// Método estático para obtener estadísticas de reseñas de un producto
reviewSchema.statics.getProductStats = async function(productId) {
  const stats = await this.aggregate([
    {
      $match: {
        product: new mongoose.Types.ObjectId(productId),
        'moderation.status': 'approved',
        isActive: true
      }
    },
    {
      $group: {
        _id: null,
        totalReviews: { $sum: 1 },
        averageRating: { $avg: '$rating.overall' },
        ratingDistribution: {
          $push: '$rating.overall'
        },
        verifiedCount: {
          $sum: { $cond: ['$verifiedPurchase', 1, 0] }
        },
        withPhotos: {
          $sum: { $cond: [{ $gt: [{ $size: '$images' }, 0] }, 1, 0] }
        },
        withVideos: {
          $sum: { $cond: [{ $gt: [{ $size: '$videos' }, 0] }, 1, 0] }
        }
      }
    }
  ]);

  if (stats.length === 0) {
    return {
      totalReviews: 0,
      averageRating: 0,
      ratingDistribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
      verifiedCount: 0,
      withPhotos: 0,
      withVideos: 0
    };
  }

  const result = stats[0];
  
  // Calcular distribución de ratings
  const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
  result.ratingDistribution.forEach(rating => {
    distribution[rating] = (distribution[rating] || 0) + 1;
  });

  return {
    totalReviews: result.totalReviews,
    averageRating: Math.round(result.averageRating * 10) / 10,
    ratingDistribution: distribution,
    verifiedCount: result.verifiedCount,
    withPhotos: result.withPhotos,
    withVideos: result.withVideos,
    verifiedPercentage: Math.round((result.verifiedCount / result.totalReviews) * 100)
  };
};

// Método estático para obtener reseñas destacadas
reviewSchema.statics.getFeaturedReviews = async function(productId, limit = 3) {
  return await this.find({
    product: productId,
    'moderation.status': 'approved',
    isActive: true,
    $or: [
      { featured: true },
      { 'helpfulVotes.count': { $gte: 5 } },
      { 'images.0': { $exists: true } }
    ]
  })
  .populate('user', 'firstName lastName avatar')
  .sort({ 
    featured: -1, 
    'helpfulVotes.count': -1, 
    createdAt: -1 
  })
  .limit(limit);
};

// Método estático para análisis de sentimientos (básico)
reviewSchema.statics.analyzeSentiment = function(content) {
  // Palabras positivas y negativas básicas en español
  const positiveWords = [
    'excelente', 'bueno', 'genial', 'perfecto', 'increíble', 
    'fantástico', 'maravilloso', 'recomiendo', 'calidad', 'rápido'
  ];
  
  const negativeWords = [
    'malo', 'terrible', 'horrible', 'defectuoso', 'lento',
    'caro', 'problema', 'error', 'falla', 'decepcionante'
  ];
  
  const words = content.toLowerCase().split(/\W+/);
  let positiveCount = 0;
  let negativeCount = 0;
  
  words.forEach(word => {
    if (positiveWords.includes(word)) positiveCount++;
    if (negativeWords.includes(word)) negativeCount++;
  });
  
  const totalSentimentWords = positiveCount + negativeCount;
  if (totalSentimentWords === 0) {
    return { score: 0, magnitude: 0 };
  }
  
  const score = (positiveCount - negativeCount) / totalSentimentWords;
  const magnitude = totalSentimentWords / words.length;
  
  return {
    score: Math.max(-1, Math.min(1, score)),
    magnitude: Math.max(0, Math.min(1, magnitude))
  };
};

// Middleware para análisis de sentimientos automático
reviewSchema.pre('save', function(next) {
  if (this.isModified('content') || this.isNew) {
    const sentiment = this.constructor.analyzeSentiment(this.content);
    this.sentiment = {
      ...sentiment,
      analyzedAt: new Date()
    };
  }
  next();
});

module.exports = mongoose.model('Review', reviewSchema);