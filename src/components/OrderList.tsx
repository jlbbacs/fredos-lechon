import React, { useState, useRef } from "react";
import {
  Calendar,
  Clock,
  Phone,
  User,
  FileText,
  ChefHat,
  Package,
  Edit,
  Save,
  X,
} from "lucide-react";
import { Order } from "../types/Order";
interface OrderListProps {
  orders: Order[];
  onUpdateOrder: (order: Order) => void;
  onDeleteOrder: (orderId: string) => void;
}

const OrderList: React.FC<OrderListProps> = ({
  orders,
  onUpdateOrder,
  onDeleteOrder,
}) => {
  const [editingOrder, setEditingOrder] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<Order>>({});
  const [detailsOrder, setDetailsOrder] = useState<Order | null>(null);
  const [deleteForm, setDeleteForm] = useState<Order | null>(null);
  const printRef = useRef<HTMLDivElement>(null);

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });

  const formatTime = (timeString: string) =>
    new Date(`2000-01-01T${timeString}`).toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });

  const formatDateTime = (dateString: string) =>
    new Date(dateString).toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

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

  // Open details modal
  const openDetails = (order: Order) => {
    setDetailsOrder(order);
  };
  // Delete Order
  const handleDeleteOrder = (orderId: string) => {
    onDeleteOrder(orderId); // Use the prop
  };

  // Close details modal
  const closeDetails = () => {
    setDetailsOrder(null);
  };

  // Print details
  const printDetails = () => {
    if (!printRef.current) return;
    const printContents = printRef.current.innerHTML;
    const originalContents = document.body.innerHTML;
    document.body.innerHTML = printContents;
    window.print();
    document.body.innerHTML = originalContents;
    window.location.reload(); // reload to rebind React events
  };

  if (orders.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-lg border border-orange-100 p-12 text-center">
        <ChefHat className="h-12 w-12 text-gray-300 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          No Orders Found
        </h3>
        <p className="text-gray-500">No orders match your current filters.</p>
      </div>
    );
  }

  return (
    <>
      <div className="bg-white rounded-2xl shadow-lg border border-orange-100 overflow-hidden">
        <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">
            Orders ({orders.length})
          </h3>
        </div>

        <div className="divide-y divide-gray-200">
          {orders.map((order) => (
            <div
              key={order.id}
              className="p-6 hover:bg-gray-50 transition-colors print:hover:bg-white"
            >
              {editingOrder === order.id ? (
                <div className="space-y-4">
                  {/* === YOUR FULL EDIT FORM (UNCHANGED) === */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Customer Name
                      </label>
                      <input
                        type="text"
                        value={editForm.name || ""}
                        onChange={(e) => updateEditForm("name", e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Amount (₱)
                      </label>
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={
                          editForm.amount !== undefined
                            ? String(editForm.amount)
                            : ""
                        }
                        onChange={(e) =>
                          updateEditForm("amount", e.target.value)
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Contact Number
                      </label>
                      <input
                        type="tel"
                        value={editForm.contactNumber || ""}
                        onChange={(e) =>
                          updateEditForm("contactNumber", e.target.value)
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Pick-up Date
                      </label>
                      <input
                        type="date"
                        value={editForm.date || ""}
                        onChange={(e) => updateEditForm("date", e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Pick-up Time
                      </label>
                      <input
                        type="time"
                        value={editForm.pickupTime || ""}
                        onChange={(e) =>
                          updateEditForm("pickupTime", e.target.value)
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Status
                      </label>
                      <div className="flex space-x-4">
                        {["Cook", "Pick-up Already"].map((status) => (
                          <label key={status} className="flex items-center">
                            <input
                              type="radio"
                              value={status}
                              checked={editForm.status === status}
                              onChange={(e) =>
                                updateEditForm("status", e.target.value)
                              }
                              className="h-4 w-4 text-orange-500 focus:ring-orange-500"
                            />
                            <span className="ml-2 text-gray-700">{status}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Payment Status
                      </label>
                      <div className="flex space-x-4">
                        {["Not Paid", "Partially Paid", "Paid"].map(
                          (status) => (
                            <label key={status} className="flex items-center">
                              <input
                                type="radio"
                                value={status}
                                checked={editForm.paymentStatus === status}
                                onChange={(e) =>
                                  updateEditForm(
                                    "paymentStatus",
                                    e.target.value
                                  )
                                }
                                className="h-4 w-4 text-orange-500 focus:ring-orange-500"
                              />
                              <span className="ml-2 text-gray-700">
                                {status}
                              </span>
                            </label>
                          )
                        )}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Tinae
                      </label>
                      <select
                        value={editForm.tinae || "Paklay"}
                        onChange={(e) =>
                          updateEditForm("tinae", e.target.value)
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                      >
                        <option value="Paklay">Paklay</option>
                        <option value="Sampayna">Sampayna</option>
                        <option value="Kwaon">Kwaon</option>
                      </select>
                    </div>
                  </div>

                  {editForm.paymentStatus === "Partially Paid" && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Balance (₱)
                        </label>
                        <input
                          type="number"
                          min="0"
                          step="0.01"
                          value={
                            editForm.balance !== undefined
                              ? editForm.balance
                              : ""
                          }
                          onChange={(e) =>
                            updateEditForm("balance", e.target.value)
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Partial Payment (₱)
                        </label>
                        <input
                          type="number"
                          min="0"
                          step="0.01"
                          value={
                            editForm.amount && editForm.balance
                              ? (
                                  Number(editForm.amount) -
                                  Number(editForm.balance)
                                ).toFixed(2)
                              : ""
                          }
                          readOnly
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-700"
                        />
                      </div>
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Remarks
                    </label>
                    <textarea
                      value={editForm.remarks || ""}
                      onChange={(e) =>
                        updateEditForm("remarks", e.target.value)
                      }
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
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                  <div className="flex-1 space-y-3">
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

                      {/* Tinae display */}
                      <div className="flex items-center text-gray-700">
                        <span className="font-semibold mr-1">Tinae:</span>
                        <span>{order.tinae}</span>
                      </div>

                      <div className="flex items-center text-gray-700">
                        <span className="font-semibold mr-1">Amount:</span>
                        <span>₱{order.amount}</span>
                      </div>
                      <div className="flex items-center text-gray-700">
                        <span className="font-semibold mr-1">
                          Payment Status:
                        </span>
                        <span>{order.paymentStatus}</span>
                      </div>
                      {order.paymentStatus === "Partially Paid" && (
                        <>
                          <div className="flex items-center text-gray-700">
                            <span className="font-semibold mr-1">Balance:</span>
                            <span>₱{order.balance}</span>
                          </div>
                          <div className="flex items-center text-gray-700">
                            <span className="font-semibold mr-1">
                              Partial Payment:
                            </span>
                            <span>
                              ₱
                              {(
                                Number(order.amount) - Number(order.balance)
                              ).toFixed(2)}
                            </span>
                          </div>
                        </>
                      )}
                    </div>

                    {order.remarks && (
                      <div className="flex items-start text-sm text-gray-600">
                        <FileText className="h-4 w-4 mr-2 text-gray-400 mt-0.5" />
                        <span>{order.remarks}</span>
                      </div>
                    )}

                    <div className="text-xs text-gray-500">
                      Order placed: {formatDateTime(order.createdAt)}
                    </div>
                  </div>

                  <div className="flex items-center space-x-3 mt-4 lg:mt-0">
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                        order.status === "Cook"
                          ? "bg-orange-100 text-orange-800"
                          : "bg-green-100 text-green-800"
                      }`}
                    >
                      {order.status === "Cook" ? (
                        <ChefHat className="h-3 w-3 mr-1" />
                      ) : (
                        <Package className="h-3 w-3 mr-1" />
                      )}
                      {order.status}
                    </span>

                    {/* Edit button */}
                    <button
                      onClick={() => startEditing(order)}
                      className="inline-flex items-center px-3 py-1 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors print:hidden"
                    >
                      <Edit className="h-3 w-3 mr-1" />
                      Edit
                    </button>

                    {/* View Details button */}
                    <button
                      onClick={() => openDetails(order)}
                      className="inline-flex items-center px-3 py-1 border border-blue-500 rounded-lg text-sm font-medium text-blue-700 bg-white hover:bg-blue-50 transition-colors print:hidden"
                    >
                      View Details
                    </button>
                    {/* delete button */}
                    <button
                      onClick={() => handleDeleteOrder(order.id)}
                      className="inline-flex items-center px-3 py-1 border border-red-500 rounded-lg text-sm font-medium text-red-700 bg-white hover:bg-red-50 transition-colors print:hidden"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Modal for details */}
      {detailsOrder && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={closeDetails}
        >
          <div
            className="bg-white rounded-lg p-6 max-w-lg w-full shadow-lg relative"
            onClick={(e) => e.stopPropagation()} // prevent closing modal on inner click
          >
            <h2 className="text-xl font-semibold mb-4">Order Details</h2>

            <div ref={printRef} className="space-y-3 text-gray-700">
              <p>
                <strong>Customer Name:</strong> {detailsOrder.name}
              </p>
              <p>
                <strong>Contact Number:</strong> {detailsOrder.contactNumber}
              </p>
              <p>
                <strong>Pick-up Date:</strong> {formatDate(detailsOrder.date)}
              </p>
              <p>
                <strong>Pick-up Time:</strong>{" "}
                {formatTime(detailsOrder.pickupTime)}
              </p>
              <p>
                <strong>Status:</strong> {detailsOrder.status}
              </p>
              <p>
                <strong>Tinae:</strong> {detailsOrder.tinae}
              </p>
              <p>
                <strong>Amount:</strong> ₱{detailsOrder.amount}
              </p>
              <p>
                <strong>Payment Status:</strong> {detailsOrder.paymentStatus}
              </p>
              {detailsOrder.paymentStatus === "Partially Paid" && (
                <>
                  <p>
                    <strong>Balance:</strong> ₱{detailsOrder.balance}
                  </p>
                  <p>
                    <strong>Partial Payment:</strong> ₱
                    {(
                      Number(detailsOrder.amount) - Number(detailsOrder.balance)
                    ).toFixed(2)}
                  </p>
                </>
              )}
              {detailsOrder.remarks && (
                <p>
                  <strong>Remarks:</strong> {detailsOrder.remarks}
                </p>
              )}
              <p className="text-xs text-gray-500">
                Order placed: {formatDateTime(detailsOrder.createdAt)}
              </p>
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={printDetails}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors font-medium"
              >
                Print
              </button>
              <button
                onClick={closeDetails}
                className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors font-medium"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default OrderList;
