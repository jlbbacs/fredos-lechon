import React, { useState, useEffect } from 'react';
import { ChefHat, ClipboardList, Filter, Printer, Calendar, User, Phone, FileText } from 'lucide-react';
import CustomerForm from './components/CustomerForm';
import AdminDashboard from './components/AdminDashboard';
import { Order } from './types/Order';

function App() {
  const [currentView, setCurrentView] = useState<'customer' | 'admin'>('customer');
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    const savedOrders = localStorage.getItem('lechonOrders');
    if (savedOrders) {
      setOrders(JSON.parse(savedOrders));
    }
  }, []);

  const addOrder = (order: Order) => {
    const newOrders = [...orders, order];
    setOrders(newOrders);
    localStorage.setItem('lechonOrders', JSON.stringify(newOrders));
  };

  const updateOrder = (updatedOrder: Order) => {
    const newOrders = orders.map(order => 
      order.id === updatedOrder.id ? updatedOrder : order
    );
    setOrders(newOrders);
    localStorage.setItem('lechonOrders', JSON.stringify(newOrders));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-orange-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <div className="bg-orange-100 p-2 rounded-lg">
                <ChefHat className="h-6 w-6 text-orange-600" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900">Fredos Lechon</h1>
            </div>
            <nav className="flex space-x-1">
              <button
                onClick={() => setCurrentView('customer')}
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                  currentView === 'customer'
                    ? 'bg-orange-500 text-white shadow-md'
                    : 'text-gray-600 hover:text-orange-600 hover:bg-orange-50'
                }`}
              >
                <User className="h-4 w-4 inline mr-2" />
                New Order
              </button>
              <button
                onClick={() => setCurrentView('admin')}
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                  currentView === 'admin'
                    ? 'bg-orange-500 text-white shadow-md'
                    : 'text-gray-600 hover:text-orange-600 hover:bg-orange-50'
                }`}
              >
                <ClipboardList className="h-4 w-4 inline mr-2" />
                Admin Panel
              </button>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {currentView === 'customer' ? (
          <CustomerForm onAddOrder={addOrder} />
        ) : (
          <AdminDashboard orders={orders} onUpdateOrder={updateOrder} />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-orange-100 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <p className="text-center text-gray-500 text-sm">
            © 2025 Fredos Lechon
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;