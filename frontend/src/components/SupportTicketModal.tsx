'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, MessageSquare, Send, AlertCircle, CheckCircle } from 'lucide-react';

interface SupportTicketModalProps {
  isOpen: boolean;
  onClose: () => void;
  orderNumber: string;
  orderId: string;
  userEmail: string;
  userName: string;
  userId: string;
}

export default function SupportTicketModal({ 
  isOpen, 
  onClose, 
  orderNumber, 
  orderId, 
  userEmail, 
  userName,
  userId 
}: SupportTicketModalProps) {
  const [formData, setFormData] = useState({
    subject: '',
    message: '',
    priority: 'medium'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {      const response = await fetch('http://localhost:5000/api/support/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: userId,
          subject: formData.subject,
          message: formData.message,
          priority: formData.priority,
          orderReference: orderId
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to submit ticket');
      }

      const result = await response.json();
      setIsSuccess(true);
      
      // Reset form
      setFormData({
        subject: '',
        message: '',
        priority: 'medium'
      });

      // Close modal after 2 seconds
      setTimeout(() => {
        setIsSuccess(false);
        onClose();
      }, 2000);

    } catch (error: any) {
      setError(error.message || 'Failed to submit ticket. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-indigo-50">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <MessageSquare className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-800">Raise Support Ticket</h2>
                  <p className="text-sm text-gray-600">Order #{orderNumber}</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
          </div>

          {/* Success State */}
          {isSuccess && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-8 text-center"
            >
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Ticket Submitted Successfully!</h3>
              <p className="text-gray-600">
                Our support team will review your request and respond within 24 hours.
              </p>
            </motion.div>
          )}

          {/* Form */}
          {!isSuccess && (
            <form onSubmit={handleSubmit} className="p-6">
              {/* Error Message */}
              {error && (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center space-x-2"
                >
                  <AlertCircle className="w-4 h-4 text-red-600" />
                  <span className="text-sm text-red-600">{error}</span>
                </motion.div>
              )}

              {/* Priority */}
              <div className="mb-4">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Priority Level
                </label>
                <select
                  value={formData.priority}
                  onChange={(e) => setFormData(prev => ({ ...prev, priority: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  required
                >
                  <option value="low">🟢 Low - General inquiry</option>
                  <option value="medium">🟡 Medium - Order issue</option>
                  <option value="high">🔴 High - Urgent problem</option>
                </select>
              </div>

              {/* Subject */}
              <div className="mb-4">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Subject *
                </label>
                <input
                  type="text"
                  value={formData.subject}
                  onChange={(e) => setFormData(prev => ({ ...prev, subject: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  placeholder="Brief description of your issue..."
                  required
                />
              </div>

              {/* Message */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Detailed Message *
                </label>
                <textarea
                  value={formData.message}
                  onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
                  rows={5}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none"
                  placeholder="Please describe your issue in detail. Include any relevant information about your order, delivery, or product concerns..."
                  required
                />
              </div>

              {/* Order Info */}
              <div className="mb-6 p-4 bg-gray-50 rounded-xl">
                <h4 className="font-semibold text-gray-700 mb-2">Order Information</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Order Number:</span>
                    <span className="font-medium text-gray-800 ml-2">#{orderNumber}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Customer:</span>
                    <span className="font-medium text-gray-800 ml-2">{userName}</span>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-6 py-3 border border-gray-200 text-gray-600 rounded-xl hover:bg-gray-50 transition-colors"
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-xl hover:from-blue-600 hover:to-indigo-600 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                      <span>Submitting...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Submit Ticket</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
