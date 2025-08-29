const Product = require('../models/Product');
const Order = require('../models/Order');
const User = require('../models/User');
const Coupon = require('../models/Coupon');

class ChatbotService {
  constructor() {
    this.intents = new Map();
    this.contexts = new Map();
    this.conversations = new Map();
    this.initializeIntents();
  }

  initializeIntents() {
    // Intenciones y respuestas del chatbot
    this.intents.set('greeting', {
      patterns: [
        'hola', 'hello', 'hi', 'buenos días', 'buenas tardes', 'buenas noches',
        'hey', 'saludos', 'qué tal', 'como estas'
      ],
      responses: {
        es: [
          '¡Hola! 👋 Soy el asistente virtual de Tech Store Cuba. ¿En qué puedo ayudarte hoy?',
          '¡Bienvenido a Tech Store! 🛒 Estoy aquí para ayudarte con cualquier pregunta.',
          '¡Hola! Me alegra verte por aquí. ¿Necesitas ayuda con algo específico?'
        ],
        en: [
          'Hello! 👋 I\'m Tech Store Cuba\'s virtual assistant. How can I help you today?',
          'Welcome to Tech Store! 🛒 I\'m here to help with any questions.',
          'Hi! Great to see you here. Do you need help with something specific?'
        ]
      },
      followUp: ['products', 'orders', 'support']
    });

    this.intents.set('products', {
      patterns: [
        'productos', 'products', 'catálogo', 'catalog', 'computadoras', 'laptops',
        'teléfonos', 'phones', 'accesorios', 'accessories', 'qué venden', 'what do you sell'
      ],
      responses: {
        es: [
          '📱💻 Tenemos una gran variedad de productos tecnológicos:',
          '🛒 Nuestro catálogo incluye:'
        ],
        en: [
          '📱💻 We have a great variety of tech products:',
          '🛒 Our catalog includes:'
        ]
      },
      action: 'showProductCategories'
    });

    this.intents.set('orders', {
      patterns: [
        'pedido', 'order', 'compra', 'purchase', 'seguimiento', 'tracking',
        'estado', 'status', 'dónde está', 'where is', 'cuándo llega', 'when arrives'
      ],
      responses: {
        es: [
          '📦 Te puedo ayudar con información sobre tu pedido.',
          '🚚 Para consultar el estado de tu pedido, necesito algunos datos.'
        ],
        en: [
          '📦 I can help you with information about your order.',
          '🚚 To check your order status, I need some information.'
        ]
      },
      action: 'handleOrderInquiry',
      requiresAuth: true
    });

    this.intents.set('payment', {
      patterns: [
        'pago', 'payment', 'transfermóvil', 'enzona', 'como pagar', 'how to pay',
        'métodos de pago', 'payment methods', 'bancos', 'banks'
      ],
      responses: {
        es: [
          '💳 Aceptamos varios métodos de pago seguros en Cuba:',
          '🏦 Puedes pagar con:'
        ],
        en: [
          '💳 We accept several secure payment methods in Cuba:',
          '🏦 You can pay with:'
        ]
      },
      action: 'showPaymentMethods'
    });

    this.intents.set('shipping', {
      patterns: [
        'envío', 'shipping', 'entrega', 'delivery', 'costo de envío', 'shipping cost',
        'cuánto demora', 'how long', 'gratis', 'free'
      ],
      responses: {
        es: [
          '🚚 Información sobre envíos:',
          '📍 Enviamos a toda Cuba:'
        ],
        en: [
          '🚚 Shipping information:',
          '📍 We ship all over Cuba:'
        ]
      },
      action: 'showShippingInfo'
    });

    this.intents.set('support', {
      patterns: [
        'ayuda', 'help', 'soporte', 'support', 'problema', 'problem',
        'contacto', 'contact', 'teléfono', 'phone', 'email'
      ],
      responses: {
        es: [
          '🆘 Estoy aquí para ayudarte. También puedes contactar a nuestro equipo:',
          '📞 Opciones de contacto:'
        ],
        en: [
          '🆘 I\'m here to help. You can also contact our team:',
          '📞 Contact options:'
        ]
      },
      action: 'showSupportOptions'
    });

    this.intents.set('search', {
      patterns: [
        'buscar', 'search', 'encontrar', 'find', 'necesito', 'i need',
        'quiero', 'i want', 'recomienda', 'recommend'
      ],
      responses: {
        es: [
          '🔍 Te ayudo a encontrar lo que buscas.',
          '🎯 ¿Qué tipo de producto necesitas?'
        ],
        en: [
          '🔍 I\'ll help you find what you\'re looking for.',
          '🎯 What type of product do you need?'
        ]
      },
      action: 'handleProductSearch',
      requiresInput: true
    });

    this.intents.set('price', {
      patterns: [
        'precio', 'price', 'costo', 'cost', 'cuánto cuesta', 'how much',
        'barato', 'cheap', 'caro', 'expensive', 'oferta', 'offer'
      ],
      responses: {
        es: [
          '💰 Te ayudo con información de precios.',
          '🏷️ ¿Sobre qué producto quieres saber el precio?'
        ],
        en: [
          '💰 I\'ll help with pricing information.',
          '🏷️ Which product would you like to know the price of?'
        ]
      },
      action: 'handlePriceInquiry',
      requiresInput: true
    });

    this.intents.set('goodbye', {
      patterns: [
        'adiós', 'goodbye', 'bye', 'hasta luego', 'see you later',
        'gracias', 'thank you', 'thanks', 'chao', 'nos vemos'
      ],
      responses: {
        es: [
          '¡Hasta pronto! 👋 Gracias por visitar Tech Store Cuba.',
          '¡Que tengas un excelente día! 🌟 Vuelve cuando quieras.',
          '¡Adiós! Espero haberte ayudado. ¡Vuelve pronto! 😊'
        ],
        en: [
          'See you soon! 👋 Thanks for visiting Tech Store Cuba.',
          'Have a great day! 🌟 Come back anytime.',
          'Goodbye! Hope I was helpful. Come back soon! 😊'
        ]
      }
    });

    this.intents.set('unknown', {
      responses: {
        es: [
          '🤔 No estoy seguro de entender. ¿Podrías ser más específico?',
          '❓ Disculpa, no entendí bien. ¿Puedes reformular tu pregunta?',
          '🆘 No reconozco esa consulta. Te puedo ayudar con: productos, pedidos, pagos, envíos o soporte.'
        ],
        en: [
          '🤔 I\'m not sure I understand. Could you be more specific?',
          '❓ Sorry, I didn\'t understand well. Can you rephrase your question?',
          '🆘 I don\'t recognize that query. I can help with: products, orders, payments, shipping or support.'
        ]
      },
      followUp: ['products', 'orders', 'payment', 'shipping', 'support']
    });
  }

  // Procesar mensaje del usuario
  async processMessage(message, userId = null, language = 'es') {
    try {
      const sessionId = userId || 'anonymous';
      const normalizedMessage = message.toLowerCase().trim();
      
      // Obtener o crear contexto de conversación
      let context = this.contexts.get(sessionId) || {
        language,
        previousIntent: null,
        waitingFor: null,
        conversationHistory: []
      };

      // Agregar mensaje al historial
      context.conversationHistory.push({
        type: 'user',
        message: message,
        timestamp: new Date()
      });

      // Detectar intención
      const intent = this.detectIntent(normalizedMessage);
      
      // Generar respuesta
      const response = await this.generateResponse(intent, normalizedMessage, context, userId);
      
      // Agregar respuesta al historial
      context.conversationHistory.push({
        type: 'bot',
        message: response.text,
        timestamp: new Date(),
        intent: intent,
        data: response.data
      });

      // Actualizar contexto
      context.previousIntent = intent;
      this.contexts.set(sessionId, context);

      return {
        success: true,
        response: response.text,
        intent,
        data: response.data,
        quickReplies: response.quickReplies,
        requiresAuth: response.requiresAuth
      };

    } catch (error) {
      console.error('Chatbot processing error:', error);
      return {
        success: false,
        response: language === 'es' ? 
          'Lo siento, ocurrió un error. ¿Puedes intentar de nuevo?' :
          'Sorry, an error occurred. Can you try again?',
        intent: 'error'
      };
    }
  }

  // Detectar intención del mensaje
  detectIntent(message) {
    let bestMatch = { intent: 'unknown', confidence: 0 };

    for (const [intentName, intentData] of this.intents.entries()) {
      if (!intentData.patterns) continue;

      for (const pattern of intentData.patterns) {
        const confidence = this.calculateSimilarity(message, pattern);
        if (confidence > bestMatch.confidence && confidence > 0.6) {
          bestMatch = { intent: intentName, confidence };
        }
      }
    }

    return bestMatch.intent;
  }

  // Calcular similitud entre textos
  calculateSimilarity(text1, text2) {
    const words1 = text1.toLowerCase().split(/\s+/);
    const words2 = text2.toLowerCase().split(/\s+/);
    
    let matches = 0;
    for (const word1 of words1) {
      for (const word2 of words2) {
        if (word1.includes(word2) || word2.includes(word1)) {
          matches++;
          break;
        }
      }
    }
    
    return matches / Math.max(words1.length, words2.length);
  }

  // Generar respuesta basada en intención
  async generateResponse(intent, message, context, userId) {
    const intentData = this.intents.get(intent);
    const language = context.language || 'es';
    
    let response = {
      text: '',
      data: null,
      quickReplies: [],
      requiresAuth: intentData?.requiresAuth || false
    };

    // Verificar autenticación si es requerida
    if (intentData?.requiresAuth && !userId) {
      response.text = language === 'es' ?
        'Para ayudarte con eso, necesitas iniciar sesión primero. 🔐' :
        'To help you with that, you need to log in first. 🔐';
      response.requiresAuth = true;
      return response;
    }

    // Obtener respuesta base
    if (intentData?.responses?.[language]) {
      const responses = intentData.responses[language];
      response.text = responses[Math.floor(Math.random() * responses.length)];
    }

    // Ejecutar acción específica si existe
    if (intentData?.action) {
      const actionResult = await this.executeAction(
        intentData.action, 
        message, 
        context, 
        userId, 
        language
      );
      
      if (actionResult.text) {
        response.text += '\n\n' + actionResult.text;
      }
      
      response.data = actionResult.data;
      response.quickReplies = actionResult.quickReplies || [];
    }

    // Agregar quick replies de seguimiento
    if (intentData?.followUp) {
      const followUpReplies = intentData.followUp.map(followUp => ({
        title: this.getQuickReplyTitle(followUp, language),
        payload: followUp
      }));
      response.quickReplies = [...response.quickReplies, ...followUpReplies];
    }

    return response;
  }

  // Ejecutar acciones específicas
  async executeAction(action, message, context, userId, language) {
    switch (action) {
      case 'showProductCategories':
        return await this.showProductCategories(language);
      
      case 'handleOrderInquiry':
        return await this.handleOrderInquiry(userId, language);
      
      case 'showPaymentMethods':
        return this.showPaymentMethods(language);
      
      case 'showShippingInfo':
        return this.showShippingInfo(language);
      
      case 'showSupportOptions':
        return this.showSupportOptions(language);
      
      case 'handleProductSearch':
        return await this.handleProductSearch(message, language);
      
      case 'handlePriceInquiry':
        return await this.handlePriceInquiry(message, language);
      
      default:
        return { text: '', data: null, quickReplies: [] };
    }
  }

  // Mostrar categorías de productos
  async showProductCategories(language) {
    try {
      const categories = await Product.aggregate([
        { $match: { isActive: true } },
        { 
          $group: { 
            _id: '$category', 
            count: { $sum: 1 },
            avgPrice: { $avg: '$price' }
          } 
        },
        { $sort: { count: -1 } }
      ]);

      const categoryNames = {
        es: {
          desktop: '💻 Computadoras de Escritorio',
          laptop: '💻 Laptops',
          phone: '📱 Teléfonos',
          accessories: '🔌 Accesorios'
        },
        en: {
          desktop: '💻 Desktop Computers',
          laptop: '💻 Laptops',
          phone: '📱 Phones',
          accessories: '🔌 Accessories'
        }
      };

      let text = '';
      const quickReplies = [];

      categories.forEach(cat => {
        const name = categoryNames[language][cat._id] || cat._id;
        text += `\n${name} (${cat.count} productos)`;
        quickReplies.push({
          title: name.split(' ')[1], // Solo el nombre sin emoji
          payload: `category_${cat._id}`
        });
      });

      return {
        text,
        data: { categories },
        quickReplies
      };

    } catch (error) {
      return {
        text: language === 'es' ? 
          'Error al cargar categorías.' : 
          'Error loading categories.',
        data: null,
        quickReplies: []
      };
    }
  }

  // Manejar consultas de pedidos
  async handleOrderInquiry(userId, language) {
    try {
      const recentOrders = await Order.find({ user: userId })
        .sort({ createdAt: -1 })
        .limit(3)
        .populate('items.product', 'name');

      if (recentOrders.length === 0) {
        return {
          text: language === 'es' ?
            'No tienes pedidos recientes. ¡Explora nuestros productos!' :
            'You don\'t have recent orders. Explore our products!',
          data: null,
          quickReplies: [
            { title: language === 'es' ? 'Ver Productos' : 'View Products', payload: 'products' }
          ]
        };
      }

      let text = language === 'es' ? 
        'Estos son tus pedidos recientes:' :
        'These are your recent orders:';

      const quickReplies = [];

      recentOrders.forEach((order, index) => {
        const statusText = {
          es: {
            pending: '⏳ Pendiente',
            confirmed: '✅ Confirmado',
            processing: '📦 Procesando',
            shipped: '🚚 Enviado',
            delivered: '✅ Entregado',
            cancelled: '❌ Cancelado'
          },
          en: {
            pending: '⏳ Pending',
            confirmed: '✅ Confirmed',
            processing: '📦 Processing',
            shipped: '🚚 Shipped',
            delivered: '✅ Delivered',
            cancelled: '❌ Cancelled'
          }
        };

        text += `\n\n📋 #${order.orderNumber}`;
        text += `\n${statusText[language][order.status]}`;
        text += `\n💰 ${order.total} CUP`;

        if (index < 2) {
          quickReplies.push({
            title: `#${order.orderNumber}`,
            payload: `order_${order._id}`
          });
        }
      });

      return {
        text,
        data: { orders: recentOrders },
        quickReplies
      };

    } catch (error) {
      return {
        text: language === 'es' ?
          'Error al consultar pedidos.' :
          'Error checking orders.',
        data: null,
        quickReplies: []
      };
    }
  }

  // Mostrar métodos de pago
  showPaymentMethods(language) {
    const text = language === 'es' ?
      `💳 **Transfermóvil** - BANDEC, BPA, Metropolitano
💳 **EnZona** - BANDEC, BPA, Metropolitano
💵 **Efectivo** - Pago contraentrega

🔒 Todos los pagos son seguros y en CUP (pesos cubanos).` :
      `💳 **Transfermóvil** - BANDEC, BPA, Metropolitano
💳 **EnZona** - BANDEC, BPA, Metropolitano
💵 **Cash** - Cash on delivery

🔒 All payments are secure and in CUP (Cuban pesos).`;

    return {
      text,
      data: {
        methods: ['transfermovil', 'enzona', 'cash'],
        banks: ['bandec', 'bpa', 'metropolitano']
      },
      quickReplies: [
        { 
          title: language === 'es' ? 'Ver Productos' : 'View Products', 
          payload: 'products' 
        }
      ]
    };
  }

  // Mostrar información de envío
  showShippingInfo(language) {
    const text = language === 'es' ?
      `🚚 **Envío a toda Cuba**
📍 Todas las provincias
⏱️ 2-5 días hábiles
💰 Envío GRATIS en compras >1000 CUP
📦 Empaque seguro garantizado

🏃‍♂️ **Entrega rápida en La Habana**: 24-48 horas` :
      `🚚 **Shipping all over Cuba**
📍 All provinces
⏱️ 2-5 business days
💰 FREE shipping on purchases >1000 CUP
📦 Secure packaging guaranteed

🏃‍♂️ **Fast delivery in Havana**: 24-48 hours`;

    return {
      text,
      data: {
        freeShippingThreshold: 1000,
        deliveryTime: '2-5 days',
        fastDeliveryAreas: ['havana']
      },
      quickReplies: [
        { 
          title: language === 'es' ? 'Ver Productos' : 'View Products', 
          payload: 'products' 
        }
      ]
    };
  }

  // Mostrar opciones de soporte
  showSupportOptions(language) {
    const text = language === 'es' ?
      `📞 **WhatsApp**: +53 5555-5555
📧 **Email**: soporte@techstorecuba.com
🕒 **Horario**: Lun-Vie 9:00-18:00

💬 También puedes seguir chateando conmigo para:
• Consultar productos
• Estado de pedidos  
• Información de pagos
• Dudas generales` :
      `📞 **WhatsApp**: +53 5555-5555
📧 **Email**: soporte@techstorecuba.com
🕒 **Hours**: Mon-Fri 9:00-18:00

💬 You can also keep chatting with me for:
• Product inquiries
• Order status
• Payment information  
• General questions`;

    return {
      text,
      data: {
        whatsapp: '+53 5555-5555',
        email: 'soporte@techstorecuba.com',
        hours: 'Mon-Fri 9:00-18:00'
      },
      quickReplies: [
        { title: 'WhatsApp', payload: 'whatsapp_contact' },
        { 
          title: language === 'es' ? 'Productos' : 'Products', 
          payload: 'products' 
        }
      ]
    };
  }

  // Manejar búsqueda de productos
  async handleProductSearch(message, language) {
    try {
      // Extraer términos de búsqueda del mensaje
      const searchTerms = this.extractSearchTerms(message);
      
      if (!searchTerms) {
        return {
          text: language === 'es' ?
            '🔍 ¿Qué tipo de producto buscas? Por ejemplo: "laptop gaming", "iPhone", "mouse inalámbrico"' :
            '🔍 What type of product are you looking for? For example: "gaming laptop", "iPhone", "wireless mouse"',
          data: null,
          quickReplies: [
            { title: 'Laptops', payload: 'category_laptop' },
            { title: language === 'es' ? 'Teléfonos' : 'Phones', payload: 'category_phone' },
            { title: language === 'es' ? 'Computadoras' : 'Computers', payload: 'category_desktop' }
          ]
        };
      }

      const products = await Product.find({
        isActive: true,
        $or: [
          { 'name.es': new RegExp(searchTerms, 'i') },
          { 'name.en': new RegExp(searchTerms, 'i') },
          { brand: new RegExp(searchTerms, 'i') },
          { model: new RegExp(searchTerms, 'i') }
        ]
      }).limit(5);

      if (products.length === 0) {
        return {
          text: language === 'es' ?
            `😔 No encontré productos con "${searchTerms}". ¿Quieres ver nuestras categorías?` :
            `😔 I didn't find products with "${searchTerms}". Want to see our categories?`,
          data: null,
          quickReplies: [
            { title: language === 'es' ? 'Ver Categorías' : 'View Categories', payload: 'products' }
          ]
        };
      }

      let text = language === 'es' ?
        `🎯 Encontré ${products.length} productos para "${searchTerms}":` :
        `🎯 I found ${products.length} products for "${searchTerms}":`;

      const quickReplies = [];

      products.forEach((product, index) => {
        text += `\n\n📱 ${product.name.es}`;
        text += `\n💰 ${product.price} CUP`;
        text += `\n⭐ ${product.averageRating || 0}/5`;

        if (index < 3) {
          quickReplies.push({
            title: product.name.es.substring(0, 20),
            payload: `product_${product._id}`
          });
        }
      });

      return {
        text,
        data: { products, searchTerms },
        quickReplies
      };

    } catch (error) {
      return {
        text: language === 'es' ?
          'Error en la búsqueda. Intenta de nuevo.' :
          'Search error. Try again.',
        data: null,
        quickReplies: []
      };
    }
  }

  // Manejar consultas de precios
  async handlePriceInquiry(message, language) {
    const searchTerms = this.extractSearchTerms(message);
    
    if (!searchTerms) {
      return {
        text: language === 'es' ?
          '💰 ¿De qué producto quieres saber el precio?' :
          '💰 Which product would you like to know the price of?',
        data: null,
        quickReplies: [
          { title: 'iPhone', payload: 'price_iphone' },
          { title: 'MacBook', payload: 'price_macbook' },
          { title: 'Samsung', payload: 'price_samsung' }
        ]
      };
    }

    // Reutilizar lógica de búsqueda pero enfocada en precios
    return await this.handleProductSearch(message, language);
  }

  // Extraer términos de búsqueda del mensaje
  extractSearchTerms(message) {
    // Remover palabras comunes
    const stopWords = [
      'busco', 'necesito', 'quiero', 'precio', 'costo', 'cuánto',
      'search', 'need', 'want', 'price', 'cost', 'how much',
      'de', 'del', 'la', 'el', 'un', 'una', 'for', 'the', 'a', 'an'
    ];

    const words = message.toLowerCase().split(/\s+/)
      .filter(word => word.length > 2 && !stopWords.includes(word));

    return words.length > 0 ? words.join(' ') : null;
  }

  // Obtener título de quick reply
  getQuickReplyTitle(followUp, language) {
    const titles = {
      es: {
        products: '📱 Productos',
        orders: '📦 Pedidos',
        payment: '💳 Pagos',
        shipping: '🚚 Envío',
        support: '🆘 Soporte'
      },
      en: {
        products: '📱 Products',
        orders: '📦 Orders',
        payment: '💳 Payment',
        shipping: '🚚 Shipping',
        support: '🆘 Support'
      }
    };

    return titles[language][followUp] || followUp;
  }

  // Obtener historial de conversación
  getConversationHistory(userId) {
    const context = this.contexts.get(userId);
    return context?.conversationHistory || [];
  }

  // Limpiar contexto de usuario
  clearUserContext(userId) {
    this.contexts.delete(userId);
    return true;
  }

  // Obtener estadísticas del chatbot
  getStats() {
    const totalConversations = this.contexts.size;
    const intentsCount = {};

    for (const context of this.contexts.values()) {
      for (const message of context.conversationHistory) {
        if (message.type === 'bot' && message.intent) {
          intentsCount[message.intent] = (intentsCount[message.intent] || 0) + 1;
        }
      }
    }

    return {
      totalConversations,
      intentsCount,
      totalIntents: this.intents.size
    };
  }
}

module.exports = new ChatbotService();