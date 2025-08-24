import React, { useState } from "react";

import {
  Home,
  ShoppingCart,
  Phone,
  Mail,
  MessageCircle,
  Menu,
  X,
  User,
  Search,
  Check,
  Send,
  CreditCard,
} from "lucide-react";

const App = () => {
  const [cart, setCart] = useState([]);
  const [showCart, setShowCart] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState(null);

  // Productos disponibles
  const products = [
    {
      id: 1,
      name: "Caja para Disco Duro",
      price: 5000,
      image: "https://placehold.co/300x300/6366f1/ffffff?text=Caja+HDD",
      description: 'Caja externa para disco duro SATA 2.5"',
    },
    {
      id: 2,
      name: "SSD 128GB",
      price: 6500,
      image: "https://placehold.co/300x300/8b5cf6/ffffff?text=SSD+128GB",
      description: "Unidad SSD de alta velocidad 128GB",
    },
    {
      id: 3,
      name: "Cable TP-Link + Transformador 5V-9V",
      price: 2500,
      image: "https://placehold.co/300x300/06b6d4/ffffff?text=Cable+TP-Link",
      description: "Cable USB + adaptador de voltaje 5V a 9V",
    },
  ];

  const addToCart = (product) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (id) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const renderQR = () => {
    if (selectedPayment === "transfermovil") {
      return (
        <div className="flex flex-col items-center">
          <img
            src="https://placehold.co/300x300/000000/ffffff?text=QR+Transfermóvil"
            alt="Transfermóvil"
            className="w-64 h-64 mb-4"
          />
          <p className="text-sm text-gray-600">
            Escanea este código para pagar con Transfermóvil
          </p>
        </div>
      );
    } else if (selectedPayment === "enzona") {
      return (
        <div className="flex flex-col items-center">
          <img
            src="https://placehold.co/300x300/000000/ffffff?text=QR+Enzona"
            alt="Enzona"
            className="w-64 h-64 mb-4"
          />
          <p className="text-sm text-gray-600">
            Escanea este código para pagar con Enzona
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 18h.01M8 21h8a2 2 0 002-2V7.414A2 2 0 0018 5.414V4a2 2 0 00-2-2H8a2 2 0 00-2 2v1.414A2 2 0 008 8.414V16a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <h1 className="text-xl font-bold text-gray-800">
                Tecnología Moderna
              </h1>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex space-x-8">
              <a
                href="#"
                className="text-gray-700 hover:text-blue-600 transition-colors"
              >
                Inicio
              </a>
              <a
                href="#productos"
                className="text-gray-700 hover:text-blue-600 transition-colors"
              >
                Productos
              </a>
              <a
                href="#contacto"
                className="text-gray-700 hover:text-blue-600 transition-colors"
              >
                Contacto
              </a>
            </nav>

            {/* Actions */}
            <div className="flex items-center space-x-4">
              <button className="text-gray-600 hover:text-blue-600 transition-colors">
                <Search size={20} />
              </button>
              <button
                onClick={() => setShowCart(!showCart)}
                className="relative text-gray-600 hover:text-blue-600 transition-colors"
              >
                <ShoppingCart size={20} />
                {cart.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {cart.reduce((sum, item) => sum + item.quantity, 0)}
                  </span>
                )}
              </button>

              {/* Mobile menu button */}
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="md:hidden p-2"
              >
                {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </div>

          {/* Mobile menu */}
          {isMenuOpen && (
            <div className="md:hidden border-t border-gray-200 py-4">
              <nav className="flex flex-col space-y-4">
                <a href="#" className="text-gray-700 hover:text-blue-600">
                  Inicio
                </a>
                <a
                  href="#productos"
                  className="text-gray-700 hover:text-blue-600"
                >
                  Productos
                </a>
                <a
                  href="#contacto"
                  className="text-gray-700 hover:text-blue-600"
                >
                  Contacto
                </a>
              </nav>
            </div>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Tecnología Moderna
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Accesorios de alta calidad para tu dispositivo tecnológico
          </p>
          <button
            onClick={() =>
              document
                .getElementById("productos")
                .scrollIntoView({ behavior: "smooth" })
            }
            className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
          >
            Ver Productos
          </button>
        </div>
      </section>

      {/* Products Section */}
      <section id="productos" className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-800 text-center mb-12">
            Nuestros Productos
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map((product) => (
              <div
                key={product.id}
                className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
              >
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-48 object-cover"
                />
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">
                    {product.name}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4">
                    {product.description}
                  </p>
                  <div className="flex justify-between items-center">
                    <span className="text-2xl font-bold text-green-600">
                      ${product.price.toLocaleString()} MN
                    </span>
                    <button
                      onClick={() => addToCart(product)}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
                    >
                      Añadir al Carrito
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Cart Sidebar */}
      {showCart && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          <div
            className="absolute inset-0 bg-black bg-opacity-50"
            onClick={() => setShowCart(false)}
          ></div>
          <div className="absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-xl">
            <div className="flex flex-col h-full">
              <div className="p-6 border-b border-gray-200 flex justify-between items-center">
                <h2 className="text-xl font-bold">Carrito de Compras</h2>
                <button
                  onClick={() => setShowCart(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6">
                {cart.length === 0 ? (
                  <div className="text-center py-8">
                    <ShoppingCart
                      size={48}
                      className="text-gray-300 mx-auto mb-4"
                    />
                    <p className="text-gray-500">Tu carrito está vacío</p>
                  </div>
                ) : (
                  <ul className="space-y-4">
                    {cart.map((item) => (
                      <li
                        key={item.id}
                        className="flex items-center space-x-4 p-4 border-b"
                      >
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-16 h-16 object-cover rounded"
                        />
                        <div className="flex-1">
                          <h3 className="font-medium">{item.name}</h3>
                          <p className="text-sm text-gray-600">
                            ${item.price.toLocaleString()} MN × {item.quantity}
                          </p>
                        </div>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <X size={16} />
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {cart.length > 0 && (
                <div className="p-6 border-t border-gray-200">
                  <div className="flex justify-between mb-4">
                    <span>Total:</span>
                    <span className="font-bold">
                      ${total.toLocaleString()} MN
                    </span>
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium mb-2">
                      Método de Pago
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => setSelectedPayment("transfermovil")}
                        className={`p-3 rounded-lg border ${
                          selectedPayment === "transfermovil"
                            ? "border-blue-500 bg-blue-50"
                            : "border-gray-300"
                        }`}
                      >
                        <div className="flex items-center space-x-2">
                          <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
                            <svg
                              className="w-3 h-3 text-white"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 18h.01M8 21h8a2 2 0 002-2V7.414A2 2 0 0018 5.414V4a2 2 0 00-2-2H8a2 2 0 00-2 2v1.414A2 2 0 008 8.414V16a2 2 0 002 2z"
                              />
                            </svg>
                          </div>
                          <span>Transfermóvil</span>
                        </div>
                      </button>
                      <button
                        onClick={() => setSelectedPayment("enzona")}
                        className={`p-3 rounded-lg border ${
                          selectedPayment === "enzona"
                            ? "border-blue-500 bg-blue-50"
                            : "border-gray-300"
                        }`}
                      >
                        <div className="flex items-center space-x-2">
                          <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
                            <svg
                              className="w-3 h-3 text-white"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 18h.01M8 21h8a2 2 0 002-2V7.414A2 2 0 0018 5.414V4a2 2 0 00-2-2H8a2 2 0 00-2 2v1.414A2 2 0 008 8.414V16a2 2 0 002 2z"
                              />
                            </svg>
                          </div>
                          <span>Enzona</span>
                        </div>
                      </button>
                    </div>
                  </div>

                  {selectedPayment && (
                    <div className="mb-6">
                      <h3 className="text-sm font-medium mb-3">
                        Escanea el código QR para pagar
                      </h3>
                      {renderQR()}
                    </div>
                  )}

                  <button
                    onClick={() => setShowCart(false)}
                    disabled={!selectedPayment}
                    className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white py-3 rounded-lg transition-colors"
                  >
                    Confirmar Pedido
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Contact Section */}
      <section id="contacto" className="py-16 bg-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-800 text-center mb-12">
            Contáctanos
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div>
              <h3 className="text-xl font-semibold mb-6">
                Información de Contacto
              </h3>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Phone size={20} />
                  <span>+53 53932292</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Mail size={20} />
                  <span>carlosaguilardark22@gmail.com</span>
                </div>
                <div className="flex items-center space-x-3">
                  <MessageCircle size={20} />
                  <span>Chatbot disponible 24/7</span>
                </div>
              </div>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-6">Chatbot</h3>
              <div className="bg-white p-6 rounded-xl shadow-sm border">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                    <User size={16} className="text-white" />
                  </div>
                  <span className="font-medium">Asistente</span>
                </div>
                <p className="text-gray-600 text-sm mb-4">
                  ¿Cómo puedo ayudarte hoy? Puedes preguntarme sobre productos,
                  precios o métodos de pago.
                </p>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    placeholder="Escribe tu mensaje..."
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                  <button className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-lg">
                    <Send size={16} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">Tecnología Moderna</h3>
              <p className="text-gray-400 text-sm">
                Tu tienda confiable para accesorios tecnológicos de alta
                calidad.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Enlaces Rápidos</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Inicio
                  </a>
                </li>
                <li>
                  <a
                    href="#productos"
                    className="hover:text-white transition-colors"
                  >
                    Productos
                  </a>
                </li>
                <li>
                  <a
                    href="#contacto"
                    className="hover:text-white transition-colors"
                  >
                    Contacto
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Redes Sociales</h3>
              <div className="flex space-x-4">
                <a
                  href="#"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <svg
                    className="w-6 h-6"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.184-.896-.957-2.173-1.555-3.591-1.555-2.717 0-4.92 2.203-4.92 4.917 0 .39.045.765.127 1.124-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.054 0 13.999-7.496 13.999-13.985 0-.21 0-.42-.015-.63A10.965 10.965 0 0024 4.557z" />
                  </svg>
                </a>
                <a
                  href="#"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <svg
                    className="w-6 h-6"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12.01 17.66c-3.84 0-7-3.16-7-7 0-.55.06-1.08.17-1.59a5.04 5.04 0 011.27-2.05 5.07 5.07 0 012.18-1.27c.5-.12 1.03-.17 1.59-.17 1.28 0 2.48.42 3.44 1.15.96-.73 2.16-1.15 3.44-1.15.56 0 1.09.05 1.59.17a5.07 5.07 0 012.18 1.27 5.04 5.04 0 011.27 2.05c.11.51.17 1.04.17 1.59 0 3.84-3.16 7-7 7zm0-12.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zm0 10.5a5 5 0 110-10 5 5 0 010 10zm7.07-7.5a1 1 0 11-2 0 1 1 0 012 0zm-2.5 2.5a1 1 0 11-2 0 1 1 0 012 0zm-2.5 2.5a1 1 0 11-2 0 1 1 0 012 0z" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400 text-sm">
            © 2025 Tecnología Moderna. Todos los derechos reservados.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
