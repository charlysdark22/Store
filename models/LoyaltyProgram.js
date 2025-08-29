const mongoose = require('mongoose');

// Schema para transacciones de puntos
const pointTransactionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    enum: ['earned', 'redeemed', 'expired', 'bonus', 'penalty', 'referral'],
    required: true
  },
  points: {
    type: Number,
    required: true
  },
  description: {
    es: String,
    en: String,
    fr: String
  },
  relatedOrder: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order'
  },
  relatedProduct: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product'
  },
  expiresAt: Date,
  metadata: {
    multiplier: Number,
    baseAmount: Number,
    bonusReason: String
  }
}, {
  timestamps: true
});

// Schema principal del programa de fidelidad
const loyaltyProgramSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  totalPoints: {
    type: Number,
    default: 0,
    min: 0
  },
  availablePoints: {
    type: Number,
    default: 0,
    min: 0
  },
  lifetimePoints: {
    type: Number,
    default: 0,
    min: 0
  },
  tier: {
    type: String,
    enum: ['bronze', 'silver', 'gold', 'platinum'],
    default: 'bronze'
  },
  tierProgress: {
    currentTierPoints: {
      type: Number,
      default: 0
    },
    nextTierRequirement: {
      type: Number,
      default: 1000
    },
    progressPercentage: {
      type: Number,
      default: 0
    }
  },
  multiplier: {
    type: Number,
    default: 1,
    min: 1,
    max: 5
  },
  streaks: {
    currentPurchaseStreak: {
      type: Number,
      default: 0
    },
    longestPurchaseStreak: {
      type: Number,
      default: 0
    },
    lastPurchaseDate: Date
  },
  achievements: [{
    name: String,
    description: {
      es: String,
      en: String,
      fr: String
    },
    icon: String,
    pointsAwarded: Number,
    unlockedAt: {
      type: Date,
      default: Date.now
    },
    category: {
      type: String,
      enum: ['purchase', 'review', 'referral', 'social', 'milestone']
    }
  }],
  referrals: {
    totalReferrals: {
      type: Number,
      default: 0
    },
    successfulReferrals: {
      type: Number,
      default: 0
    },
    referralCode: {
      type: String,
      unique: true,
      sparse: true
    },
    referredBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  },
  specialOffers: [{
    title: {
      es: String,
      en: String,
      fr: String
    },
    description: {
      es: String,
      en: String,
      fr: String
    },
    pointsCost: Number,
    discountPercentage: Number,
    validUntil: Date,
    used: {
      type: Boolean,
      default: false
    },
    usedAt: Date
  }],
  preferences: {
    emailNotifications: {
      type: Boolean,
      default: true
    },
    smsNotifications: {
      type: Boolean,
      default: false
    },
    birthdayOffers: {
      type: Boolean,
      default: true
    }
  },
  statistics: {
    totalOrders: {
      type: Number,
      default: 0
    },
    totalSpent: {
      type: Number,
      default: 0
    },
    averageOrderValue: {
      type: Number,
      default: 0
    },
    favoriteCategory: String,
    lastActivityDate: {
      type: Date,
      default: Date.now
    }
  }
}, {
  timestamps: true
});

// Índices para optimización
loyaltyProgramSchema.index({ user: 1 });
loyaltyProgramSchema.index({ tier: 1 });
loyaltyProgramSchema.index({ 'referrals.referralCode': 1 });

pointTransactionSchema.index({ user: 1, createdAt: -1 });
pointTransactionSchema.index({ type: 1 });
pointTransactionSchema.index({ expiresAt: 1 });

// Configuración de tiers
const TIER_REQUIREMENTS = {
  bronze: { min: 0, max: 999, multiplier: 1 },
  silver: { min: 1000, max: 4999, multiplier: 1.2 },
  gold: { min: 5000, max: 14999, multiplier: 1.5 },
  platinum: { min: 15000, max: Infinity, multiplier: 2 }
};

const POINTS_CONFIG = {
  earnRate: 1, // 1 punto por cada CUP gastado
  reviewPoints: 50,
  referralPoints: 200,
  birthdayBonus: 100,
  socialSharePoints: 25,
  firstPurchaseBonus: 100,
  streakBonus: 50, // Por cada 5 compras consecutivas
  expirationMonths: 12
};

// Middleware para calcular tier y progreso
loyaltyProgramSchema.pre('save', function(next) {
  this.updateTierAndProgress();
  next();
});

// Método para actualizar tier y progreso
loyaltyProgramSchema.methods.updateTierAndProgress = function() {
  const currentPoints = this.lifetimePoints;
  let newTier = 'bronze';
  
  for (const [tier, config] of Object.entries(TIER_REQUIREMENTS)) {
    if (currentPoints >= config.min && currentPoints <= config.max) {
      newTier = tier;
      this.multiplier = config.multiplier;
      break;
    }
  }
  
  this.tier = newTier;
  
  // Calcular progreso hacia el siguiente tier
  const currentTierConfig = TIER_REQUIREMENTS[newTier];
  const nextTierEntries = Object.entries(TIER_REQUIREMENTS)
    .find(([tier, config]) => config.min > currentTierConfig.max);
  
  if (nextTierEntries) {
    const [nextTier, nextTierConfig] = nextTierEntries;
    this.tierProgress.currentTierPoints = currentPoints - currentTierConfig.min;
    this.tierProgress.nextTierRequirement = nextTierConfig.min - currentPoints;
    this.tierProgress.progressPercentage = Math.min(100, 
      (this.tierProgress.currentTierPoints / (nextTierConfig.min - currentTierConfig.min)) * 100
    );
  } else {
    // Usuario en tier máximo
    this.tierProgress.nextTierRequirement = 0;
    this.tierProgress.progressPercentage = 100;
  }
};

// Método para agregar puntos
loyaltyProgramSchema.methods.addPoints = async function(points, type, description, metadata = {}) {
  const PointTransaction = mongoose.model('PointTransaction');
  
  const transaction = new PointTransaction({
    user: this.user,
    type,
    points,
    description,
    metadata,
    expiresAt: type === 'earned' ? 
      new Date(Date.now() + POINTS_CONFIG.expirationMonths * 30 * 24 * 60 * 60 * 1000) : 
      undefined
  });
  
  await transaction.save();
  
  this.totalPoints += points;
  this.availablePoints += points;
  if (type === 'earned' || type === 'bonus') {
    this.lifetimePoints += points;
  }
  
  this.statistics.lastActivityDate = new Date();
  
  return await this.save();
};

// Método para redimir puntos
loyaltyProgramSchema.methods.redeemPoints = async function(points, description) {
  if (this.availablePoints < points) {
    throw new Error('Puntos insuficientes');
  }
  
  const PointTransaction = mongoose.model('PointTransaction');
  
  const transaction = new PointTransaction({
    user: this.user,
    type: 'redeemed',
    points: -points,
    description
  });
  
  await transaction.save();
  
  this.availablePoints -= points;
  this.statistics.lastActivityDate = new Date();
  
  return await this.save();
};

// Método para procesar compra
loyaltyProgramSchema.methods.processOrderPoints = async function(order) {
  const basePoints = Math.floor(order.total * POINTS_CONFIG.earnRate);
  const bonusPoints = Math.floor(basePoints * (this.multiplier - 1));
  const totalPoints = basePoints + bonusPoints;
  
  await this.addPoints(totalPoints, 'earned', {
    es: `Puntos ganados por compra #${order.orderNumber}`,
    en: `Points earned from purchase #${order.orderNumber}`,
    fr: `Points gagnés pour l'achat #${order.orderNumber}`
  }, {
    multiplier: this.multiplier,
    baseAmount: order.total,
    relatedOrder: order._id
  });
  
  // Actualizar estadísticas
  this.statistics.totalOrders += 1;
  this.statistics.totalSpent += order.total;
  this.statistics.averageOrderValue = this.statistics.totalSpent / this.statistics.totalOrders;
  
  // Verificar racha de compras
  const daysSinceLastPurchase = this.streaks.lastPurchaseDate ? 
    Math.floor((new Date() - this.streaks.lastPurchaseDate) / (1000 * 60 * 60 * 24)) : 
    Infinity;
  
  if (daysSinceLastPurchase <= 30) {
    this.streaks.currentPurchaseStreak += 1;
    if (this.streaks.currentPurchaseStreak > this.streaks.longestPurchaseStreak) {
      this.streaks.longestPurchaseStreak = this.streaks.currentPurchaseStreak;
    }
    
    // Bonus por racha
    if (this.streaks.currentPurchaseStreak % 5 === 0) {
      await this.addPoints(POINTS_CONFIG.streakBonus, 'bonus', {
        es: `Bonus por ${this.streaks.currentPurchaseStreak} compras consecutivas`,
        en: `Streak bonus for ${this.streaks.currentPurchaseStreak} consecutive purchases`,
        fr: `Bonus de série pour ${this.streaks.currentPurchaseStreak} achats consécutifs`
      });
    }
  } else {
    this.streaks.currentPurchaseStreak = 1;
  }
  
  this.streaks.lastPurchaseDate = new Date();
  
  // Verificar logros
  await this.checkAchievements();
  
  return await this.save();
};

// Método para verificar y otorgar logros
loyaltyProgramSchema.methods.checkAchievements = async function() {
  const achievements = [];
  
  // Primer pedido
  if (this.statistics.totalOrders === 1) {
    achievements.push({
      name: 'first_purchase',
      description: {
        es: 'Primera compra realizada',
        en: 'First purchase completed',
        fr: 'Premier achat effectué'
      },
      icon: '🛒',
      pointsAwarded: POINTS_CONFIG.firstPurchaseBonus,
      category: 'purchase'
    });
  }
  
  // Milestones de pedidos
  const orderMilestones = [5, 10, 25, 50, 100];
  if (orderMilestones.includes(this.statistics.totalOrders)) {
    achievements.push({
      name: `orders_${this.statistics.totalOrders}`,
      description: {
        es: `${this.statistics.totalOrders} pedidos completados`,
        en: `${this.statistics.totalOrders} orders completed`,
        fr: `${this.statistics.totalOrders} commandes terminées`
      },
      icon: '📦',
      pointsAwarded: this.statistics.totalOrders * 10,
      category: 'milestone'
    });
  }
  
  // Milestones de gasto
  const spendingMilestones = [1000, 5000, 10000, 25000, 50000];
  const currentMilestone = spendingMilestones.find(m => 
    this.statistics.totalSpent >= m && 
    !this.achievements.some(a => a.name === `spending_${m}`)
  );
  
  if (currentMilestone) {
    achievements.push({
      name: `spending_${currentMilestone}`,
      description: {
        es: `${currentMilestone} CUP gastados en total`,
        en: `${currentMilestone} CUP spent in total`,
        fr: `${currentMilestone} CUP dépensés au total`
      },
      icon: '💰',
      pointsAwarded: currentMilestone / 10,
      category: 'milestone'
    });
  }
  
  // Racha de compras
  const streakMilestones = [5, 10, 20, 50];
  if (streakMilestones.includes(this.streaks.longestPurchaseStreak)) {
    achievements.push({
      name: `streak_${this.streaks.longestPurchaseStreak}`,
      description: {
        es: `Racha de ${this.streaks.longestPurchaseStreak} compras consecutivas`,
        en: `Streak of ${this.streaks.longestPurchaseStreak} consecutive purchases`,
        fr: `Série de ${this.streaks.longestPurchaseStreak} achats consécutifs`
      },
      icon: '🔥',
      pointsAwarded: this.streaks.longestPurchaseStreak * 5,
      category: 'purchase'
    });
  }
  
  // Otorgar puntos por logros y agregar a la lista
  for (const achievement of achievements) {
    if (!this.achievements.some(a => a.name === achievement.name)) {
      this.achievements.push(achievement);
      await this.addPoints(achievement.pointsAwarded, 'bonus', {
        es: `Logro desbloqueado: ${achievement.description.es}`,
        en: `Achievement unlocked: ${achievement.description.en}`,
        fr: `Succès débloqué: ${achievement.description.fr}`
      });
    }
  }
};

// Método para procesar referido
loyaltyProgramSchema.methods.processReferral = async function(referredUserId) {
  this.referrals.totalReferrals += 1;
  this.referrals.successfulReferrals += 1;
  
  await this.addPoints(POINTS_CONFIG.referralPoints, 'referral', {
    es: 'Puntos por referir a un amigo',
    en: 'Points for referring a friend',
    fr: 'Points pour avoir recommandé un ami'
  });
  
  return await this.save();
};

// Método estático para crear programa de fidelidad
loyaltyProgramSchema.statics.createForUser = async function(userId, referralCode = null) {
  const program = new this({
    user: userId,
    'referrals.referralCode': await this.generateReferralCode()
  });
  
  // Si fue referido por alguien
  if (referralCode) {
    const referrer = await this.findOne({ 'referrals.referralCode': referralCode });
    if (referrer) {
      program.referrals.referredBy = referrer.user;
      await referrer.processReferral(userId);
    }
  }
  
  return await program.save();
};

// Método estático para generar código de referido
loyaltyProgramSchema.statics.generateReferralCode = async function() {
  let code;
  let exists = true;
  
  while (exists) {
    code = Math.random().toString(36).substr(2, 8).toUpperCase();
    exists = await this.findOne({ 'referrals.referralCode': code });
  }
  
  return code;
};

// Método para obtener historial de puntos
loyaltyProgramSchema.methods.getPointsHistory = async function(limit = 50) {
  const PointTransaction = mongoose.model('PointTransaction');
  
  return await PointTransaction.find({ user: this.user })
    .sort({ createdAt: -1 })
    .limit(limit)
    .populate('relatedOrder', 'orderNumber total')
    .populate('relatedProduct', 'name');
};

// Método para limpiar puntos expirados
loyaltyProgramSchema.statics.cleanExpiredPoints = async function() {
  const PointTransaction = mongoose.model('PointTransaction');
  const now = new Date();
  
  const expiredTransactions = await PointTransaction.find({
    type: 'earned',
    expiresAt: { $lt: now },
    // No procesadas aún
    processed: { $ne: true }
  });
  
  for (const transaction of expiredTransactions) {
    const program = await this.findOne({ user: transaction.user });
    if (program && program.availablePoints >= transaction.points) {
      program.availablePoints -= transaction.points;
      await program.save();
      
      // Crear transacción de expiración
      await PointTransaction.create({
        user: transaction.user,
        type: 'expired',
        points: -transaction.points,
        description: {
          es: 'Puntos expirados',
          en: 'Points expired',
          fr: 'Points expirés'
        }
      });
      
      transaction.processed = true;
      await transaction.save();
    }
  }
};

const LoyaltyProgram = mongoose.model('LoyaltyProgram', loyaltyProgramSchema);
const PointTransaction = mongoose.model('PointTransaction', pointTransactionSchema);

module.exports = { LoyaltyProgram, PointTransaction };