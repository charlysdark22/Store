```jsx
import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import { User, Settings, ShoppingBag, ShoppingCart, Users, DollarSign, TrendingUp, Package, CreditCard, FileText, Download } from 'lucide-react';

const App = () => {
  const [currentPage, setCurrentPage] = useState('login');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeMenu, setActiveMenu] = useState('dashboard');

  // Mock data
  const salesData = [
    { name: '2023-01', value: 1200 },
    { name: '2023-02', value: 1900 },
    { name: '2023-03', value: 2800 },
    { name: '2023-04', value: 1500 },
    { name: '2023-05', value: 2600 },
    { name: '2023-06', value: 3200 },
    { name: '2023-07', value: 4000 },
    { name: '2023-08', value: 6500 },
  ];

  const purchasesData = [
    { name: '2023-01', value: 8000 },
    { name: '2023-02', value: 5000 },
    { name: '2023-03', value: 3000 },
    { name: '2023-04', value: 2000 },
    { name: '2023-05', value: 1000 },
    { name: '2023-06', value: 2500 },
    { name: '2023-07', value: 3000 },
    { name: '2023-08', value: 35000 },
  ];

  const topProducts = [
    { name: 'Laptop Gamer', stock: 7782, status: '98.93%', quantity: 1202, sales: '$6,574.35' },
    { name: 'Audifono G25', stock: 708, status: '0.08%', quantity: 1, sales: '$1.00' },
    { name: 'Laptop oficina', stock: 140, status: '99.9%', quantity: 12, sales: '$12.75' },
  ];

  const pieData = [
    { name: 'Enero', value: 3000 },
    { name: 'Febrero', value: 2500 },
    { name: 'Marzo', value: 1500 },
    { name: 'Abril', value: 2000 },
    { name: 'Mayo', value: 1800 },
    { name: 'Junio', value: 2200 },
  ];

  const colors = ['#0084ff', '#00c49f', '#ffbb00', '#ff8042', '#e6007a', '#00d8ff'];

  const handleLogin = (e) => {
    e.preventDefault();
    if (username && password) {
      setCurrentPage('dashboard');
    }
  };

  const navigateTo = (page) => {
    setCurrentPage(page);
    setActiveMenu(page);
  };

  const renderDashboard = () => (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-gray-800 text-white p-4 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button 
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 rounded-md hover:bg-gray-700 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0l-8-8m8 8l-8 8m0 0H6m0 0l8 8m-8-8v12" />
              </svg>
            </div>
            <span className="text-xl font-bold">BENDEY</span>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <button className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors">
            POS
          </button>
          <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        {sidebarOpen && (
          <aside className="w-64 bg-gray-900 text-white min-h-screen">
            <nav className="p-4">
              <div className="space-y-2">
                <button 
                  onClick={() => navigateTo('dashboard')}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                    activeMenu === 'dashboard' ? 'bg-blue-600' : 'hover:bg-gray-800'
                  }`}
                >
                  <ShoppingBag className="w-5 h-5" />
                  <span>Escritorio</span>
                </button>
                
                <button 
                  onClick={() => navigateTo('caja')}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                    activeMenu === 'caja' ? 'bg-blue-600' : 'hover:bg-gray-800'
                  }`}
                >
                  <DollarSign className="w-5 h-5" />
                  <span>Caja</span>
                </button>
                
                <button 
                  onClick={() => navigateTo('almacen')}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                    activeMenu === 'almacen' ? 'bg-blue-600' : 'hover:bg-gray-800'
                  }`}
                >
                  <Package className="w-5 h-5" />
                  <span>Almacén</span>
                </button>
                
                <button 
                  onClick={() => navigateTo('compras')}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                    activeMenu === 'compras' ? 'bg-blue-600' : 'hover:bg-gray-800'
                  }`}
                >
                  <ShoppingCart className="w-5 h-5" />
                  <span>Compras</span>
                </button>
                
                <button 
                  onClick={() => navigateTo('ventas')}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                    activeMenu === 'ventas' ? 'bg-blue-600' : 'hover:bg-gray-800'
                  }`}
                >
                  <TrendingUp className="w-5 h-5" />
                  <span>Ventas</span>
                </button>
                
                <button 
                  onClick={() => navigateTo('usuarios')}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                    activeMenu === 'usuarios' ? 'bg-blue-600' : 'hover:bg-gray-800'
                  }`}
                >
                  <Users className="w-5 h-5" />
                  <span>Usuarios</span>
                </button>
                
                <button 
                  onClick={() => navigateTo('configuracion')}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                    activeMenu === 'configuracion' ? 'bg-blue-600' : 'hover:bg-gray-800'
                  }`}
                >
                  <Settings className="w-5 h-5" />
                  <span>Configuración</span>
                </button>
              </div>

              <div className="mt-8 pt-4 border-t border-gray-700">
                <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">REPORTES</h3>
                <div className="space-y-2 mt-2">
                  <button 
                    onClick={() => navigateTo('reportes')}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                      activeMenu === 'reportes' ? 'bg-blue-600' : 'hover:bg-gray-800'
                    }`}
                  >
                    <FileText className="w-5 h-5" />
                    <span>Gráficos</span>
                  </button>
                  
                  <button 
                    onClick={() => navigateTo('reporte-caja')}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                      activeMenu === 'reporte-caja' ? 'bg-blue-600' : 'hover:bg-gray-800'
                    }`}
                  >
                    <Download className="w-5 h-5" />
                    <span>Reporte Caja</span>
                  </button>
                </div>
              </div>
            </nav>
          </aside>
        )}

        {/* Main Content */}
        <main className="flex-1 p-6">
          {activeMenu === 'dashboard' && (
            <div className="space-y-6">
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Total ventas</p>
                      <p className="text-2xl font-bold text-green-600">$8,549.68</p>
                    </div>
                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                      <ShoppingBag className="w-6 h-6 text-green-600" />
                    </div>
                  </div>
                  <div className="mt-4">
                    <ResponsiveContainer width="100%" height={80}>
                      <LineChart data={salesData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                        <YAxis tick={{ fontSize: 10 }} />
                        <Tooltip />
                        <Line type="monotone" dataKey="value" stroke="#0084ff" strokeWidth={2} dot={false} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-lg p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Total compras</p>
                      <p className="text-2xl font-bold text-purple-600">$44,980.20</p>
                    </div>
                    <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                      <ShoppingCart className="w-6 h-6 text-purple-600" />
                    </div>
                  </div>
                  <div className="mt-4">
                    <ResponsiveContainer width="100%" height={80}>
                      <LineChart data={purchasesData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                        <YAxis tick={{ fontSize: 10 }} />
                        <Tooltip />
                        <Line type="monotone" dataKey="value" stroke="#8b5cf6" strokeWidth={2} dot={false} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-lg p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Total Ganancia</p>
                      <p className="text-2xl font-bold text-emerald-600">$2,845.15</p>
                    </div>
                    <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center">
                      <DollarSign className="w-6 h-6 text-emerald-600" />
                    </div>
                  </div>
                  <div className="mt-4">
                    <ResponsiveContainer width="100%" height={80}>
                      <LineChart data={salesData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                        <YAxis tick={{ fontSize: 10 }} />
                        <Tooltip />
                        <Line type="monotone" dataKey="value" stroke="#10b981" strokeWidth={2} dot={false} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>

              {/* Charts Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <h3 className="text-lg font-semibold mb-4">Gráfico de compras</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={purchasesData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Line type="monotone" dataKey="value" stroke="#f59e0b" strokeWidth={2} dot={false} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>

                <div className="bg-white rounded-xl shadow-lg p-6">
                  <h3 className="text-lg font-semibold mb-4">Gráfico de ventas</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={salesData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Line type="monotone" dataKey="value" stroke="#0084ff" strokeWidth={2} dot={false} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <h3 className="text-lg font-semibold mb-4">Resumen de compras del año 2025</h3>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={pieData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                          label={({ percent }) => `${(percent * 100).toFixed(0)}%`}
                        >
                          {pieData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                          ))}
                        </Pie>
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-lg p-6">
                  <h3 className="text-lg font-semibold mb-4">Resumen de ventas del año 2025</h3>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={pieData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                          label={({ percent }) => `${(percent * 100).toFixed(0)}%`}
                        >
                          {pieData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                          ))}
                        </Pie>
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeMenu === 'caja' && (
            <div className="space-y-6">
              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold">Caja</h2>
                  <div className="flex items-center space-x-4">
                    <div className="text-sm text-gray-600">Estado:</div>
                    <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">Abierta</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Fecha</label>
                    <input 
                      type="date" 
                      defaultValue="2025-08-23"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Apertura</label>
                    <input 
                      type="number" 
                      value="0.00"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Saldo</label>
                    <div className="flex items-center">
                      <span className="text-lg font-bold text-gray-900">$1559.30</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-end space-x-2 mb-6">
                  <button className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors">
                    Cerrar caja
                  </button>
                  <button className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors">
                    Editar
                  </button>
                </div>

                <div className="flex items-center justify-end space-x-2 mb-4">
                  <button className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors">
                    Excel
                  </button>
                  <button className="px-4 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition-colors">
                    PDF
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="bg-gray-50">
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">#</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Usuario</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cantidad</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Descripción</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha hora</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tipo</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {[1, 2, 3, 4, 5].map((item) => (
                        <tr key={item} className="hover:bg-gray-50">
                          <td className="px-4 py-3 text-sm">{item}</td>
                          <td className="px-4 py-3 text-sm">Admin</td>
                          <td className="px-4 py-3 text-sm">{item === 1 ? '1557.00' : item === 2 ? '2.30' : item === 3 ? '30.00' : item === 4 ? '1.50' : '1400.00'}</td>
                          <td className="px-4 py-3 text-sm">Ventas</td>
                          <td className="px-4 py-3 text-sm">{item === 1 ? '2025-08-23 17:17:03' : item === 2 ? '2025-08-23 16:17:03' : item === 3 ? '2025-06-05 16:43:02' : item === 4 ? '2025-03-23 19:42:29' : '2025-01-11 09:21:18'}</td>
                          <td className="px-4 py-3">
                            <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">Ingreso</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {activeMenu === 'almacen' && (
            <div className="space-y-6">
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h2 className="text-2xl font-bold mb-6">Almacén</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Artículos más vendidos</h3>
                    <div className="space-y-4">
                      {topProducts.map((product, index) => (
                        <div key={index} className="border-b pb-4 last:border-b-0">
                          <div className="flex items-center space-x-4">
                            <img src={`https://placehold.co/40x40/${index + 1}`} alt={product.name} className="w-10 h-10 rounded-lg" />
                            <div className="flex-1">
                              <h4 className="font-medium">{product.name}</h4>
                              <p className="text-sm text-gray-500">{product.stock} unidades</p>
                            </div>
                            <div className="text-right">
                              <p className="font-medium">{product.sales}</p>
                              <p className="text-sm text-gray-500">{product.quantity} unidades</p>
                            </div>
                          </div>
                          <div className="mt-2">
                            <div className="flex justify-between text-sm">
                              <span>Estado:</span>
                              <span className="font-medium">{product.status}</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                              <div 
                                className="bg-yellow-500 h-2 rounded-full" 
                                style={{ width: product.status === '98.93%' ? '98.93%' : product.status === '0.08%' ? '0.08%' : '99.9%' }}
                              ></div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <div className="bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl p-6 text-white">
                      <h3 className="text-lg font-semibold mb-2">Ventas hoy</h3>
                      <p className="text-2xl font-bold">$2.30</p>
                      <p className="text-sm opacity-90">↑ 100% Desde ayer</p>
                    </div>
                    <div className="mt-6 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl p-6 text-white">
                      <h3 className="text-lg font-semibold mb-2">Ventas semana</h3>
                      <p className="text-2xl font-bold">$2.30</p>
                      <p className="text-sm opacity-90">↑ 100% Desde la semana pasada</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeMenu === 'login' && (
            <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900">
              <div className="w-full max-w-4xl flex">
                <div className="w-2/3 bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 flex items-center justify-center relative">
                  <div className="absolute inset-0 bg-black opacity-20"></div>
                  <div className="relative z-10 text-center text-white px-8">
                    <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-6">
                      <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0l-8-8m8 8l-8 8m0 0H6m0 0l8 8m-8-8v12" />
                      </svg>
                    </div>
                    <h1 className="text-4xl font-bold mb-4">BENDEY</h1>
                    <p className="text-lg mb-8">
                      Solución integral para la gestión de compras, ventas y facturación electrónica.
                      Optimiza tus procesos empresariales con nuestra plataforma moderna y segura.
                    </p>
                    <div className="flex justify-center space-x-4 mb-8">
                      <button className="px-6 py-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors flex items-center space-x-2">
                        <CreditCard className="w-5 h-5" />
                        <span>Facturación</span>
                      </button>
                      <button className="px-6 py-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors flex items-center space-x-2">
                        <ShoppingCart className="w-5 h-5" />
                        <span>Compras</span>
                      </button>
                    </div>
                    <button className="px-6 py-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors flex items-center space-x-2">
                      <TrendingUp className="w-5 h-5" />
                      <span>Ventas</span>
                    </button>
                  </div>
                </div>
                <div className="w-1/3 bg-white p-8">
                  <div className="text-center mb-8">
                    <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center mx-auto mb-4">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0l-8-8m8 8l-8 8m0 0H6m0 0l8 8m-8-8v12" />
                      </svg>
                    </div>
                    <h2 className="text-2xl font-bold mb-2">Iniciar Sesión</h2>
                    <p className="text-gray-600">Accede a tu cuenta para continuar</p>
                  </div>
                  <form onSubmit={handleLogin} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Usuario</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <User className="w-5 h-5 text-gray-400" />
                        </div>
                        <input
                          type="text"
                          value={username}
                          onChange={(e) => setUsername(e.target.value)}
                          placeholder="Ingresa tu usuario"
                          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          required
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Contraseña</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                          </svg>
                        </div>
                        <input
                          type="password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="Ingresa tu contraseña"
                          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          required
                        />
                      </div>
                    </div>
                    <button
                      type="submit"
                      className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                    >
                      Iniciar Sesión
                    </button>
                  </form>
                  <div className="mt-6 text-center text-sm text-gray-600">
                    <p>Sistema de Compras y Ventas</p>
                    <div className="mt-1">
                      <span className="inline-block px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                        v0.0.1
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );

  return renderDashboard();
};

export default App;
```