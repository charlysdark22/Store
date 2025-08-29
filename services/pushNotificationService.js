const webpush = require('web-push');
const User = require('../models/User');

// Configuración de VAPID keys (en producción, estas deberían estar en variables de entorno)
const vapidKeys = {
  publicKey: process.env.VAPID_PUBLIC_KEY || 'BEl62iUYgUivxIkv69yViEuiBIa40HI8j2wcOFgU6-4dDRDjfAEez2lILgKMWWoHVgJhXVfgBGAEbWfKwqsuYaQ',
  privateKey: process.env.VAPID_PRIVATE_KEY || 'tUxbIMhfzAB2T4F2Duq2UUqk1SGqc6FpkdCXweKBLUw'
};

webpush.setVapidDetails(
  'mailto:soporte@techstorecuba.com',
  vapidKeys.publicKey,
  vapidKeys.privateKey
);

class PushNotificationService {
  constructor() {
    this.subscriptions = new Map(); // En producción, usar base de datos
    this.notificationQueue = [];
    this.isProcessing = false;
  }

  // Suscribir usuario a notificaciones push
  async subscribe(userId, subscription) {
    try {
      // Validar subscription
      if (!subscription || !subscription.endpoint) {
        throw new Error('Subscription inválida');
      }

      // Guardar subscription en base de datos
      await User.findByIdAndUpdate(userId, {
        $push: {
          pushSubscriptions: {
            endpoint: subscription.endpoint,
            keys: subscription.keys,
            subscribedAt: new Date(),
            isActive: true,
            userAgent: subscription.userAgent || '',
            platform: this.detectPlatform(subscription.userAgent)
          }
        }
      });

      // Guardar en memoria para acceso rápido
      this.subscriptions.set(userId, subscription);

      // Enviar notificación de bienvenida
      await this.sendNotification(userId, {
        title: '🔔 ¡Notificaciones activadas!',
        body: 'Te notificaremos sobre ofertas especiales y actualizaciones de tus pedidos.',
        icon: '/icons/icon-192x192.png',
        badge: '/icons/badge-72x72.png',
        tag: 'welcome',
        data: {
          type: 'welcome',
          url: '/'
        }
      });

      return { success: true };

    } catch (error) {
      console.error('Push subscription error:', error);
      return { success: false, error: error.message };
    }
  }

  // Desuscribir usuario
  async unsubscribe(userId, endpoint) {
    try {
      await User.findByIdAndUpdate(userId, {
        $pull: {
          pushSubscriptions: { endpoint }
        }
      });

      this.subscriptions.delete(userId);

      return { success: true };

    } catch (error) {
      console.error('Push unsubscription error:', error);
      return { success: false, error: error.message };
    }
  }

  // Enviar notificación a usuario específico
  async sendNotification(userId, notification, options = {}) {
    try {
      const user = await User.findById(userId);
      if (!user || !user.pushSubscriptions || user.pushSubscriptions.length === 0) {
        return { success: false, error: 'Usuario sin subscripciones activas' };
      }

      const results = [];

      for (const subscription of user.pushSubscriptions) {
        if (!subscription.isActive) continue;

        try {
          const payload = JSON.stringify({
            ...notification,
            timestamp: Date.now(),
            userId
          });

          const result = await webpush.sendNotification(
            {
              endpoint: subscription.endpoint,
              keys: subscription.keys
            },
            payload,
            {
              TTL: options.ttl || 86400, // 24 horas
              urgency: options.urgency || 'normal',
              topic: options.topic
            }
          );

          results.push({ success: true, statusCode: result.statusCode });

        } catch (error) {
          console.error(`Push notification failed for subscription ${subscription.endpoint}:`, error);
          
          // Si la subscription es inválida, marcarla como inactiva
          if (error.statusCode === 410 || error.statusCode === 404) {
            await this.markSubscriptionInactive(userId, subscription.endpoint);
          }

          results.push({ success: false, error: error.message });
        }
      }

      return { success: true, results };

    } catch (error) {
      console.error('Send notification error:', error);
      return { success: false, error: error.message };
    }
  }

  // Enviar notificación a múltiples usuarios
  async sendBulkNotification(userIds, notification, options = {}) {
    const results = [];

    for (const userId of userIds) {
      const result = await this.sendNotification(userId, notification, options);
      results.push({ userId, ...result });
    }

    return results;
  }

  // Enviar notificación a todos los usuarios suscritos
  async sendBroadcast(notification, filters = {}, options = {}) {
    try {
      const query = { 'pushSubscriptions.0': { $exists: true } };

      // Aplicar filtros
      if (filters.role) {
        query.role = filters.role;
      }
      if (filters.tier) {
        query.tier = filters.tier;
      }
      if (filters.isActive !== undefined) {
        query.isActive = filters.isActive;
      }

      const users = await User.find(query, '_id');
      const userIds = users.map(user => user._id.toString());

      return await this.sendBulkNotification(userIds, notification, options);

    } catch (error) {
      console.error('Broadcast notification error:', error);
      return { success: false, error: error.message };
    }
  }

  // Notificaciones específicas del e-commerce

  // Notificación de pedido confirmado
  async notifyOrderConfirmed(userId, order) {
    return await this.sendNotification(userId, {
      title: '✅ Pedido Confirmado',
      body: `Tu pedido #${order.orderNumber} ha sido confirmado. Total: ${order.total} CUP`,
      icon: '/icons/order-confirmed.png',
      badge: '/icons/badge-72x72.png',
      tag: `order-${order._id}`,
      data: {
        type: 'order_confirmed',
        orderId: order._id,
        url: `/orders/${order._id}`
      },
      actions: [
        {
          action: 'view_order',
          title: 'Ver Pedido',
          icon: '/icons/view-icon.png'
        },
        {
          action: 'track_order',
          title: 'Rastrear',
          icon: '/icons/track-icon.png'
        }
      ]
    });
  }

  // Notificación de pedido enviado
  async notifyOrderShipped(userId, order) {
    return await this.sendNotification(userId, {
      title: '🚚 Pedido Enviado',
      body: `Tu pedido #${order.orderNumber} está en camino. ${order.trackingNumber ? `Seguimiento: ${order.trackingNumber}` : ''}`,
      icon: '/icons/shipping.png',
      badge: '/icons/badge-72x72.png',
      tag: `order-${order._id}`,
      data: {
        type: 'order_shipped',
        orderId: order._id,
        trackingNumber: order.trackingNumber,
        url: `/orders/${order._id}`
      },
      actions: [
        {
          action: 'track_order',
          title: 'Rastrear Pedido',
          icon: '/icons/track-icon.png'
        }
      ]
    });
  }

  // Notificación de pedido entregado
  async notifyOrderDelivered(userId, order) {
    return await this.sendNotification(userId, {
      title: '🎉 Pedido Entregado',
      body: `Tu pedido #${order.orderNumber} ha sido entregado. ¡Esperamos que lo disfrutes!`,
      icon: '/icons/delivered.png',
      badge: '/icons/badge-72x72.png',
      tag: `order-${order._id}`,
      data: {
        type: 'order_delivered',
        orderId: order._id,
        url: `/orders/${order._id}/review`
      },
      actions: [
        {
          action: 'review_products',
          title: 'Escribir Reseña',
          icon: '/icons/review-icon.png'
        }
      ]
    });
  }

  // Notificación de pago confirmado
  async notifyPaymentConfirmed(userId, order) {
    return await this.sendNotification(userId, {
      title: '💳 Pago Confirmado',
      body: `El pago de tu pedido #${order.orderNumber} ha sido verificado exitosamente.`,
      icon: '/icons/payment-confirmed.png',
      badge: '/icons/badge-72x72.png',
      tag: `payment-${order._id}`,
      data: {
        type: 'payment_confirmed',
        orderId: order._id,
        url: `/orders/${order._id}`
      }
    });
  }

  // Notificación de producto en oferta
  async notifyProductOnSale(userId, product, discount) {
    return await this.sendNotification(userId, {
      title: '🔥 Oferta Especial',
      body: `${product.name.es} ahora con ${discount}% de descuento. ¡Aprovecha!`,
      icon: product.images[0] || '/icons/sale.png',
      badge: '/icons/badge-72x72.png',
      tag: `sale-${product._id}`,
      data: {
        type: 'product_sale',
        productId: product._id,
        discount,
        url: `/products/${product._id}`
      },
      actions: [
        {
          action: 'view_product',
          title: 'Ver Producto',
          icon: '/icons/view-icon.png'
        },
        {
          action: 'add_to_cart',
          title: 'Agregar al Carrito',
          icon: '/icons/cart-icon.png'
        }
      ]
    });
  }

  // Notificación de stock disponible
  async notifyStockAvailable(userId, product) {
    return await this.sendNotification(userId, {
      title: '📦 Producto Disponible',
      body: `${product.name.es} ya está disponible en stock. ¡No te lo pierdas!`,
      icon: product.images[0] || '/icons/stock.png',
      badge: '/icons/badge-72x72.png',
      tag: `stock-${product._id}`,
      data: {
        type: 'stock_available',
        productId: product._id,
        url: `/products/${product._id}`
      },
      actions: [
        {
          action: 'view_product',
          title: 'Ver Producto',
          icon: '/icons/view-icon.png'
        }
      ]
    });
  }

  // Notificación de carrito abandonado
  async notifyAbandonedCart(userId, cartItems) {
    const itemCount = cartItems.length;
    const firstItem = cartItems[0];

    return await this.sendNotification(userId, {
      title: '🛒 ¡No olvides tu carrito!',
      body: `Tienes ${itemCount} producto${itemCount > 1 ? 's' : ''} esperándote${firstItem ? `, incluyendo ${firstItem.product.name.es}` : ''}.`,
      icon: '/icons/cart-abandoned.png',
      badge: '/icons/badge-72x72.png',
      tag: 'abandoned-cart',
      data: {
        type: 'abandoned_cart',
        itemCount,
        url: '/cart'
      },
      actions: [
        {
          action: 'view_cart',
          title: 'Ver Carrito',
          icon: '/icons/cart-icon.png'
        },
        {
          action: 'checkout',
          title: 'Finalizar Compra',
          icon: '/icons/checkout-icon.png'
        }
      ]
    });
  }

  // Notificación de cupón disponible
  async notifyCouponAvailable(userId, coupon) {
    return await this.sendNotification(userId, {
      title: '🎫 Cupón Especial',
      body: `Tienes un cupón de ${coupon.type === 'percentage' ? coupon.value + '%' : coupon.value + ' CUP'} de descuento. Código: ${coupon.code}`,
      icon: '/icons/coupon.png',
      badge: '/icons/badge-72x72.png',
      tag: `coupon-${coupon._id}`,
      data: {
        type: 'coupon_available',
        couponCode: coupon.code,
        couponId: coupon._id,
        url: '/products'
      },
      actions: [
        {
          action: 'use_coupon',
          title: 'Usar Cupón',
          icon: '/icons/coupon-icon.png'
        }
      ]
    });
  }

  // Notificación de puntos de fidelidad
  async notifyLoyaltyPoints(userId, points, reason) {
    return await this.sendNotification(userId, {
      title: '⭐ Puntos Ganados',
      body: `¡Has ganado ${points} puntos! ${reason}`,
      icon: '/icons/loyalty-points.png',
      badge: '/icons/badge-72x72.png',
      tag: 'loyalty-points',
      data: {
        type: 'loyalty_points',
        points,
        reason,
        url: '/profile#loyalty'
      }
    });
  }

  // Notificación de nueva reseña en producto
  async notifyNewReview(userId, product, review) {
    return await this.sendNotification(userId, {
      title: '⭐ Nueva Reseña',
      body: `${product.name.es} tiene una nueva reseña de ${review.rating.overall} estrellas.`,
      icon: product.images[0] || '/icons/review.png',
      badge: '/icons/badge-72x72.png',
      tag: `review-${product._id}`,
      data: {
        type: 'new_review',
        productId: product._id,
        reviewId: review._id,
        url: `/products/${product._id}#reviews`
      }
    });
  }

  // Funciones auxiliares

  // Detectar plataforma del usuario
  detectPlatform(userAgent) {
    if (!userAgent) return 'unknown';
    
    if (/Android/i.test(userAgent)) return 'android';
    if (/iPhone|iPad/i.test(userAgent)) return 'ios';
    if (/Windows/i.test(userAgent)) return 'windows';
    if (/Mac/i.test(userAgent)) return 'mac';
    if (/Linux/i.test(userAgent)) return 'linux';
    
    return 'unknown';
  }

  // Marcar subscription como inactiva
  async markSubscriptionInactive(userId, endpoint) {
    try {
      await User.findOneAndUpdate(
        { 
          _id: userId,
          'pushSubscriptions.endpoint': endpoint
        },
        {
          $set: {
            'pushSubscriptions.$.isActive': false,
            'pushSubscriptions.$.deactivatedAt': new Date()
          }
        }
      );
    } catch (error) {
      console.error('Error marking subscription inactive:', error);
    }
  }

  // Obtener estadísticas de notificaciones
  async getStats() {
    try {
      const stats = await User.aggregate([
        {
          $match: {
            'pushSubscriptions.0': { $exists: true }
          }
        },
        {
          $project: {
            totalSubscriptions: { $size: '$pushSubscriptions' },
            activeSubscriptions: {
              $size: {
                $filter: {
                  input: '$pushSubscriptions',
                  cond: { $eq: ['$$this.isActive', true] }
                }
              }
            },
            platforms: '$pushSubscriptions.platform'
          }
        },
        {
          $group: {
            _id: null,
            totalUsers: { $sum: 1 },
            totalSubscriptions: { $sum: '$totalSubscriptions' },
            totalActiveSubscriptions: { $sum: '$activeSubscriptions' },
            platforms: { $push: '$platforms' }
          }
        }
      ]);

      if (stats.length === 0) {
        return {
          totalUsers: 0,
          totalSubscriptions: 0,
          activeSubscriptions: 0,
          platformDistribution: {}
        };
      }

      // Contar plataformas
      const platformDistribution = {};
      stats[0].platforms.flat().forEach(platform => {
        platformDistribution[platform] = (platformDistribution[platform] || 0) + 1;
      });

      return {
        totalUsers: stats[0].totalUsers,
        totalSubscriptions: stats[0].totalSubscriptions,
        activeSubscriptions: stats[0].totalActiveSubscriptions,
        platformDistribution
      };

    } catch (error) {
      console.error('Error getting push notification stats:', error);
      return {
        totalUsers: 0,
        totalSubscriptions: 0,
        activeSubscriptions: 0,
        platformDistribution: {}
      };
    }
  }

  // Limpiar subscriptions inactivas
  async cleanupInactiveSubscriptions() {
    try {
      const result = await User.updateMany(
        {},
        {
          $pull: {
            pushSubscriptions: {
              $or: [
                { isActive: false },
                { deactivatedAt: { $lt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) } } // 30 días
              ]
            }
          }
        }
      );

      console.log(`Cleaned up ${result.modifiedCount} inactive subscriptions`);
      return result.modifiedCount;

    } catch (error) {
      console.error('Error cleaning up subscriptions:', error);
      return 0;
    }
  }
}

module.exports = new PushNotificationService();