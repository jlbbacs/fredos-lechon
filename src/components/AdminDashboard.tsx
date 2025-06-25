import React, { useState, useMemo } from 'react';
import { Filter, Printer, Calendar, Users, ChefHat, Package } from 'lucide-react';
import { Order, FilterOptions } from '../types/Order';
import OrderList from './OrderList';
import FilterPanel from './FilterPanel';

interface AdminDashboardProps {
  orders: Order[];
  // Removed external onUpdateOrder prop, since updates handled locally now
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ orders: initialOrders }) => {
  const [orders, setOrders] = useState<Order[]>(initialOrders);
  const [filters, setFilters] = useState<FilterOptions>({});
  const [showFilters, setShowFilters] = useState(false);

  // Handle update order (update state locally)
  const handleUpdateOrder = (updatedOrder: Order) => {
    setOrders((prev) =>
      prev.map((order) => (order.id === updatedOrder.id ? updatedOrder : order))
    );
  };

  // Handle delete order
  const handleDeleteOrder = (orderId: string) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this order?");
    if (confirmDelete) {
      setOrders((prev) => prev.filter((order) => order.id !== orderId));
    }
  };

  const filteredOrders = useMemo(() => {
    let filtered = [...orders];

    if (filters.day) {
      filtered = filtered.filter(order =>
        new Date(order.date).toISOString().split('T')[0] === filters.day
      );
    }

    if (filters.month && filters.year) {
      filtered = filtered.filter(order => {
        const orderDate = new Date(order.date);
        return (
          orderDate.getMonth() + 1 === parseInt(filters.month!) &&
          orderDate.getFullYear() === parseInt(filters.year!)
        );
      });
    } else if (filters.year) {
      filtered = filtered.filter(order =>
        new Date(order.date).getFullYear() === parseInt(filters.year!)
      );
    }

    if (filters.status && filters.status !== 'all') {
      filtered = filtered.filter(order => order.status === filters.status);
    }

    if (filters.paymentStatus && filters.paymentStatus !== 'all') {
      filtered = filtered.filter(order => order.paymentStatus === filters.paymentStatus);
    }

    return filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [orders, filters]);

  const stats = useMemo(() => {
    const total = filteredOrders.length;
    const cooking = filteredOrders.filter(order => order.status === 'Cook').length;
    const pickedUp = filteredOrders.filter(order => order.status === 'Pick-up Already').length;

    return { total, cooking, pickedUp };
  }, [filteredOrders]);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl shadow-lg border border-orange-100 p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 flex items-center">
              <Users className="h-6 w-6 mr-3 text-orange-500" />
              Order Management Dashboard
            </h2>
            <p className="text-gray-600 mt-1">
              Monitor and manage all lechon orders
            </p>
          </div>
          <div className="flex space-x-3 mt-4 lg:mt-0">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                showFilters
                  ? 'bg-orange-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-orange-50 hover:text-orange-600'
              }`}
            >
              <Filter className="h-4 w-4 inline mr-2" />
              Filters
            </button>
            <button
              onClick={handlePrint}
              className="px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors font-medium"
            >
              <Printer className="h-4 w-4 inline mr-2" />
              Print
            </button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-lg border border-blue-100 p-6">
          <div className="flex items-center">
            <div className="bg-blue-100 p-3 rounded-lg">
              <Calendar className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Orders</p>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg border border-orange-100 p-6">
          <div className="flex items-center">
            <div className="bg-orange-100 p-3 rounded-lg">
              <ChefHat className="h-6 w-6 text-orange-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Cooking</p>
              <p className="text-2xl font-bold text-gray-900">{stats.cooking}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg border border-green-100 p-6">
          <div className="flex items-center">
            <div className="bg-green-100 p-3 rounded-lg">
              <Package className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Picked Up</p>
              <p className="text-2xl font-bold text-gray-900">{stats.pickedUp}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Panel */}
      {showFilters && (
        <FilterPanel filters={filters} onFiltersChange={setFilters} />
      )}

      {/* Orders List */}
      <OrderList
        orders={filteredOrders}
        onUpdateOrder={handleUpdateOrder}
        onDeleteOrder={handleDeleteOrder}
      />
    </div>
  );
};

export default AdminDashboard;
