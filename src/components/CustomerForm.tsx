import React, { useState } from 'react';
import { User, Phone, Calendar, Clock, FileText, ChefHat, CheckCircle } from 'lucide-react';
import { Order } from '../types/Order';

interface CustomerFormProps {
  onAddOrder: (order: Order) => void;
}

const CustomerForm: React.FC<CustomerFormProps> = ({ onAddOrder }) => {
  const [formData, setFormData] = useState({
    name: '',
    contactNumber: '',
    date: '',
    pickupTime: '',
    remarks: ''
  });
  const [showSuccess, setShowSuccess] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Customer name is required';
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

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Mark all fields as touched to show validation errors
    setTouched({
      name: true,
      contactNumber: true,
      date: true,
      pickupTime: true
    });

    if (!validateForm()) {
      return;
    }

    const newOrder: Order = {
      id: Date.now().toString(),
      ...formData,
      status: 'Cook', // Default status for new orders
      createdAt: new Date().toISOString()
    };

    onAddOrder(newOrder);
    
    // Reset form
    setFormData({
      name: '',
      contactNumber: '',
      date: '',
      pickupTime: '',
      remarks: ''
    });
    
    setTouched({});
    setErrors({});
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleBlur = (field: string) => {
    setTouched(prev => ({ ...prev, [field]: true }));
    validateForm();
  };

  const isFormValid = () => {
    return formData.name.trim() && 
           formData.contactNumber.trim() && 
           formData.date && 
           formData.pickupTime;
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