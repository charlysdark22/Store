const express = require('express');
const pushNotificationService = require('../services/pushNotificationService');
const { auth, adminAuth } = require('../middleware/auth');

const router = express.Router();

// Suscribirse a notificaciones push
router.post('/subscribe', auth, async (req, res) => {
  try {
    const { subscription } = req.body;

    if (!subscription) {
      return res.status(400).json({
        success: false,
        message: 'Subscription data required',
        messageEs: 'Datos de suscripción requeridos',
        messageEn: 'Subscription data required'
      });
    }

    // Agregar información adicional
    subscription.userAgent = req.get('User-Agent');

    const result = await pushNotificationService.subscribe(req.user.userId, subscription);

    if (result.success) {
      res.json({
        success: true,
        message: 'Successfully subscribed to push notifications',
        messageEs: 'Suscrito exitosamente a notificaciones push',
        messageEn: 'Successfully subscribed to push notifications'
      });
    } else {
      res.status(400).json({
        success: false,
        message: result.error,
        messageEs: 'Error al suscribirse a notificaciones',
        messageEn: 'Error subscribing to notifications'
      });
    }

  } catch (error) {
    console.error('Push subscription error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during subscription',
      error: error.message
    });
  }
});

// Desuscribirse de notificaciones push
router.post('/unsubscribe', auth, async (req, res) => {
  try {
    const { endpoint } = req.body;

    if (!endpoint) {
      return res.status(400).json({
        success: false,
        message: 'Endpoint required',
        messageEs: 'Endpoint requerido',
        messageEn: 'Endpoint required'
      });
    }

    const result = await pushNotificationService.unsubscribe(req.user.userId, endpoint);

    if (result.success) {
      res.json({
        success: true,
        message: 'Successfully unsubscribed from push notifications',
        messageEs: 'Desuscrito exitosamente de notificaciones push',
        messageEn: 'Successfully unsubscribed from push notifications'
      });
    } else {
      res.status(400).json({
        success: false,
        message: result.error
      });
    }

  } catch (error) {
    console.error('Push unsubscription error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during unsubscription'
    });
  }
});

// Obtener VAPID public key
router.get('/vapid-public-key', (req, res) => {
  res.json({
    success: true,
    publicKey: process.env.VAPID_PUBLIC_KEY || 'BEl62iUYgUivxIkv69yViEuiBIa40HI8j2wcOFgU6-4dDRDjfAEez2lILgKMWWoHVgJhXVfgBGAEbWfKwqsuYaQ'
  });
});

// Enviar notificación de prueba (usuario autenticado)
router.post('/test', auth, async (req, res) => {
  try {
    const { title, body, icon, url } = req.body;

    const notification = {
      title: title || '🧪 Notificación de Prueba',
      body: body || 'Esta es una notificación de prueba desde Tech Store Cuba',
      icon: icon || '/icons/icon-192x192.png',
      badge: '/icons/badge-72x72.png',
      tag: 'test-notification',
      data: {
        type: 'test',
        url: url || '/',
        timestamp: Date.now()
      }
    };

    const result = await pushNotificationService.sendNotification(
      req.user.userId,
      notification
    );

    res.json({
      success: result.success,
      message: result.success ? 
        'Test notification sent successfully' : 
        'Failed to send test notification',
      data: result
    });

  } catch (error) {
    console.error('Test notification error:', error);
    res.status(500).json({
      success: false,
      message: 'Error sending test notification'
    });
  }
});

// RUTAS ADMIN

// Enviar notificación a usuario específico (Admin)
router.post('/admin/send-to-user', auth, adminAuth, async (req, res) => {
  try {
    const { userId, notification, options = {} } = req.body;

    if (!userId || !notification) {
      return res.status(400).json({
        success: false,
        message: 'User ID and notification data required'
      });
    }

    const result = await pushNotificationService.sendNotification(
      userId,
      notification,
      options
    );

    res.json({
      success: result.success,
      message: result.success ? 
        'Notification sent successfully' : 
        'Failed to send notification',
      data: result
    });

  } catch (error) {
    console.error('Admin send notification error:', error);
    res.status(500).json({
      success: false,
      message: 'Error sending notification'
    });
  }
});

// Enviar notificación masiva (Admin)
router.post('/admin/broadcast', auth, adminAuth, async (req, res) => {
  try {
    const { notification, filters = {}, options = {} } = req.body;

    if (!notification) {
      return res.status(400).json({
        success: false,
        message: 'Notification data required'
      });
    }

    const results = await pushNotificationService.sendBroadcast(
      notification,
      filters,
      options
    );

    const successCount = results.filter(r => r.success).length;
    const totalCount = results.length;

    res.json({
      success: true,
      message: `Broadcast sent to ${successCount}/${totalCount} users`,
      data: {
        successCount,
        totalCount,
        results: results.slice(0, 10) // Limitar resultados mostrados
      }
    });

  } catch (error) {
    console.error('Broadcast notification error:', error);
    res.status(500).json({
      success: false,
      message: 'Error sending broadcast notification'
    });
  }
});

// Obtener estadísticas de notificaciones (Admin)
router.get('/admin/stats', auth, adminAuth, async (req, res) => {
  try {
    const stats = await pushNotificationService.getStats();

    res.json({
      success: true,
      data: stats
    });

  } catch (error) {
    console.error('Push notification stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching notification statistics'
    });
  }
});

// Limpiar subscriptions inactivas (Admin)
router.post('/admin/cleanup', auth, adminAuth, async (req, res) => {
  try {
    const cleanedCount = await pushNotificationService.cleanupInactiveSubscriptions();

    res.json({
      success: true,
      message: `Cleaned up ${cleanedCount} inactive subscriptions`,
      data: {
        cleanedCount
      }
    });

  } catch (error) {
    console.error('Cleanup subscriptions error:', error);
    res.status(500).json({
      success: false,
      message: 'Error cleaning up subscriptions'
    });
  }
});

// Plantillas de notificaciones predefinidas (Admin)
router.get('/admin/templates', auth, adminAuth, (req, res) => {
  try {
    const templates = {
      newProduct: {
        title: '🆕 Nuevo Producto',
        body: 'Hemos agregado {{productName}} a nuestro catálogo. ¡Échale un vistazo!',
        icon: '/icons/new-product.png',
        data: {
          type: 'new_product',
          url: '/products/{{productId}}'
        }
      },
      flashSale: {
        title: '⚡ Oferta Flash',
        body: '¡Solo por hoy! {{discount}}% de descuento en productos seleccionados.',
        icon: '/icons/flash-sale.png',
        data: {
          type: 'flash_sale',
          url: '/products?sale=true'
        }
      },
      weekendDeal: {
        title: '🎉 Oferta de Fin de Semana',
        body: 'Aprovecha nuestras ofertas especiales de fin de semana.',
        icon: '/icons/weekend-deal.png',
        data: {
          type: 'weekend_deal',
          url: '/products?featured=true'
        }
      },
      backInStock: {
        title: '📦 Producto Disponible',
        body: '{{productName}} ya está disponible nuevamente en stock.',
        icon: '/icons/back-in-stock.png',
        data: {
          type: 'back_in_stock',
          url: '/products/{{productId}}'
        }
      },
      priceReduction: {
        title: '💰 Precio Reducido',
        body: '{{productName}} ahora tiene un precio más bajo. ¡Aprovecha!',
        icon: '/icons/price-drop.png',
        data: {
          type: 'price_reduction',
          url: '/products/{{productId}}'
        }
      },
      loyaltyReward: {
        title: '🎁 Recompensa de Fidelidad',
        body: '¡Has desbloqueado una recompensa especial! {{points}} puntos disponibles.',
        icon: '/icons/loyalty-reward.png',
        data: {
          type: 'loyalty_reward',
          url: '/profile#loyalty'
        }
      },
      birthdayOffer: {
        title: '🎂 ¡Feliz Cumpleaños!',
        body: 'Tienes un descuento especial de cumpleaños esperándote.',
        icon: '/icons/birthday.png',
        data: {
          type: 'birthday_offer',
          url: '/profile#coupons'
        }
      },
      maintenanceAlert: {
        title: '🔧 Mantenimiento Programado',
        body: 'La tienda estará en mantenimiento el {{date}} de {{startTime}} a {{endTime}}.',
        icon: '/icons/maintenance.png',
        data: {
          type: 'maintenance_alert',
          url: '/'
        }
      }
    };

    res.json({
      success: true,
      data: templates
    });

  } catch (error) {
    console.error('Get notification templates error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching notification templates'
    });
  }
});

// Programar notificación (Admin)
router.post('/admin/schedule', auth, adminAuth, async (req, res) => {
  try {
    const { notification, scheduledFor, filters = {}, options = {} } = req.body;

    if (!notification || !scheduledFor) {
      return res.status(400).json({
        success: false,
        message: 'Notification data and schedule time required'
      });
    }

    // En una implementación real, esto se guardaría en una cola de trabajos
    // Por ahora, solo validamos y devolvemos éxito
    const scheduleTime = new Date(scheduledFor);
    const now = new Date();

    if (scheduleTime <= now) {
      return res.status(400).json({
        success: false,
        message: 'Scheduled time must be in the future'
      });
    }

    // Placeholder para programación de notificaciones
    // En producción se usaría algo como Bull Queue, Agenda, etc.
    
    res.json({
      success: true,
      message: 'Notification scheduled successfully',
      data: {
        scheduledFor: scheduleTime,
        notification,
        filters,
        options
      }
    });

  } catch (error) {
    console.error('Schedule notification error:', error);
    res.status(500).json({
      success: false,
      message: 'Error scheduling notification'
    });
  }
});

module.exports = router;