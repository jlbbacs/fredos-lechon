import React, { useState, useEffect } from 'react';
import { User, Phone, Calendar, Clock, FileText, ChefHat, CheckCircle } from 'lucide-react';
import { Order } from '../types/Order';

interface CustomerFormProps {
  onAddOrder: (order: Order) => void;
}

const CustomerForm: React.FC<CustomerFormProps> = ({ onAddOrder }) => {
  const [formData, setFormData] = useState({
    name: '',
    amount: '',
    partialPaymentAmount: '',  // New field for partial payment
    balance: '0',              // Computed balance
    contactNumber: '',
    date: '',
    pickupTime: '',
    remarks: '',
    paymentStatus: 'Not Paid', // Default payment status
  });

  const [showSuccess, setShowSuccess] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  // Update balance and paymentStatus dynamically
  useEffect(() => {
    const total = Number(formData.amount || 0);
    const paid = Number(formData.partialPaymentAmount || 0);

    let balance = total - paid;
    if (balance < 0) balance = 0;

    // Update balance in state without triggering infinite loop
    setFormData((prev) => ({
      ...prev,
      balance: balance.toFixed(2),
    }));

    // Update paymentStatus automatically based on payment amounts
    if (paid === 0) {
      setFormData((prev) => ({ ...prev, paymentStatus: 'Not Paid' }));
    } else if (paid >= total) {
      setFormData((prev) => ({ ...prev, paymentStatus: 'Paid', partialPaymentAmount: total.toString() }));
    } else {
      setFormData((prev) => ({ ...prev, paymentStatus: 'Partially Paid' }));
    }
  }, [formData.amount, formData.partialPaymentAmount]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Customer name is required';
    }

    if (!formData.amount.trim()) {
      newErrors.amount = 'Amount is required';
    } else if (isNaN(Number(formData.amount)) || Number(formData.amount) <= 0) {
      newErrors.amount = 'Please enter a valid positive amount';
    }

    if (!formData.contactNumber.trim()) {
      newErrors.contactNumber = 'Contact number is required';
    } else if (!/^\d{10,11}$/.test(formData.contactNumber.replace(/\D/g, ''))) {
      newErrors.contactNumber = 'Please enter a valid contact number (10-11 digits)';
    }

    if (!formData.date) {
      newErrors.date = 'Pick-up date is required';
    } else {
      const selectedDate = new Date(formData.date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (selectedDate < today) {
        newErrors.date = 'Pick-up date cannot be in the past';
      }
    }

    if (!formData.pickupTime) {
      newErrors.pickupTime = 'Pick-up time is required';
    }

    if (!formData.paymentStatus) {
      newErrors.paymentStatus = 'Payment status is required';
    }

    // Validate partial payment amount if partially paid
    if (formData.paymentStatus === 'Partially Paid') {
      if (!formData.partialPaymentAmount.trim()) {
        newErrors.partialPaymentAmount = 'Partial payment amount is required';
      } else if (isNaN(Number(formData.partialPaymentAmount)) || Number(formData.partialPaymentAmount) < 0) {
        newErrors.partialPaymentAmount = 'Please enter a valid non-negative amount';
      } else if (Number(formData.partialPaymentAmount) >= Number(formData.amount)) {
        newErrors.partialPaymentAmount = 'Partial payment must be less than total amount';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    setTouched({
      name: true,
      amount: true,
      partialPaymentAmount: true,
      contactNumber: true,
      date: true,
      pickupTime: true,
      paymentStatus: true,
    });

    if (!validateForm()) return;

    const newOrder: Order = {
      id: Date.now().toString(),
      name: formData.name,
      amount: formData.amount,
      contactNumber: formData.contactNumber,
      date: formData.date,
      pickupTime: formData.pickupTime,
      remarks: formData.remarks,
      paymentStatus: formData.paymentStatus as Order['paymentStatus'],
      balance: formData.balance,
      status: 'Cook',
      createdAt: new Date().toISOString(),
      partialPaymentAmount: formData.partialPaymentAmount, // include this in Order if you want to save it
    };

    onAddOrder(newOrder);

    // Reset form after submit
    setFormData({
      name: '',
      amount: '',
      partialPaymentAmount: '',
      balance: '0',
      contactNumber: '',
      date: '',
      pickupTime: '',
      remarks: '',
      paymentStatus: 'Not Paid',
    });

    setTouched({});
    setErrors({});
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  const handleBlur = (field: string) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    validateForm();
  };

  const isFormValid = () => {
    const baseValid =
      formData.name.trim() &&
      formData.amount.trim() &&
      !isNaN(Number(formData.amount)) &&
      Number(formData.amount) > 0 &&
      formData.contactNumber.trim() &&
      formData.date &&
      formData.pickupTime;

    const partialPaymentValid =
      formData.paymentStatus !== 'Partially Paid' ||
      (formData.partialPaymentAmount.trim() &&
        !isNaN(Number(formData.partialPaymentAmount)) &&
        Number(formData.partialPaymentAmount) >= 0 &&
        Number(formData.partialPaymentAmount) < Number(formData.amount));

    return baseValid && partialPaymentValid;
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-2xl shadow-lg border border-orange-100 overflow-hidden">
        <div className="bg-gradient-to-r from-orange-500 to-amber-500 px-8 py-6">
          <h2 className="text-2xl font-bold text-white flex items-center">
            <ChefHat className="h-6 w-6 mr-3" />
            Place Your Lechon Order
          </h2>
          <p className="text-orange-100 mt-2">
            Fill out all required fields to place your lechon pick-up order
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          {/* Name Field */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              <User className="h-4 w-4 inline mr-2" />
              Customer Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              onBlur={() => handleBlur('name')}
              className={`w-full px-4 py-3 border-2 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors ${
                errors.name && touched.name ? 'border-red-300 bg-red-50' : 'border-gray-200'
              }`}
              placeholder="Enter your full name"
            />
            {errors.name && touched.name && (
              <p className="text-red-500 text-sm mt-1 flex items-center">
                <span className="inline-block w-1 h-1 bg-red-500 rounded-full mr-2"></span>
                {errors.name}
              </p>
            )}
          </div>

          {/* Amount Field */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Amount (₱) <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              min="0"
              step="0.01"
              value={formData.amount}
              onChange={(e) => handleInputChange('amount', e.target.value)}
              onBlur={() => handleBlur('amount')}
              className={`w-full px-4 py-3 border-2 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors ${
                errors.amount && touched.amount ? 'border-red-300 bg-red-50' : 'border-gray-200'
              }`}
              placeholder="Enter amount e.g. 6500"
            />
            {errors.amount && touched.amount && (
              <p className="text-red-500 text-sm mt-1 flex items-center">
                <span className="inline-block w-1 h-1 bg-red-500 rounded-full mr-2"></span>
                {errors.amount}
              </p>
            )}
          </div>

          {/* Payment Status Field */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Payment Status <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.paymentStatus}
              onChange={(e) => handleInputChange('paymentStatus', e.target.value)}
              onBlur={() => handleBlur('paymentStatus')}
              className={`w-full px-4 py-3 border-2 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors ${
                errors.paymentStatus && touched.paymentStatus ? 'border-red-300 bg-red-50' : 'border-gray-200'
              }`}
            >
              <option value="Not Paid">Not Paid</option>
              <option value="Partially Paid">Partially Paid</option>
              <option value="Paid">Paid</option>
            </select>
            {errors.paymentStatus && touched.paymentStatus && (
              <p className="text-red-500 text-sm mt-1 flex items-center">
                <span className="inline-block w-1 h-1 bg-red-500 rounded-full mr-2"></span>
                {errors.paymentStatus}
              </p>
            )}
          </div>

          {/* Partial Payment Amount Field - only if Partially Paid */}
          {formData.paymentStatus === 'Partially Paid' && (
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Partial Payment Amount (₱) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={formData.partialPaymentAmount}
                onChange={(e) => handleInputChange('partialPaymentAmount', e.target.value)}
                onBlur={() => handleBlur('partialPaymentAmount')}
                className={`w-full px-4 py-3 border-2 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors ${
                  errors.partialPaymentAmount && touched.partialPaymentAmount ? 'border-red-300 bg-red-50' : 'border-gray-200'
                }`}
                placeholder="Enter partial payment amount"
              />
              {errors.partialPaymentAmount && touched.partialPaymentAmount && (
                <p className="text-red-500 text-sm mt-1 flex items-center">
                  <span className="inline-block w-1 h-1 bg-red-500 rounded-full mr-2"></span>
                  {errors.partialPaymentAmount}
                </p>
              )}
            </div>
          )}

          {/* Balance Field - read-only */}
          {formData.paymentStatus !== 'Not Paid' && (
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Balance (₱)
              </label>
              <input
                type="text"
                readOnly
                value={formData.balance}
                className="w-full px-4 py-3 border-2 rounded-lg bg-gray-100 cursor-not-allowed"
              />
            </div>
          )}

          {/* Contact Number Field */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              <Phone className="h-4 w-4 inline mr-2" />
              Contact Number <span className="text-red-500">*</span>
            </label>
            <input
              type="tel"
              value={formData.contactNumber}
              onChange={(e) => handleInputChange('contactNumber', e.target.value)}
              onBlur={() => handleBlur('contactNumber')}
              className={`w-full px-4 py-3 border-2 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors ${
                errors.contactNumber && touched.contactNumber ? 'border-red-300 bg-red-50' : 'border-gray-200'
              }`}
              placeholder="09XX-XXX-XXXX"
            />
            {errors.contactNumber && touched.contactNumber && (
              <p className="text-red-500 text-sm mt-1 flex items-center">
                <span className="inline-block w-1 h-1 bg-red-500 rounded-full mr-2"></span>
                {errors.contactNumber}
              </p>
            )}
          </div>

          {/* Date and Time Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Date Field */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                <Calendar className="h-4 w-4 inline mr-2" />
                Pick-up Date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => handleInputChange('date', e.target.value)}
                onBlur={() => handleBlur('date')}
                min={new Date().toISOString().split('T')[0]}
                className={`w-full px-4 py-3 border-2 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors ${
                  errors.date && touched.date ? 'border-red-300 bg-red-50' : 'border-gray-200'
                }`}
              />
              {errors.date && touched.date && (
                <p className="text-red-500 text-sm mt-1 flex items-center">
                  <span className="inline-block w-1 h-1 bg-red-500 rounded-full mr-2"></span>
                  {errors.date}
                </p>
              )}
            </div>

            {/* Time Field */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                <Clock className="h-4 w-4 inline mr-2" />
                Pick-up Time <span className="text-red-500">*</span>
              </label>
              <input
                type="time"
                value={formData.pickupTime}
                onChange={(e) => handleInputChange('pickupTime', e.target.value)}
                onBlur={() => handleBlur('pickupTime')}
                className={`w-full px-4 py-3 border-2 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors ${
                  errors.pickupTime && touched.pickupTime ? 'border-red-300 bg-red-50' : 'border-gray-200'
                }`}
              />
              {errors.pickupTime && touched.pickupTime && (
                <p className="text-red-500 text-sm mt-1 flex items-center">
                  <span className="inline-block w-1 h-1 bg-red-500 rounded-full mr-2"></span>
                  {errors.pickupTime}
                </p>
              )}
            </div>
          </div>

          {/* Remarks Field */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              <FileText className="h-4 w-4 inline mr-2" />
              Remarks <span className="text-gray-400 text-xs">(Optional)</span>
            </label>
            <textarea
              value={formData.remarks}
              onChange={(e) => handleInputChange('remarks', e.target.value)}
              rows={3}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors resize-none"
              placeholder="Special instructions, size preferences, etc."
            />
          </div>

          {/* Required Fields Notice */}
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
            <p className="text-sm text-orange-700">
              <span className="text-red-500">*</span> Required fields must be filled to place your order
            </p>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={!isFormValid()}
            className={`w-full font-semibold py-3 px-6 rounded-lg transition-all duration-200 shadow-lg ${
              isFormValid()
                ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white hover:from-orange-600 hover:to-amber-600 transform hover:scale-[1.02] cursor-pointer'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            {isFormValid() ? 'Place Order' : 'Please Fill All Required Fields'}
          </button>
        </form>
      </div>

      {/* Success Message */}
      {showSuccess && (
        <div className="fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center animate-slideInRight z-50">
          <CheckCircle className="h-5 w-5 mr-2" />
          Order placed successfully!
        </div>
      )}
    </div>
  );
};

export default CustomerForm;
