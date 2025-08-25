"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"

export type Language = "es" | "en" | "fr" | "pt" | "it"

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: string) => string
}

const translations = {
  es: {
    // Navigation
    "nav.home": "Inicio",
    "nav.products": "Productos",
    "nav.cart": "Carrito",
    "nav.login": "Iniciar Sesión",
    "nav.register": "Registrarse",
    "nav.logout": "Cerrar Sesión",
    "nav.admin": "Administrador",

    // Home
    "home.title": "TechStore Cuba",
    "home.subtitle": "Tu tienda de tecnología de confianza",
    "home.description": "Encuentra las mejores computadoras, laptops, teléfonos y accesorios con envío a toda Cuba",
    "home.shop_now": "Comprar Ahora",
    "home.featured_products": "Productos Destacados",

    // Products
    "products.title": "Productos",
    "products.search": "Buscar productos...",
    "products.filter_category": "Filtrar por categoría",
    "products.filter_price": "Filtrar por precio",
    "products.all_categories": "Todas las categorías",
    "products.add_to_cart": "Agregar al Carrito",
    "products.view_details": "Ver Detalles",
    "products.specifications": "Especificaciones",
    "products.related": "Productos Relacionados",

    // Cart
    "cart.title": "Carrito de Compras",
    "cart.empty": "Tu carrito está vacío",
    "cart.continue_shopping": "Continuar Comprando",
    "cart.quantity": "Cantidad",
    "cart.remove": "Eliminar",
    "cart.subtotal": "Subtotal",
    "cart.total": "Total",
    "cart.checkout": "Proceder al Pago",

    // Auth
    "auth.login": "Iniciar Sesión",
    "auth.register": "Registrarse",
    "auth.email": "Correo Electrónico",
    "auth.password": "Contraseña",
    "auth.confirm_password": "Confirmar Contraseña",
    "auth.full_name": "Nombre Completo",
    "auth.phone": "Teléfono",

    // Payment
    "payment.title": "Métodos de Pago",
    "payment.transfermovil": "Transfermóvil",
    "payment.enzona": "Enzona",
    "payment.select_bank": "Seleccionar Banco",
    "payment.scan_qr": "Escanea el código QR",
    "payment.confirm": "Confirmar Pago",

    // Admin
    "admin.dashboard": "Panel de Control",
    "admin.products": "Gestión de Productos",
    "admin.orders": "Gestión de Pedidos",
    "admin.users": "Usuarios",

    // Common
    "common.loading": "Cargando...",
    "common.error": "Error",
    "common.success": "Éxito",
    "common.cancel": "Cancelar",
    "common.save": "Guardar",
    "common.edit": "Editar",
    "common.delete": "Eliminar",
    "common.back": "Volver",
    "common.next": "Siguiente",
    "common.previous": "Anterior",
  },
  en: {
    // Navigation
    "nav.home": "Home",
    "nav.products": "Products",
    "nav.cart": "Cart",
    "nav.login": "Login",
    "nav.register": "Register",
    "nav.logout": "Logout",
    "nav.admin": "Admin",

    // Home
    "home.title": "TechStore Cuba",
    "home.subtitle": "Your trusted technology store",
    "home.description": "Find the best computers, laptops, phones and accessories with shipping throughout Cuba",
    "home.shop_now": "Shop Now",
    "home.featured_products": "Featured Products",

    // Products
    "products.title": "Products",
    "products.search": "Search products...",
    "products.filter_category": "Filter by category",
    "products.filter_price": "Filter by price",
    "products.all_categories": "All categories",
    "products.add_to_cart": "Add to Cart",
    "products.view_details": "View Details",
    "products.specifications": "Specifications",
    "products.related": "Related Products",

    // Cart
    "cart.title": "Shopping Cart",
    "cart.empty": "Your cart is empty",
    "cart.continue_shopping": "Continue Shopping",
    "cart.quantity": "Quantity",
    "cart.remove": "Remove",
    "cart.subtotal": "Subtotal",
    "cart.total": "Total",
    "cart.checkout": "Checkout",

    // Auth
    "auth.login": "Login",
    "auth.register": "Register",
    "auth.email": "Email",
    "auth.password": "Password",
    "auth.confirm_password": "Confirm Password",
    "auth.full_name": "Full Name",
    "auth.phone": "Phone",

    // Payment
    "payment.title": "Payment Methods",
    "payment.transfermovil": "Transfermóvil",
    "payment.enzona": "Enzona",
    "payment.select_bank": "Select Bank",
    "payment.scan_qr": "Scan QR Code",
    "payment.confirm": "Confirm Payment",

    // Admin
    "admin.dashboard": "Dashboard",
    "admin.products": "Product Management",
    "admin.orders": "Order Management",
    "admin.users": "Users",

    // Common
    "common.loading": "Loading...",
    "common.error": "Error",
    "common.success": "Success",
    "common.cancel": "Cancel",
    "common.save": "Save",
    "common.edit": "Edit",
    "common.delete": "Delete",
    "common.back": "Back",
    "common.next": "Next",
    "common.previous": "Previous",
  },
  fr: {
    // Navigation
    "nav.home": "Accueil",
    "nav.products": "Produits",
    "nav.cart": "Panier",
    "nav.login": "Connexion",
    "nav.register": "S'inscrire",
    "nav.logout": "Déconnexion",
    "nav.admin": "Admin",

    // Home
    "home.title": "TechStore Cuba",
    "home.subtitle": "Votre magasin de technologie de confiance",
    "home.description":
      "Trouvez les meilleurs ordinateurs, laptops, téléphones et accessoires avec livraison dans tout Cuba",
    "home.shop_now": "Acheter Maintenant",
    "home.featured_products": "Produits Vedettes",

    // Products
    "products.title": "Produits",
    "products.search": "Rechercher des produits...",
    "products.filter_category": "Filtrer par catégorie",
    "products.filter_price": "Filtrer par prix",
    "products.all_categories": "Toutes les catégories",
    "products.add_to_cart": "Ajouter au Panier",
    "products.view_details": "Voir les Détails",
    "products.specifications": "Spécifications",
    "products.related": "Produits Connexes",

    // Cart
    "cart.title": "Panier d'Achats",
    "cart.empty": "Votre panier est vide",
    "cart.continue_shopping": "Continuer les Achats",
    "cart.quantity": "Quantité",
    "cart.remove": "Supprimer",
    "cart.subtotal": "Sous-total",
    "cart.total": "Total",
    "cart.checkout": "Passer à la Caisse",

    // Auth
    "auth.login": "Connexion",
    "auth.register": "S'inscrire",
    "auth.email": "Email",
    "auth.password": "Mot de Passe",
    "auth.confirm_password": "Confirmer le Mot de Passe",
    "auth.full_name": "Nom Complet",
    "auth.phone": "Téléphone",

    // Payment
    "payment.title": "Méthodes de Paiement",
    "payment.transfermovil": "Transfermóvil",
    "payment.enzona": "Enzona",
    "payment.select_bank": "Sélectionner la Banque",
    "payment.scan_qr": "Scanner le Code QR",
    "payment.confirm": "Confirmer le Paiement",

    // Admin
    "admin.dashboard": "Tableau de Bord",
    "admin.products": "Gestion des Produits",
    "admin.orders": "Gestion des Commandes",
    "admin.users": "Utilisateurs",

    // Common
    "common.loading": "Chargement...",
    "common.error": "Erreur",
    "common.success": "Succès",
    "common.cancel": "Annuler",
    "common.save": "Sauvegarder",
    "common.edit": "Modifier",
    "common.delete": "Supprimer",
    "common.back": "Retour",
    "common.next": "Suivant",
    "common.previous": "Précédent",
  },
  pt: {
    // Navigation
    "nav.home": "Início",
    "nav.products": "Produtos",
    "nav.cart": "Carrinho",
    "nav.login": "Entrar",
    "nav.register": "Registrar",
    "nav.logout": "Sair",
    "nav.admin": "Admin",

    // Home
    "home.title": "TechStore Cuba",
    "home.subtitle": "Sua loja de tecnologia confiável",
    "home.description": "Encontre os melhores computadores, laptops, telefones e acessórios com entrega em toda Cuba",
    "home.shop_now": "Comprar Agora",
    "home.featured_products": "Produtos em Destaque",

    // Products
    "products.title": "Produtos",
    "products.search": "Buscar produtos...",
    "products.filter_category": "Filtrar por categoria",
    "products.filter_price": "Filtrar por preço",
    "products.all_categories": "Todas as categorias",
    "products.add_to_cart": "Adicionar ao Carrinho",
    "products.view_details": "Ver Detalhes",
    "products.specifications": "Especificações",
    "products.related": "Produtos Relacionados",

    // Cart
    "cart.title": "Carrinho de Compras",
    "cart.empty": "Seu carrinho está vazio",
    "cart.continue_shopping": "Continuar Comprando",
    "cart.quantity": "Quantidade",
    "cart.remove": "Remover",
    "cart.subtotal": "Subtotal",
    "cart.total": "Total",
    "cart.checkout": "Finalizar Compra",

    // Auth
    "auth.login": "Entrar",
    "auth.register": "Registrar",
    "auth.email": "Email",
    "auth.password": "Senha",
    "auth.confirm_password": "Confirmar Senha",
    "auth.full_name": "Nome Completo",
    "auth.phone": "Telefone",

    // Payment
    "payment.title": "Métodos de Pagamento",
    "payment.transfermovil": "Transfermóvil",
    "payment.enzona": "Enzona",
    "payment.select_bank": "Selecionar Banco",
    "payment.scan_qr": "Escanear Código QR",
    "payment.confirm": "Confirmar Pagamento",

    // Admin
    "admin.dashboard": "Painel de Controle",
    "admin.products": "Gestão de Produtos",
    "admin.orders": "Gestão de Pedidos",
    "admin.users": "Usuários",

    // Common
    "common.loading": "Carregando...",
    "common.error": "Erro",
    "common.success": "Sucesso",
    "common.cancel": "Cancelar",
    "common.save": "Salvar",
    "common.edit": "Editar",
    "common.delete": "Excluir",
    "common.back": "Voltar",
    "common.next": "Próximo",
    "common.previous": "Anterior",
  },
  it: {
    // Navigation
    "nav.home": "Home",
    "nav.products": "Prodotti",
    "nav.cart": "Carrello",
    "nav.login": "Accedi",
    "nav.register": "Registrati",
    "nav.logout": "Esci",
    "nav.admin": "Admin",

    // Home
    "home.title": "TechStore Cuba",
    "home.subtitle": "Il tuo negozio di tecnologia di fiducia",
    "home.description": "Trova i migliori computer, laptop, telefoni e accessori con spedizione in tutta Cuba",
    "home.shop_now": "Acquista Ora",
    "home.featured_products": "Prodotti in Evidenza",

    // Products
    "products.title": "Prodotti",
    "products.search": "Cerca prodotti...",
    "products.filter_category": "Filtra per categoria",
    "products.filter_price": "Filtra per prezzo",
    "products.all_categories": "Tutte le categorie",
    "products.add_to_cart": "Aggiungi al Carrello",
    "products.view_details": "Vedi Dettagli",
    "products.specifications": "Specifiche",
    "products.related": "Prodotti Correlati",

    // Cart
    "cart.title": "Carrello della Spesa",
    "cart.empty": "Il tuo carrello è vuoto",
    "cart.continue_shopping": "Continua lo Shopping",
    "cart.quantity": "Quantità",
    "cart.remove": "Rimuovi",
    "cart.subtotal": "Subtotale",
    "cart.total": "Totale",
    "cart.checkout": "Procedi al Checkout",

    // Auth
    "auth.login": "Accedi",
    "auth.register": "Registrati",
    "auth.email": "Email",
    "auth.password": "Password",
    "auth.confirm_password": "Conferma Password",
    "auth.full_name": "Nome Completo",
    "auth.phone": "Telefono",

    // Payment
    "payment.title": "Metodi di Pagamento",
    "payment.transfermovil": "Transfermóvil",
    "payment.enzona": "Enzona",
    "payment.select_bank": "Seleziona Banca",
    "payment.scan_qr": "Scansiona Codice QR",
    "payment.confirm": "Conferma Pagamento",

    // Admin
    "admin.dashboard": "Dashboard",
    "admin.products": "Gestione Prodotti",
    "admin.orders": "Gestione Ordini",
    "admin.users": "Utenti",

    // Common
    "common.loading": "Caricamento...",
    "common.error": "Errore",
    "common.success": "Successo",
    "common.cancel": "Annulla",
    "common.save": "Salva",
    "common.edit": "Modifica",
    "common.delete": "Elimina",
    "common.back": "Indietro",
    "common.next": "Avanti",
    "common.previous": "Precedente",
  },
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>("es")

  useEffect(() => {
    const savedLanguage = localStorage.getItem("language") as Language
    if (savedLanguage && translations[savedLanguage]) {
      setLanguage(savedLanguage)
    }
  }, [])

  useEffect(() => {
    localStorage.setItem("language", language)
    document.documentElement.lang = language
  }, [language])

  const t = (key: string): string => {
    return translations[language][key as keyof (typeof translations)[typeof language]] || key
  }

  return <LanguageContext.Provider value={{ language, setLanguage, t }}>{children}</LanguageContext.Provider>
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider")
  }
  return context
}
