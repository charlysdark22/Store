const express = require('express');
const chatbotService = require('../services/chatbotService');
const { auth } = require('../middleware/auth');

const router = express.Router();

// Enviar mensaje al chatbot
router.post('/message', async (req, res) => {
  try {
    const { message, language = 'es' } = req.body;
    const userId = req.user?.userId || null;

    if (!message || !message.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Mensaje requerido',
        messageEs: 'Mensaje requerido',
        messageEn: 'Message required'
      });
    }

    const response = await chatbotService.processMessage(
      message.trim(),
      userId,
      language
    );

    res.json({
      success: true,
      data: response
    });

  } catch (error) {
    console.error('Chatbot message error:', error);
    res.status(500).json({
      success: false,
      message: 'Error procesando mensaje',
      response: language === 'es' ? 
        'Lo siento, ocurrió un error. ¿Puedes intentar de nuevo?' :
        'Sorry, an error occurred. Can you try again?'
    });
  }
});

// Obtener historial de conversación (autenticado)
router.get('/history', auth, async (req, res) => {
  try {
    const history = chatbotService.getConversationHistory(req.user.userId);
    
    res.json({
      success: true,
      data: {
        history,
        totalMessages: history.length
      }
    });

  } catch (error) {
    console.error('Chatbot history error:', error);
    res.status(500).json({
      success: false,
      message: 'Error obteniendo historial'
    });
  }
});

// Limpiar historial de conversación
router.delete('/history', auth, async (req, res) => {
  try {
    chatbotService.clearUserContext(req.user.userId);
    
    res.json({
      success: true,
      message: 'Historial de conversación eliminado',
      messageEs: 'Historial de conversación eliminado',
      messageEn: 'Conversation history cleared'
    });

  } catch (error) {
    console.error('Clear chatbot history error:', error);
    res.status(500).json({
      success: false,
      message: 'Error limpiando historial'
    });
  }
});

// Obtener sugerencias de inicio rápido
router.get('/quick-start', async (req, res) => {
  try {
    const { language = 'es' } = req.query;
    
    const suggestions = {
      es: [
        {
          title: '📱 Ver Productos',
          message: 'Quiero ver los productos disponibles',
          icon: '📱'
        },
        {
          title: '📦 Mis Pedidos',
          message: 'Consultar el estado de mis pedidos',
          icon: '📦'
        },
        {
          title: '💳 Métodos de Pago',
          message: 'Como puedo pagar mi pedido',
          icon: '💳'
        },
        {
          title: '🚚 Información de Envío',
          message: 'Información sobre envíos y entregas',
          icon: '🚚'
        },
        {
          title: '🔍 Buscar Producto',
          message: 'Busco un iPhone 14',
          icon: '🔍'
        },
        {
          title: '🆘 Contactar Soporte',
          message: 'Necesito ayuda con un problema',
          icon: '🆘'
        }
      ],
      en: [
        {
          title: '📱 View Products',
          message: 'I want to see available products',
          icon: '📱'
        },
        {
          title: '📦 My Orders',
          message: 'Check the status of my orders',
          icon: '📦'
        },
        {
          title: '💳 Payment Methods',
          message: 'How can I pay for my order',
          icon: '💳'
        },
        {
          title: '🚚 Shipping Information',
          message: 'Information about shipping and delivery',
          icon: '🚚'
        },
        {
          title: '🔍 Search Product',
          message: 'I\'m looking for an iPhone 14',
          icon: '🔍'
        },
        {
          title: '🆘 Contact Support',
          message: 'I need help with a problem',
          icon: '🆘'
        }
      ]
    };

    res.json({
      success: true,
      data: suggestions[language] || suggestions.es
    });

  } catch (error) {
    console.error('Quick start error:', error);
    res.status(500).json({
      success: false,
      message: 'Error obteniendo sugerencias'
    });
  }
});

// Webhook para integración con WhatsApp Business API (futuro)
router.post('/webhook/whatsapp', async (req, res) => {
  try {
    // Placeholder para integración con WhatsApp
    const { message, from, language = 'es' } = req.body;
    
    if (!message || !from) {
      return res.status(400).json({
        success: false,
        message: 'Datos incompletos'
      });
    }

    // Procesar mensaje
    const response = await chatbotService.processMessage(
      message,
      `whatsapp_${from}`,
      language
    );

    // En producción, aquí se enviaría la respuesta de vuelta a WhatsApp
    console.log(`WhatsApp response to ${from}:`, response.response);

    res.json({
      success: true,
      data: response
    });

  } catch (error) {
    console.error('WhatsApp webhook error:', error);
    res.status(500).json({
      success: false,
      message: 'Error procesando mensaje de WhatsApp'
    });
  }
});

// Webhook para integración con Facebook Messenger (futuro)
router.post('/webhook/messenger', async (req, res) => {
  try {
    // Placeholder para integración con Messenger
    const { message, sender_id, language = 'es' } = req.body;
    
    if (!message || !sender_id) {
      return res.status(400).json({
        success: false,
        message: 'Datos incompletos'
      });
    }

    const response = await chatbotService.processMessage(
      message,
      `messenger_${sender_id}`,
      language
    );

    res.json({
      success: true,
      data: response
    });

  } catch (error) {
    console.error('Messenger webhook error:', error);
    res.status(500).json({
      success: false,
      message: 'Error procesando mensaje de Messenger'
    });
  }
});

// RUTAS ADMIN

// Obtener estadísticas del chatbot
router.get('/admin/stats', auth, async (req, res) => {
  try {
    // Verificar si es admin
    if (req.userProfile.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Acceso denegado'
      });
    }

    const stats = chatbotService.getStats();
    
    res.json({
      success: true,
      data: stats
    });

  } catch (error) {
    console.error('Chatbot stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Error obteniendo estadísticas'
    });
  }
});

// Obtener conversaciones activas (Admin)
router.get('/admin/conversations', auth, async (req, res) => {
  try {
    if (req.userProfile.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Acceso denegado'
      });
    }

    // En una implementación real, esto vendría de base de datos
    const conversations = [];
    
    res.json({
      success: true,
      data: {
        conversations,
        totalActive: conversations.length
      }
    });

  } catch (error) {
    console.error('Admin conversations error:', error);
    res.status(500).json({
      success: false,
      message: 'Error obteniendo conversaciones'
    });
  }
});

// Intervenir en conversación (Admin)
router.post('/admin/intervene', auth, async (req, res) => {
  try {
    if (req.userProfile.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Acceso denegado'
      });
    }

    const { userId, message } = req.body;
    
    // Placeholder para intervención manual
    // En producción, esto permitiría a los admins tomar control de conversaciones
    
    res.json({
      success: true,
      message: 'Intervención registrada',
      data: {
        userId,
        adminMessage: message,
        timestamp: new Date()
      }
    });

  } catch (error) {
    console.error('Admin intervention error:', error);
    res.status(500).json({
      success: false,
      message: 'Error en intervención'
    });
  }
});

module.exports = router;