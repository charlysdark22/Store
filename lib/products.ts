export interface Product {
  id: string
  name: string
  slug: string
  description: string
  shortDescription: string
  price: number
  comparePrice?: number
  images: string[]
  category: string
  categorySlug: string
  brand: string
  model: string
  sku: string
  inStock: boolean
  quantity: number
  specifications: Record<string, string>
  rating: number
  reviewCount: number
  isFeatured: boolean
  isNew: boolean
  tags: string[]
}

export interface Category {
  id: string
  name: string
  slug: string
  description: string
  image: string
  productCount: number
}

// Datos de ejemplo de productos
export const mockProducts: Product[] = [
  // Computadoras de Escritorio
  {
    id: "1",
    name: "Gaming PC RTX 4070 Super",
    slug: "gaming-pc-rtx-4070-super",
    description:
      "Potente PC gaming con procesador Intel Core i7-13700F, tarjeta gráfica RTX 4070 Super, 32GB RAM DDR4 y SSD NVMe de 1TB. Ideal para gaming en 4K y streaming.",
    shortDescription: "PC gaming de alta gama con RTX 4070 Super",
    price: 45000,
    comparePrice: 50000,
    images: [
      "/placeholder.svg?height=600&width=600&text=Gaming+PC+RTX+4070",
      "/placeholder.svg?height=600&width=600&text=Gaming+PC+Interior",
      "/placeholder.svg?height=600&width=600&text=Gaming+PC+RGB",
    ],
    category: "Computadoras de Escritorio",
    categorySlug: "computadoras-escritorio",
    brand: "Custom Build",
    model: "RTX4070-i7",
    sku: "PC-RTX4070-001",
    inStock: true,
    quantity: 5,
    specifications: {
      Procesador: "Intel Core i7-13700F",
      "Tarjeta Gráfica": "NVIDIA RTX 4070 Super 12GB",
      "Memoria RAM": "32GB DDR4 3200MHz",
      Almacenamiento: "1TB NVMe SSD + 2TB HDD",
      "Placa Madre": "MSI B760 Gaming Plus",
      Fuente: "750W 80+ Gold Modular",
      Gabinete: "Mid Tower RGB",
    },
    rating: 4.8,
    reviewCount: 24,
    isFeatured: true,
    isNew: false,
    tags: ["gaming", "rtx", "intel", "rgb"],
  },
  {
    id: "2",
    name: "PC Oficina Intel i5",
    slug: "pc-oficina-intel-i5",
    description:
      "Computadora ideal para oficina con procesador Intel Core i5-12400, 16GB RAM, SSD de 512GB y gráficos integrados. Perfecta para trabajo, navegación y aplicaciones de oficina.",
    shortDescription: "PC para oficina y trabajo profesional",
    price: 25000,
    images: [
      "/placeholder.svg?height=600&width=600&text=PC+Oficina+i5",
      "/placeholder.svg?height=600&width=600&text=PC+Oficina+Setup",
    ],
    category: "Computadoras de Escritorio",
    categorySlug: "computadoras-escritorio",
    brand: "Custom Build",
    model: "Office-i5",
    sku: "PC-OFF-i5-001",
    inStock: true,
    quantity: 12,
    specifications: {
      Procesador: "Intel Core i5-12400",
      "Tarjeta Gráfica": "Intel UHD Graphics 730",
      "Memoria RAM": "16GB DDR4 3200MHz",
      Almacenamiento: "512GB NVMe SSD",
      "Placa Madre": "ASUS Prime B660M-A",
      Fuente: "500W 80+ Bronze",
      Gabinete: "Micro ATX Compacto",
    },
    rating: 4.5,
    reviewCount: 18,
    isFeatured: false,
    isNew: false,
    tags: ["oficina", "intel", "compacto"],
  },
  // Laptops
  {
    id: "3",
    name: 'MacBook Air M2 13"',
    slug: "macbook-air-m2-13",
    description:
      "La nueva MacBook Air con chip M2 de Apple ofrece un rendimiento excepcional con hasta 18 horas de batería. Pantalla Liquid Retina de 13.6 pulgadas, 8GB RAM unificada y SSD de 256GB.",
    shortDescription: "Laptop ultradelgada con chip M2 de Apple",
    price: 65000,
    images: [
      "/placeholder.svg?height=600&width=600&text=MacBook+Air+M2",
      "/placeholder.svg?height=600&width=600&text=MacBook+Air+Profile",
      "/placeholder.svg?height=600&width=600&text=MacBook+Air+Screen",
    ],
    category: "Laptops",
    categorySlug: "laptops",
    brand: "Apple",
    model: "MacBook Air M2",
    sku: "MBA-M2-256-001",
    inStock: true,
    quantity: 8,
    specifications: {
      Procesador: "Apple M2 8-core CPU",
      "Tarjeta Gráfica": "Apple M2 8-core GPU",
      "Memoria RAM": "8GB RAM unificada",
      Almacenamiento: "256GB SSD",
      Pantalla: '13.6" Liquid Retina (2560x1664)',
      Batería: "Hasta 18 horas",
      Peso: "1.24 kg",
    },
    rating: 4.9,
    reviewCount: 32,
    isFeatured: true,
    isNew: false,
    tags: ["apple", "m2", "ultrabook", "premium"],
  },
  {
    id: "4",
    name: "Gaming Laptop RTX 4060",
    slug: "gaming-laptop-rtx-4060",
    description:
      'Laptop gaming con procesador AMD Ryzen 7 7735HS, RTX 4060 8GB, 16GB RAM DDR5 y pantalla de 15.6" 144Hz. Ideal para gaming portátil de alta calidad.',
    shortDescription: "Laptop gaming con RTX 4060 y pantalla 144Hz",
    price: 55000,
    comparePrice: 60000,
    images: [
      "/placeholder.svg?height=600&width=600&text=Gaming+Laptop+RTX4060",
      "/placeholder.svg?height=600&width=600&text=Gaming+Laptop+RGB",
      "/placeholder.svg?height=600&width=600&text=Gaming+Laptop+Screen",
    ],
    category: "Laptops",
    categorySlug: "laptops",
    brand: "ASUS",
    model: "ROG Strix G15",
    sku: "LAP-ROG-RTX4060-001",
    inStock: true,
    quantity: 6,
    specifications: {
      Procesador: "AMD Ryzen 7 7735HS",
      "Tarjeta Gráfica": "NVIDIA RTX 4060 8GB",
      "Memoria RAM": "16GB DDR5 4800MHz",
      Almacenamiento: "1TB NVMe SSD",
      Pantalla: '15.6" FHD 144Hz IPS',
      Batería: "90Wh",
      Peso: "2.3 kg",
    },
    rating: 4.7,
    reviewCount: 28,
    isFeatured: true,
    isNew: true,
    tags: ["gaming", "rtx", "amd", "144hz"],
  },
  // Teléfonos
  {
    id: "5",
    name: "iPhone 15 Pro 128GB",
    slug: "iphone-15-pro-128gb",
    description:
      "El iPhone 15 Pro con chip A17 Pro, cámara principal de 48MP, zoom óptico 3x y construcción en titanio. Pantalla Super Retina XDR de 6.1 pulgadas con Dynamic Island.",
    shortDescription: "iPhone 15 Pro con chip A17 Pro y titanio",
    price: 85000,
    images: [
      "/placeholder.svg?height=600&width=600&text=iPhone+15+Pro",
      "/placeholder.svg?height=600&width=600&text=iPhone+15+Pro+Camera",
      "/placeholder.svg?height=600&width=600&text=iPhone+15+Pro+Colors",
    ],
    category: "Teléfonos",
    categorySlug: "telefonos",
    brand: "Apple",
    model: "iPhone 15 Pro",
    sku: "IPH-15PRO-128-001",
    inStock: true,
    quantity: 15,
    specifications: {
      Procesador: "Apple A17 Pro",
      Pantalla: '6.1" Super Retina XDR OLED',
      Cámara: "48MP + 12MP + 12MP",
      Almacenamiento: "128GB",
      RAM: "8GB",
      Batería: "3274 mAh",
      Material: "Titanio",
    },
    rating: 4.8,
    reviewCount: 45,
    isFeatured: true,
    isNew: true,
    tags: ["iphone", "apple", "pro", "titanio"],
  },
  {
    id: "6",
    name: "Samsung Galaxy S24 Ultra",
    slug: "samsung-galaxy-s24-ultra",
    description:
      "Samsung Galaxy S24 Ultra con S Pen integrado, cámara de 200MP, zoom óptico 10x y pantalla Dynamic AMOLED 2X de 6.8 pulgadas. Potenciado por Snapdragon 8 Gen 3.",
    shortDescription: "Galaxy S24 Ultra con S Pen y cámara 200MP",
    price: 75000,
    images: [
      "/placeholder.svg?height=600&width=600&text=Galaxy+S24+Ultra",
      "/placeholder.svg?height=600&width=600&text=Galaxy+S24+S+Pen",
      "/placeholder.svg?height=600&width=600&text=Galaxy+S24+Camera",
    ],
    category: "Teléfonos",
    categorySlug: "telefonos",
    brand: "Samsung",
    model: "Galaxy S24 Ultra",
    sku: "SAM-S24U-256-001",
    inStock: true,
    quantity: 10,
    specifications: {
      Procesador: "Snapdragon 8 Gen 3",
      Pantalla: '6.8" Dynamic AMOLED 2X',
      Cámara: "200MP + 50MP + 12MP + 10MP",
      Almacenamiento: "256GB",
      RAM: "12GB",
      Batería: "5000 mAh",
      "S Pen": "Incluido",
    },
    rating: 4.7,
    reviewCount: 38,
    isFeatured: true,
    isNew: false,
    tags: ["samsung", "android", "s-pen", "ultra"],
  },
  // Accesorios
  {
    id: "7",
    name: "Teclado Mecánico RGB",
    slug: "teclado-mecanico-rgb",
    description:
      "Teclado mecánico gaming con switches Cherry MX Red, iluminación RGB personalizable, teclas anti-ghosting y construcción de aluminio premium.",
    shortDescription: "Teclado mecánico gaming con RGB",
    price: 3500,
    images: [
      "/placeholder.svg?height=600&width=600&text=Teclado+Mecánico+RGB",
      "/placeholder.svg?height=600&width=600&text=Teclado+RGB+Lights",
    ],
    category: "Accesorios PC",
    categorySlug: "accesorios-pc",
    brand: "Corsair",
    model: "K70 RGB Pro",
    sku: "ACC-KB-RGB-001",
    inStock: true,
    quantity: 20,
    specifications: {
      Switches: "Cherry MX Red",
      Iluminación: "RGB por tecla",
      Conectividad: "USB-C",
      Material: "Aluminio",
      Layout: "Español",
      "Anti-ghosting": "Sí",
      Software: "iCUE",
    },
    rating: 4.6,
    reviewCount: 15,
    isFeatured: false,
    isNew: false,
    tags: ["teclado", "mecánico", "rgb", "gaming"],
  },
  {
    id: "8",
    name: "Mouse Gaming Inalámbrico",
    slug: "mouse-gaming-inalambrico",
    description:
      "Mouse gaming inalámbrico con sensor óptico de 25,600 DPI, 11 botones programables, batería de 70 horas y carga rápida.",
    shortDescription: "Mouse gaming inalámbrico de alta precisión",
    price: 2800,
    images: [
      "/placeholder.svg?height=600&width=600&text=Mouse+Gaming+Wireless",
      "/placeholder.svg?height=600&width=600&text=Mouse+Gaming+RGB",
    ],
    category: "Accesorios PC",
    categorySlug: "accesorios-pc",
    brand: "Logitech",
    model: "G Pro X Superlight",
    sku: "ACC-MS-GPRO-001",
    inStock: true,
    quantity: 25,
    specifications: {
      Sensor: "HERO 25K (25,600 DPI)",
      Conectividad: "LIGHTSPEED Wireless",
      Batería: "70 horas",
      Peso: "63 gramos",
      Botones: "5 programables",
      "Polling Rate": "1000 Hz",
      Pies: "PTFE",
    },
    rating: 4.8,
    reviewCount: 22,
    isFeatured: false,
    isNew: false,
    tags: ["mouse", "gaming", "inalámbrico", "pro"],
  },
]

export const mockCategories: Category[] = [
  {
    id: "1",
    name: "Computadoras de Escritorio",
    slug: "computadoras-escritorio",
    description: "PCs de escritorio para gaming, trabajo y uso general",
    image: "/placeholder.svg?height=300&width=400&text=Computadoras",
    productCount: 2,
  },
  {
    id: "2",
    name: "Laptops",
    slug: "laptops",
    description: "Laptops y notebooks para trabajo, estudio y gaming",
    image: "/placeholder.svg?height=300&width=400&text=Laptops",
    productCount: 2,
  },
  {
    id: "3",
    name: "Teléfonos",
    slug: "telefonos",
    description: "Smartphones y teléfonos móviles de última generación",
    image: "/placeholder.svg?height=300&width=400&text=Teléfonos",
    productCount: 2,
  },
  {
    id: "4",
    name: "Accesorios PC",
    slug: "accesorios-pc",
    description: "Accesorios para computadoras: teclados, mouse, monitores",
    image: "/placeholder.svg?height=300&width=400&text=Accesorios",
    productCount: 2,
  },
]

// Funciones de utilidad
export function getProductsByCategory(categorySlug: string): Product[] {
  return mockProducts.filter((product) => product.categorySlug === categorySlug)
}

export function getProductBySlug(slug: string): Product | undefined {
  return mockProducts.find((product) => product.slug === slug)
}

export function getFeaturedProducts(): Product[] {
  return mockProducts.filter((product) => product.isFeatured)
}

export function searchProducts(query: string): Product[] {
  const lowercaseQuery = query.toLowerCase()
  return mockProducts.filter(
    (product) =>
      product.name.toLowerCase().includes(lowercaseQuery) ||
      product.description.toLowerCase().includes(lowercaseQuery) ||
      product.brand.toLowerCase().includes(lowercaseQuery) ||
      product.tags.some((tag) => tag.toLowerCase().includes(lowercaseQuery)),
  )
}

export function filterProducts(
  products: Product[],
  filters: {
    minPrice?: number
    maxPrice?: number
    brands?: string[]
    inStock?: boolean
  },
): Product[] {
  return products.filter((product) => {
    if (filters.minPrice && product.price < filters.minPrice) return false
    if (filters.maxPrice && product.price > filters.maxPrice) return false
    if (filters.brands && filters.brands.length > 0 && !filters.brands.includes(product.brand)) return false
    if (filters.inStock && !product.inStock) return false
    return true
  })
}
