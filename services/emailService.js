const nodemailer = require('nodemailer');
const fs = require('fs');
const path = require('path');
const handlebars = require('handlebars');

class EmailService {
  constructor() {
    this.transporter = nodemailer.createTransporter({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });
  }

  async loadTemplate(templateName, data) {
    try {
      const templatePath = path.join(__dirname, '../templates/email', `${templateName}.hbs`);
      const templateSource = fs.readFileSync(templatePath, 'utf8');
      const template = handlebars.compile(templateSource);
      return template(data);
    } catch (error) {
      console.error('Error loading email template:', error);
      return null;
    }
  }

  async sendWelcomeEmail(user) {
    const html = await this.loadTemplate('welcome', {
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      loginUrl: `${process.env.FRONTEND_URL}/login`
    });

    const mailOptions = {
      from: `"Tech Store Cuba" <${process.env.EMAIL_USER}>`,
      to: user.email,
      subject: '¡Bienvenido a Tech Store Cuba! 🛒',
      html
    };

    return await this.transporter.sendMail(mailOptions);
  }

  async sendOrderConfirmation(user, order) {
    const html = await this.loadTemplate('order-confirmation', {
      firstName: user.firstName,
      orderNumber: order.orderNumber,
      items: order.items,
      total: order.total,
      shippingAddress: order.shippingAddress,
      trackingUrl: `${process.env.FRONTEND_URL}/orders/${order._id}`
    });

    const mailOptions = {
      from: `"Tech Store Cuba" <${process.env.EMAIL_USER}>`,
      to: user.email,
      subject: `Confirmación de Pedido #${order.orderNumber}`,
      html
    };

    return await this.transporter.sendMail(mailOptions);
  }

  async sendOrderStatusUpdate(user, order, previousStatus) {
    const statusMessages = {
      confirmed: '✅ Tu pedido ha sido confirmado',
      processing: '📦 Tu pedido está siendo procesado',
      shipped: '🚚 Tu pedido ha sido enviado',
      delivered: '🎉 Tu pedido ha sido entregado',
      cancelled: '❌ Tu pedido ha sido cancelado'
    };

    const html = await this.loadTemplate('order-status-update', {
      firstName: user.firstName,
      orderNumber: order.orderNumber,
      status: order.status,
      statusMessage: statusMessages[order.status],
      trackingNumber: order.trackingNumber,
      estimatedDelivery: order.estimatedDelivery,
      trackingUrl: `${process.env.FRONTEND_URL}/orders/${order._id}`
    });

    const mailOptions = {
      from: `"Tech Store Cuba" <${process.env.EMAIL_USER}>`,
      to: user.email,
      subject: `Actualización de Pedido #${order.orderNumber}`,
      html
    };

    return await this.transporter.sendMail(mailOptions);
  }

  async sendPaymentConfirmation(user, order) {
    const html = await this.loadTemplate('payment-confirmation', {
      firstName: user.firstName,
      orderNumber: order.orderNumber,
      paymentMethod: order.paymentMethod,
      total: order.total,
      transactionId: order.paymentDetails?.transactionId
    });

    const mailOptions = {
      from: `"Tech Store Cuba" <${process.env.EMAIL_USER}>`,
      to: user.email,
      subject: `Pago Confirmado - Pedido #${order.orderNumber}`,
      html
    };

    return await this.transporter.sendMail(mailOptions);
  }

  async sendPasswordReset(user, resetToken) {
    const html = await this.loadTemplate('password-reset', {
      firstName: user.firstName,
      resetUrl: `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`,
      expiryTime: '1 hora'
    });

    const mailOptions = {
      from: `"Tech Store Cuba" <${process.env.EMAIL_USER}>`,
      to: user.email,
      subject: 'Restablecer Contraseña - Tech Store Cuba',
      html
    };

    return await this.transporter.sendMail(mailOptions);
  }

  async sendNewsletter(subscribers, newsletter) {
    const html = await this.loadTemplate('newsletter', {
      title: newsletter.title,
      content: newsletter.content,
      featuredProducts: newsletter.featuredProducts,
      offers: newsletter.offers,
      unsubscribeUrl: `${process.env.FRONTEND_URL}/unsubscribe`
    });

    const promises = subscribers.map(subscriber => {
      const mailOptions = {
        from: `"Tech Store Cuba" <${process.env.EMAIL_USER}>`,
        to: subscriber.email,
        subject: newsletter.title,
        html: html.replace('{{unsubscribeUrl}}', `${process.env.FRONTEND_URL}/unsubscribe?token=${subscriber.unsubscribeToken}`)
      };
      return this.transporter.sendMail(mailOptions);
    });

    return await Promise.all(promises);
  }

  async sendLowStockAlert(admins, product) {
    const html = await this.loadTemplate('low-stock-alert', {
      productName: product.name.es,
      currentStock: product.stock,
      productUrl: `${process.env.FRONTEND_URL}/admin/products/${product._id}`
    });

    const promises = admins.map(admin => {
      const mailOptions = {
        from: `"Tech Store Cuba" <${process.env.EMAIL_USER}>`,
        to: admin.email,
        subject: `⚠️ Stock Bajo: ${product.name.es}`,
        html
      };
      return this.transporter.sendMail(mailOptions);
    });

    return await Promise.all(promises);
  }

  async sendAbandonedCartReminder(user, cartItems) {
    const html = await this.loadTemplate('abandoned-cart', {
      firstName: user.firstName,
      cartItems,
      cartUrl: `${process.env.FRONTEND_URL}/cart`,
      totalItems: cartItems.length
    });

    const mailOptions = {
      from: `"Tech Store Cuba" <${process.env.EMAIL_USER}>`,
      to: user.email,
      subject: '🛒 ¡No olvides tu carrito!',
      html
    };

    return await this.transporter.sendMail(mailOptions);
  }

  async sendBirthdayOffer(user, coupon) {
    const html = await this.loadTemplate('birthday-offer', {
      firstName: user.firstName,
      couponCode: coupon.code,
      discount: coupon.discount,
      expiryDate: coupon.expiresAt,
      shopUrl: `${process.env.FRONTEND_URL}/products`
    });

    const mailOptions = {
      from: `"Tech Store Cuba" <${process.env.EMAIL_USER}>`,
      to: user.email,
      subject: '🎉 ¡Feliz Cumpleaños! Tienes un regalo especial',
      html
    };

    return await this.transporter.sendMail(mailOptions);
  }

  async sendReviewRequest(user, order) {
    const html = await this.loadTemplate('review-request', {
      firstName: user.firstName,
      orderNumber: order.orderNumber,
      items: order.items,
      reviewUrl: `${process.env.FRONTEND_URL}/orders/${order._id}/review`
    });

    const mailOptions = {
      from: `"Tech Store Cuba" <${process.env.EMAIL_USER}>`,
      to: user.email,
      subject: '⭐ ¿Cómo fue tu experiencia? Comparte tu opinión',
      html
    };

    return await this.transporter.sendMail(mailOptions);
  }
}

module.exports = new EmailService();