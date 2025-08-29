#!/usr/bin/env node

// Script para configurar datos iniciales en Render
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Importar modelos
const User = require('../models/User');
const Product = require('../models/Product');
const Coupon = require('../models/Coupon');

const sampleProducts = [
  {
    name: {
      es: "iPhone 14 Pro Max 128GB",
      en: "iPhone 14 Pro Max 128GB",
      fr: "iPhone 14 Pro Max 128GB"
    },
    description: {
      es: "El iPhone más avanzado con cámara profesional de 48MP y chip A16 Bionic",
      en: "The most advanced iPhone with 48MP Pro camera system and A16 Bionic chip",
      fr: "L'iPhone le plus avancé avec système de caméra Pro 48MP et puce A16 Bionic"
    },
    category: "phone",
    subcategory: "smartphone",
    brand: "Apple",
    model: "iPhone 14 Pro Max",
    price: 52000,
    currency: "CUP",
    specifications: {
      processor: "A16 Bionic",
      ram: "6GB",
      storage: "128GB",
      screenSize: "6.7 pulgadas",
      operatingSystem: "iOS 16",
      color: "Deep Purple",
      connectivity: ["5G", "WiFi 6", "Bluetooth 5.3"]
    },
    images: ["/images/iphone-14-pro-max.jpg"],
    stock: 15,
    featured: true,
    isActive: true
  },
  {
    name: {
      es: "MacBook Air M2 13 pulgadas",
      en: "MacBook Air M2 13-inch",
      fr: "MacBook Air M2 13 pouces"
    },
    description: {
      es: "Potente y ultraportátil con chip M2 de Apple y hasta 18 horas de batería",
      en: "Powerful and ultraportable with Apple M2 chip and up to 18 hours of battery",
      fr: "Puissant et ultraportable avec puce Apple M2 et jusqu'à 18 heures d'autonomie"
    },
    category: "laptop",
    subcategory: "ultrabook",
    brand: "Apple",
    model: "MacBook Air M2",
    price: 75000,
    currency: "CUP",
    specifications: {
      processor: "Apple M2",
      ram: "8GB",
      storage: "256GB SSD",
      screenSize: "13.6 pulgadas",
      operatingSystem: "macOS",
      color: "Space Gray",
      weight: "1.24 kg"
    },
    images: ["/images/macbook-air-m2.jpg"],
    stock: 8,
    featured: true,
    isActive: true
  },
  {
    name: {
      es: "Samsung Galaxy S23 Ultra",
      en: "Samsung Galaxy S23 Ultra",
      fr: "Samsung Galaxy S23 Ultra"
    },
    description: {
      es: "El smartphone más potente de Samsung con S Pen integrado y cámara de 200MP",
      en: "Samsung's most powerful smartphone with built-in S Pen and 200MP camera",
      fr: "Le smartphone le plus puissant de Samsung avec S Pen intégré et caméra 200MP"
    },
    category: "phone",
    subcategory: "smartphone",
    brand: "Samsung",
    model: "Galaxy S23 Ultra",
    price: 48000,
    currency: "CUP",
    specifications: {
      processor: "Snapdragon 8 Gen 2",
      ram: "12GB",
      storage: "256GB",
      screenSize: "6.8 pulgadas",
      operatingSystem: "Android 13",
      color: "Phantom Black",
      connectivity: ["5G", "WiFi 6E", "Bluetooth 5.3"]
    },
    images: ["/images/samsung-s23-ultra.jpg"],
    stock: 12,
    featured: true,
    isActive: true
  },
  {
    name: {
      es: "Laptop Gaming ASUS ROG Strix G15",
      en: "ASUS ROG Strix G15 Gaming Laptop",
      fr: "Ordinateur portable gaming ASUS ROG Strix G15"
    },
    description: {
      es: "Laptop gaming de alto rendimiento con RTX 4060 y procesador AMD Ryzen 7",
      en: "High-performance gaming laptop with RTX 4060 and AMD Ryzen 7 processor",
      fr: "Ordinateur portable gaming haute performance avec RTX 4060 et processeur AMD Ryzen 7"
    },
    category: "laptop",
    subcategory: "gaming",
    brand: "ASUS",
    model: "ROG Strix G15",
    price: 65000,
    currency: "CUP",
    specifications: {
      processor: "AMD Ryzen 7 7735HS",
      ram: "16GB DDR5",
      storage: "512GB NVMe SSD",
      screenSize: "15.6 pulgadas 144Hz",
      graphics: "RTX 4060 8GB",
      operatingSystem: "Windows 11",
      color: "Eclipse Gray"
    },
    images: ["/images/asus-rog-strix-g15.jpg"],
    stock: 6,
    featured: true,
    isActive: true,
    discount: {
      percentage: 10,
      startDate: new Date(),
      endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
    }
  },
  {
    name: {
      es: "AirPods Pro 2da Generación",
      en: "AirPods Pro 2nd Generation",
      fr: "AirPods Pro 2ème génération"
    },
    description: {
      es: "Auriculares inalámbricos con cancelación activa de ruido y audio espacial",
      en: "Wireless earbuds with active noise cancellation and spatial audio",
      fr: "Écouteurs sans fil avec suppression active du bruit et audio spatial"
    },
    category: "accessories",
    subcategory: "audio",
    brand: "Apple",
    model: "AirPods Pro 2",
    price: 8500,
    currency: "CUP",
    specifications: {
      connectivity: ["Bluetooth 5.3"],
      batteryLife: "6 horas + 24 horas con estuche",
      features: ["Cancelación activa de ruido", "Audio espacial", "Resistente al agua IPX4"],
      color: "White"
    },
    images: ["/images/airpods-pro-2.jpg"],
    stock: 25,
    featured: false,
    isActive: true
  },
  {
    name: {
      es: "PC Gamer AMD Ryzen 5 + RTX 4060",
      en: "Gaming PC AMD Ryzen 5 + RTX 4060",
      fr: "PC Gaming AMD Ryzen 5 + RTX 4060"
    },
    description: {
      es: "Computadora gaming completa lista para jugar los títulos más exigentes",
      en: "Complete gaming computer ready to play the most demanding titles",
      fr: "Ordinateur gaming complet prêt pour les titres les plus exigeants"
    },
    category: "desktop",
    subcategory: "gaming",
    brand: "Custom Build",
    model: "Gaming Pro 2024",
    price: 45000,
    currency: "CUP",
    specifications: {
      processor: "AMD Ryzen 5 7600X",
      ram: "16GB DDR5",
      storage: "1TB NVMe SSD",
      graphics: "RTX 4060 8GB",
      motherboard: "B650M",
      powerSupply: "650W 80+ Gold",
      case: "Mid Tower RGB",
      operatingSystem: "Windows 11"
    },
    images: ["/images/pc-gaming-ryzen5.jpg"],
    stock: 4,
    featured: true,
    isActive: true
  }
];

async function setupRender() {
  try {
    console.log('🔗 Conectando a MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Conectado a MongoDB');

    // Crear usuario administrador
    console.log('👤 Creando usuario administrador...');
    const adminExists = await User.findOne({ email: 'admin@techstorecuba.com' });
    
    if (!adminExists) {
      const admin = new User({
        firstName: 'Admin',
        lastName: 'Tech Store',
        email: 'admin@techstorecuba.com',
        password: 'TechStore2024!',
        role: 'admin',
        preferredLanguage: 'es',
        isActive: true
      });
      await admin.save();
      console.log('✅ Usuario administrador creado');
      console.log('📧 Email: admin@techstorecuba.com');
      console.log('🔑 Password: TechStore2024!');
    } else {
      console.log('ℹ️  Usuario administrador ya existe');
    }

    // Crear productos de ejemplo
    console.log('📱 Creando productos de ejemplo...');
    const existingProducts = await Product.countDocuments();
    
    if (existingProducts === 0) {
      await Product.insertMany(sampleProducts);
      console.log(`✅ ${sampleProducts.length} productos creados`);
    } else {
      console.log(`ℹ️  Ya existen ${existingProducts} productos`);
    }

    // Crear cupón de bienvenida
    console.log('🎫 Creando cupón de bienvenida...');
    const welcomeCouponExists = await Coupon.findOne({ code: 'BIENVENIDO2024' });
    
    if (!welcomeCouponExists) {
      const welcomeCoupon = new Coupon({
        code: 'BIENVENIDO2024',
        name: {
          es: 'Cupón de Bienvenida',
          en: 'Welcome Coupon',
          fr: 'Coupon de Bienvenue'
        },
        description: {
          es: 'Descuento especial para nuevos usuarios de Tech Store Cuba',
          en: 'Special discount for new Tech Store Cuba users',
          fr: 'Remise spéciale pour les nouveaux utilisateurs de Tech Store Cuba'
        },
        type: 'percentage',
        value: 15,
        minimumAmount: 1000,
        usageLimit: {
          total: 1000,
          perUser: 1
        },
        validFrom: new Date(),
        validUntil: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000), // 90 días
        userRestrictions: {
          newUsersOnly: true
        },
        isActive: true,
        createdBy: (await User.findOne({ role: 'admin' }))._id,
        tags: ['welcome', 'new-user', 'launch']
      });
      
      await welcomeCoupon.save();
      console.log('✅ Cupón de bienvenida creado: BIENVENIDO2024');
    } else {
      console.log('ℹ️  Cupón de bienvenida ya existe');
    }

    console.log('🎉 Setup de Render completado exitosamente!');
    console.log('');
    console.log('🌐 Tu tienda está lista en:');
    console.log(`📱 Frontend: ${process.env.FRONTEND_URL || 'https://tu-app.onrender.com'}`);
    console.log(`🔧 API: ${process.env.FRONTEND_URL || 'https://tu-app.onrender.com'}/api`);
    console.log('');
    console.log('🔐 Credenciales de administrador:');
    console.log('📧 Email: admin@techstorecuba.com');
    console.log('🔑 Password: TechStore2024!');
    console.log('');
    console.log('🎫 Cupón disponible: BIENVENIDO2024 (15% descuento)');

  } catch (error) {
    console.error('❌ Error en setup de Render:', error);
    process.exit(1);
  } finally {
    await mongoose.connection.close();
    console.log('🔌 Desconectado de MongoDB');
    process.exit(0);
  }
}

// Ejecutar setup si se llama directamente
if (require.main === module) {
  setupRender();
}

module.exports = setupRender;