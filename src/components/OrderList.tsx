import React, { useState } from 'react';
import { Calendar, Clock, Phone, User, FileText, ChefHat, Package, Edit, Save, X } from 'lucide-react';
import { Order } from '../types/Order';

interface OrderListProps {
  orders: Order[];
  onUpdateOrder: (order: Order) => void;
}

const OrderList: React.FC<OrderListProps> = ({ orders, onUpdateOrder }) => {
  const [editingOrder, setEditingOrder] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<Order>>({});

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatTime = (timeString: string) => {
    return new Date(`2000-01-01T${timeString}`).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const startEditing = (order: Order) => {
    setEditingOrder(order.id);
    setEditForm(order);
  };

  const cancelEditing = () => {
    setEditingOrder(null);
    setEditForm({});
  };

  const saveOrder = () => {
    if (editForm.id) {
      onUpdateOrder(editForm as Order);
      setEditingOrder(null);
      setEditForm({});
    }
  };

  const updateEditForm = (field: keyof Order, value: string) => {
    setEditForm((prev) => ({ ...prev, [field]: value }));
  };

  if (orders.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-lg border border-orange-100 p-12 text-center">
        <ChefHat className="h-12 w-12 text-gray-300 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No Orders Found</h3>
        <p className="text-gray-500">No orders match your current filters.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-orange-100 overflow-hidden">
      <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">Orders ({orders.length})</h3>
      </div>

      <div className="divide-y divide-gray-200">
        {orders.map((order) => (
          <div key={order.id} className="p-6 hover:bg-gray-50 transition-colors print:hover:bg-white">
            {editingOrder === order.id ? (
              // Edit Mode
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Customer Name</label>
                    <input
                      type="text"
                      value={editForm.name || ''}
                      onChange={(e) => updateEditForm('name', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Amount (₱)</label>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={editForm.amount !== undefined ? String(editForm.amount) : ''}
                      onChange={(e) => updateEditForm('amount', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Contact Number</label>
                    <input
                      type="tel"
                      value={editForm.contactNumber || ''}
                      onChange={(e) => updateEditForm('contactNumber', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Pick-up Date</label>
                    <input
                      type="date"
                      value={editForm.date || ''}
                      onChange={(e) => updateEditForm('date', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Pick-up Time</label>
                    <input
                      type="time"
                      value={editForm.pickupTime || ''}
                      onChange={(e) => updateEditForm('pickupTime', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                    <div className="flex space-x-4">
                      <label className="flex items-center">
                        <input
                          type="radio"
                          value="Cook"
                          checked={editForm.status === 'Cook'}
                          onChange={(e) => updateEditForm('status', e.target.value)}
                          className="h-4 w-4 text-orange-500 focus:ring-orange-500"
                        />
                        <span className="ml-2 text-gray-700">Cook</span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="radio"
                          value="Pick-up Already"
                          checked={editForm.status === 'Pick-up Already'}
                          onChange={(e) => updateEditForm('status', e.target.value)}
                          className="h-4 w-4 text-orange-500 focus:ring-orange-500"
                        />
                        <span className="ml-2 text-gray-700">Pick-up Already</span>
                      </label>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Remarks</label>
                  <textarea
                    value={editForm.remarks || ''}
                    onChange={(e) => updateEditForm('remarks', e.target.value)}
                    rows={2}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 resize-none"
                  />
                </div>

                <div className="flex space-x-3 pt-2">
                  <button
                    onClick={saveOrder}
                    className="inline-flex items-center px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors font-medium"
                  >
                    <Save className="h-4 w-4 mr-2" />
                    Save Changes
                  </button>
                  <button
                    onClick={cancelEditing}
                    className="inline-flex items-center px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors font-medium"
                  >
                    <X className="h-4 w-4 mr-2" />
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              // View Mode
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                <div className="flex-1 space-y-3">
                  {/* Customer Info */}
                  <div className="flex flex-wrap items-center gap-4 text-sm">
                    <div className="flex items-center text-gray-700">
                      <User className="h-4 w-4 mr-2 text-gray-400" />
                      <span className="font-medium">{order.name}</span>
                    </div>
                    <div className="flex items-center text-gray-700">
                      <Phone className="h-4 w-4 mr-2 text-gray-400" />
                      <span>{order.contactNumber}</span>
                    </div>
                    <div className="flex items-center text-gray-700">
                      <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                      <span>{formatDate(order.date)}</span>
                    </div>
                    <div className="flex items-center text-gray-700">
                      <Clock className="h-4 w-4 mr-2 text-gray-400" />
                      <span>{formatTime(order.pickupTime)}</span>
                    </div>
                    <div className="flex items-center text-gray-700">
                      <span className="font-semibold mr-1">Amount:</span>
                      <span>₱{order.amount}</span>
                    </div>
                  </div>

                  {/* Remarks */}
                  {order.remarks && (
                    <div className="flex items-start text-sm text-gray-600">
                      <FileText className="h-4 w-4 mr-2 text-gray-400 mt-0.5" />
                      <span>{order.remarks}</span>
                    </div>
                  )}

                  {/* Created At */}
                  <div className="text-xs text-gray-500">
                    Order placed: {formatDateTime(order.createdAt)}
                  </div>
                </div>

                {/* Status and Actions */}
                <div className="flex items-center space-x-3 mt-4 lg:mt-0">
                  <span
                    className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                      order.status === 'Cook' ? 'bg-orange-100 text-orange-800' : 'bg-green-100 text-green-800'
                    }`}
                  >
                    {order.status === 'Cook' ? (
                      <ChefHat className="h-3 w-3 mr-1" />
                    ) : (
                      <Package className="h-3 w-3 mr-1" />
                    )}
                    {order.status}
                  </span>

                  <button
                    onClick={() => startEditing(order)}
                    className="inline-flex items-center px-3 py-1 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors print:hidden"
                  >
                    <Edit className="h-3 w-3 mr-1" />
                    Edit
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrderList;
