'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowLeft, CreditCard, Truck, MapPin, Clock, Shield, CheckCircle } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import Header from '@/components/Header';
import OrderSuccessAnimation from '@/components/OrderSuccessAnimation';
import Footer from '@/components/Footer';

interface DeliveryAddress {
  fullName: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  landmark?: string;
}

interface TimeSlot {
  id: string;
  time: string;
  available: boolean;
}

const CheckoutPage = () => {
  const { cart, clearCart } = useCart();
  const { user, openLoginModal } = useAuth();
  const [step, setStep] = useState(1); // 1: Address, 2: Time Slot, 3: Payment, 4: Confirmation
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [selectedTimeSlot, setSelectedTimeSlot] = useState('');  const [isLoading, setIsLoading] = useState(false);
  const [orderId, setOrderId] = useState('');
  const [showOrderSuccess, setShowOrderSuccess] = useState(false);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!user) {
      openLoginModal();
    }
  }, [user, openLoginModal]);

  const [deliveryAddress, setDeliveryAddress] = useState<DeliveryAddress>({
    fullName: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    landmark: ''
  });
  const timeSlots: TimeSlot[] = [
    { id: '1', time: '9:00 AM - 10:00 AM', available: true },
    { id: '2', time: '10:00 AM - 11:00 AM', available: true },
    { id: '3', time: '11:00 AM - 12:00 PM', available: true },
    { id: '4', time: '12:00 PM - 1:00 PM', available: true },
    { id: '5', time: '1:00 PM - 2:00 PM', available: true },
    { id: '6', time: '2:00 PM - 3:00 PM', available: false },
    { id: '7', time: '3:00 PM - 4:00 PM', available: true },
    { id: '8', time: '4:00 PM - 5:00 PM', available: true },
    { id: '9', time: '5:00 PM - 6:00 PM', available: true },
    { id: '10', time: '6:00 PM - 7:00 PM', available: true },
    { id: '11', time: '7:00 PM - 8:00 PM', available: true },
    { id: '12', time: '8:00 PM - 9:00 PM', available: false },
  ];

  const handleAddressSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (deliveryAddress.fullName && deliveryAddress.phone && deliveryAddress.address && deliveryAddress.city) {
      setStep(2);
    }
  };

  const handleTimeSlotSubmit = () => {
    if (selectedTimeSlot) {
      setStep(3);
    }
  };
  const handlePaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {      if (!user) {
        throw new Error('User not authenticated');
      }

      if (!cart || cart.items.length === 0) {
        throw new Error('Cart is empty');
      }

      console.log('🔍 Debug checkout - User object:', user);
      console.log('🔍 Debug checkout - User ID:', user.id);
      console.log('🔍 Debug checkout - User email:', user.email);

      // Prepare order data
      const orderData = {
        userId: user.id,
        items: cart.items.map(item => ({
          productId: item.id,
          name: item.name,
          brand: item.brand,
          price: item.price,
          quantity: item.quantity,
          image: item.image,
          size: '50ml' // Default size, you can make this dynamic
        })),
        totalAmount: cart.summary.total,
        shippingAddress: {
          fullName: deliveryAddress.fullName,
          email: user.email,
          phone: deliveryAddress.phone,
          street: deliveryAddress.address,
          city: deliveryAddress.city,
          state: deliveryAddress.state,
          zipCode: deliveryAddress.zipCode,
          country: 'USA'
        }
      };

      console.log('Submitting order:', orderData);

      // Create order in database
      const response = await fetch('http://localhost:5000/api/orders/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create order');
      }

      const result = await response.json();
      console.log('✅ Order created successfully:', result);      // Set the order ID from the response
      setOrderId(result.order.orderNumber);
      
      // Clear cart
      await clearCart();
      
      // Show success animation instead of going to step 4
      setShowOrderSuccess(true);
    } catch (error) {
      console.error('❌ Order failed:', error);
      alert(`Order failed: ${error instanceof Error ? error.message : 'Please try again.'}`);
    } finally {
      setIsLoading(false);
    }
  };

  if (!cart || cart.items.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-sky-50 via-golden-50 to-nature-50">
        <Header />
        <div className="max-w-4xl mx-auto px-4 py-16 text-center">
          <h1 className="text-3xl font-bold text-primary-800 mb-4">Your cart is empty</h1>
          <Link href="/products" className="text-golden-600 hover:text-golden-700">
            Continue Shopping
          </Link>
        </div>
        <Footer />
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-golden-50 to-nature-50">
      <Header />
      
      {/* Order Success Animation */}
      {showOrderSuccess && (
        <OrderSuccessAnimation
          orderNumber={orderId}
          onClose={() => {
            setShowOrderSuccess(false);
            window.location.href = '/products'; // Redirect to products page
          }}
        />
      )}

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 space-y-4 md:space-y-0">
          <Link href="/cart">
            <motion.button
              whileHover={{ scale: 1.05 }}
              className="flex items-center space-x-2 text-primary-700 hover:text-golden-600 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back to Cart</span>
            </motion.button>
          </Link>
          <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-golden-600 to-nature-600 bg-clip-text text-transparent">
            Checkout
          </h1>
        </div>        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-center space-x-2 md:space-x-4">
            {[1, 2, 3, 4].map((stepNum) => (
              <div key={stepNum} className="flex items-center">
                <div className={`w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center font-bold text-sm md:text-base ${
                  step >= stepNum 
                    ? 'bg-gradient-to-r from-golden-500 to-golden-600 text-white' 
                    : 'bg-gray-200 text-gray-500'
                }`}>
                  {step > stepNum ? <CheckCircle className="w-4 h-4 md:w-6 md:h-6" /> : stepNum}
                </div>
                {stepNum < 4 && (
                  <div className={`w-8 md:w-16 h-1 mx-1 md:mx-2 ${
                    step > stepNum ? 'bg-golden-500' : 'bg-gray-200'
                  }`} />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-center mt-4">
            <div className="flex space-x-8 md:space-x-20 text-xs md:text-sm text-primary-600">
              <span className={step >= 1 ? 'text-golden-600 font-semibold' : ''}>Address</span>
              <span className={step >= 2 ? 'text-golden-600 font-semibold' : ''}>Time</span>
              <span className={step >= 3 ? 'text-golden-600 font-semibold' : ''}>Payment</span>
              <span className={step >= 4 ? 'text-golden-600 font-semibold' : ''}>Done</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Step 1: Delivery Address */}
            {step === 1 && (              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl p-4 md:p-6 border border-golden-200"
              >
                <div className="flex items-center space-x-3 mb-6">
                  <MapPin className="w-5 h-5 md:w-6 md:h-6 text-golden-600" />
                  <h2 className="text-xl md:text-2xl font-bold text-primary-800">Delivery Address</h2>
                </div>

                <form onSubmit={handleAddressSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-primary-700 mb-2">Full Name *</label>
                      <input
                        type="text"
                        required
                        value={deliveryAddress.fullName}
                        onChange={(e) => setDeliveryAddress({...deliveryAddress, fullName: e.target.value})}
                        className="w-full px-4 py-3 rounded-lg border border-golden-200 focus:ring-2 focus:ring-golden-500 focus:border-transparent"
                        placeholder="Enter your full name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-primary-700 mb-2">Phone Number *</label>
                      <input
                        type="tel"
                        required
                        value={deliveryAddress.phone}
                        onChange={(e) => setDeliveryAddress({...deliveryAddress, phone: e.target.value})}
                        className="w-full px-4 py-3 rounded-lg border border-golden-200 focus:ring-2 focus:ring-golden-500 focus:border-transparent"
                        placeholder="Enter your phone number"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-primary-700 mb-2">Address *</label>
                    <textarea
                      required
                      value={deliveryAddress.address}
                      onChange={(e) => setDeliveryAddress({...deliveryAddress, address: e.target.value})}
                      className="w-full px-4 py-3 rounded-lg border border-golden-200 focus:ring-2 focus:ring-golden-500 focus:border-transparent"
                      rows={3}
                      placeholder="Enter your complete address"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-primary-700 mb-2">City *</label>
                      <input
                        type="text"
                        required
                        value={deliveryAddress.city}
                        onChange={(e) => setDeliveryAddress({...deliveryAddress, city: e.target.value})}
                        className="w-full px-4 py-3 rounded-lg border border-golden-200 focus:ring-2 focus:ring-golden-500 focus:border-transparent"
                        placeholder="City"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-primary-700 mb-2">State *</label>
                      <input
                        type="text"
                        required
                        value={deliveryAddress.state}
                        onChange={(e) => setDeliveryAddress({...deliveryAddress, state: e.target.value})}
                        className="w-full px-4 py-3 rounded-lg border border-golden-200 focus:ring-2 focus:ring-golden-500 focus:border-transparent"
                        placeholder="State"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-primary-700 mb-2">ZIP Code *</label>
                      <input
                        type="text"
                        required
                        value={deliveryAddress.zipCode}
                        onChange={(e) => setDeliveryAddress({...deliveryAddress, zipCode: e.target.value})}
                        className="w-full px-4 py-3 rounded-lg border border-golden-200 focus:ring-2 focus:ring-golden-500 focus:border-transparent"
                        placeholder="ZIP Code"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-primary-700 mb-2">Landmark (Optional)</label>
                    <input
                      type="text"
                      value={deliveryAddress.landmark}
                      onChange={(e) => setDeliveryAddress({...deliveryAddress, landmark: e.target.value})}
                      className="w-full px-4 py-3 rounded-lg border border-golden-200 focus:ring-2 focus:ring-golden-500 focus:border-transparent"
                      placeholder="Nearby landmark"
                    />
                  </div>                  <motion.button
                    type="submit"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full bg-gradient-to-r from-golden-500 to-golden-600 text-white py-4 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all relative z-10"
                    style={{ backgroundColor: '#d97706', color: '#ffffff' }}
                  >
                    Continue to Time Slot
                  </motion.button>
                </form>
              </motion.div>
            )}            {/* Step 2: Time Slot Selection */}
            {step === 2 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl p-4 md:p-6 border border-golden-200"
              >
                <div className="flex items-center space-x-3 mb-6">
                  <Clock className="w-5 h-5 md:w-6 md:h-6 text-golden-600" />
                  <h2 className="text-xl md:text-2xl font-bold text-primary-800">Select Delivery Time</h2>
                </div>                <div className="mb-6">
                  <label className="block text-sm font-medium text-primary-700 mb-3">
                    Select Delivery Time Slot *
                  </label>
                  <select
                    value={selectedTimeSlot}
                    onChange={(e) => setSelectedTimeSlot(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg border border-golden-200 focus:ring-2 focus:ring-golden-500 focus:border-transparent bg-white text-primary-800 font-medium"
                    required
                  >
                    <option value="">Please select a time slot</option>
                    {timeSlots.map((slot) => (
                      <option 
                        key={slot.id} 
                        value={slot.id}
                        disabled={!slot.available}
                        className={slot.available ? 'text-primary-800' : 'text-gray-400'}
                      >
                        {slot.time} {slot.available ? '(Available)' : '(Not Available)'}
                      </option>
                    ))}
                  </select>
                </div>                <div className="flex flex-col md:flex-row space-y-3 md:space-y-0 md:space-x-4">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    onClick={() => setStep(1)}
                    className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-300 transition-colors relative z-10"
                    style={{ backgroundColor: '#e5e7eb', color: '#374151' }}
                  >
                    Back
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    onClick={handleTimeSlotSubmit}
                    disabled={!selectedTimeSlot}
                    className="flex-1 bg-gradient-to-r from-golden-500 to-golden-600 text-white py-3 rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed relative z-10"
                    style={{ backgroundColor: '#d97706', color: '#ffffff' }}
                  >
                    Continue to Payment
                  </motion.button>
                </div>
              </motion.div>
            )}            {/* Step 3: Payment Method */}
            {step === 3 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl p-4 md:p-6 border border-golden-200"
              >
                <div className="flex items-center space-x-3 mb-6">
                  <CreditCard className="w-5 h-5 md:w-6 md:h-6 text-golden-600" />
                  <h2 className="text-xl md:text-2xl font-bold text-primary-800">Payment Method</h2>
                </div>

                <form onSubmit={handlePaymentSubmit} className="space-y-4">
                  <div className="space-y-3">
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                        paymentMethod === 'cod'
                          ? 'border-golden-500 bg-golden-50'
                          : 'border-golden-200 hover:border-golden-300'
                      }`}
                      onClick={() => setPaymentMethod('cod')}
                    >
                      <div className="flex items-center space-x-3">
                        <div className={`w-4 h-4 rounded-full border-2 ${
                          paymentMethod === 'cod' ? 'border-golden-500 bg-golden-500' : 'border-gray-300'
                        }`} />
                        <Truck className="w-5 h-5 text-golden-600" />
                        <div>
                          <div className="font-semibold text-primary-800">Cash on Delivery</div>
                          <div className="text-sm text-primary-600">Pay when your order arrives</div>
                        </div>
                      </div>
                    </motion.div>

                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                        paymentMethod === 'card'
                          ? 'border-golden-500 bg-golden-50'
                          : 'border-golden-200 hover:border-golden-300'
                      }`}
                      onClick={() => setPaymentMethod('card')}
                    >
                      <div className="flex items-center space-x-3">
                        <div className={`w-4 h-4 rounded-full border-2 ${
                          paymentMethod === 'card' ? 'border-golden-500 bg-golden-500' : 'border-gray-300'
                        }`} />
                        <CreditCard className="w-5 h-5 text-golden-600" />
                        <div>
                          <div className="font-semibold text-primary-800">Credit/Debit Card</div>
                          <div className="text-sm text-primary-600">Secure online payment</div>
                        </div>
                      </div>
                    </motion.div>
                  </div>

                  {paymentMethod === 'card' && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="space-y-4 mt-6 p-4 bg-golden-50 rounded-lg border border-golden-200"
                    >
                      <div>
                        <label className="block text-sm font-medium text-primary-700 mb-2">Card Number</label>
                        <input
                          type="text"
                          className="w-full px-4 py-3 rounded-lg border border-golden-200 focus:ring-2 focus:ring-golden-500"
                          placeholder="1234 5678 9012 3456"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-primary-700 mb-2">Expiry Date</label>
                          <input
                            type="text"
                            className="w-full px-4 py-3 rounded-lg border border-golden-200 focus:ring-2 focus:ring-golden-500"
                            placeholder="MM/YY"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-primary-700 mb-2">CVV</label>
                          <input
                            type="text"
                            className="w-full px-4 py-3 rounded-lg border border-golden-200 focus:ring-2 focus:ring-golden-500"
                            placeholder="123"
                          />
                        </div>
                      </div>
                    </motion.div>
                  )}                  <div className="flex flex-col md:flex-row space-y-3 md:space-y-0 md:space-x-4 mt-6">
                    <motion.button
                      type="button"
                      whileHover={{ scale: 1.02 }}
                      onClick={() => setStep(2)}
                      className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-300 transition-colors relative z-10"
                      style={{ backgroundColor: '#e5e7eb', color: '#374151' }}
                    >
                      Back
                    </motion.button>
                    <motion.button
                      type="submit"
                      whileHover={{ scale: 1.02 }}
                      disabled={isLoading}
                      className="flex-1 bg-gradient-to-r from-golden-500 to-golden-600 text-white py-3 rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed relative z-10"
                      style={{ backgroundColor: '#d97706', color: '#ffffff' }}
                    >
                      {isLoading ? 'Processing...' : 'Place Order'}
                    </motion.button>
                  </div>
                </form>
              </motion.div>
            )}            {/* Step 4: Order Confirmation */}
            {step === 4 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl p-6 md:p-8 border border-golden-200 text-center"
              >
                <div className="w-16 h-16 md:w-20 md:h-20 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle className="w-8 h-8 md:w-10 md:h-10 text-white" />
                </div>
                
                <h2 className="text-2xl md:text-3xl font-bold text-primary-800 mb-4">Order Confirmed!</h2>
                <p className="text-base md:text-lg text-primary-600 mb-6">
                  Thank you for your order. Your order ID is <span className="font-bold text-golden-600">#{orderId}</span>
                </p>
                
                <div className="bg-golden-50 rounded-lg p-4 md:p-6 mb-6">
                  <h3 className="font-semibold text-primary-800 mb-4">Order Details</h3>
                  <div className="space-y-2 text-left text-sm md:text-base">
                    <div className="flex justify-between">
                      <span>Delivery Address:</span>
                      <span className="text-right">{deliveryAddress.address}, {deliveryAddress.city}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Delivery Time:</span>
                      <span>{timeSlots.find(slot => slot.id === selectedTimeSlot)?.time}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Payment Method:</span>
                      <span>{paymentMethod === 'cod' ? 'Cash on Delivery' : 'Card Payment'}</span>
                    </div>
                  </div>
                </div>                <div className="flex flex-col md:flex-row space-y-3 md:space-y-0 md:space-x-4">
                  <Link href="/products" className="flex-1">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      className="w-full bg-gray-200 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-300 transition-colors relative z-10"
                      style={{ backgroundColor: '#e5e7eb', color: '#374151' }}
                    >
                      Continue Shopping
                    </motion.button>
                  </Link>
                  <Link href="/" className="flex-1">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      className="w-full bg-gradient-to-r from-golden-500 to-golden-600 text-white py-3 rounded-lg font-semibold relative z-10"
                      style={{ backgroundColor: '#d97706', color: '#ffffff' }}
                    >
                      Go to Home
                    </motion.button>
                  </Link>
                </div>
              </motion.div>
            )}
          </div>          {/* Order Summary Sidebar */}
          {step < 4 && (
            <div className="lg:col-span-1 order-first lg:order-last">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl p-4 md:p-6 border border-golden-200 lg:sticky lg:top-24 mb-6 lg:mb-0"
              >
                <h3 className="text-lg md:text-xl font-bold text-primary-800 mb-4">Order Summary</h3>
                
                <div className="space-y-3 mb-6">
                  {cart.items.map((item) => (
                    <div key={item.id} className="flex items-center space-x-3">
                      <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-golden-100 to-nature-100 rounded-lg flex items-center justify-center">
                        <span className="text-golden-700 text-sm md:text-base">🧴</span>
                      </div>
                      <div className="flex-1">
                        <div className="font-medium text-primary-800 text-sm">{item.name}</div>
                        <div className="text-primary-600 text-xs">Qty: {item.quantity}</div>
                      </div>
                      <div className="font-semibold text-primary-800 text-sm">₹{(item.price * item.quantity).toFixed(2)}</div>
                    </div>
                  ))}
                </div>

                <div className="border-t border-golden-200 pt-4 space-y-2">
                  <div className="flex justify-between text-primary-700 text-sm">
                    <span>Subtotal</span>
                    <span>₹{cart.summary.subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-primary-700 text-sm">
                    <span>Shipping</span>
                    <span>{cart.summary.shipping === 0 ? 'Free' : `₹${cart.summary.shipping.toFixed(2)}`}</span>
                  </div>
                  <div className="flex justify-between text-primary-700 text-sm">
                    <span>Tax</span>
                    <span>₹{cart.summary.tax.toFixed(2)}</span>
                  </div>
                  <div className="border-t border-golden-200 pt-2">
                    <div className="flex justify-between text-lg md:text-xl font-bold text-primary-800">
                      <span>Total</span>
                      <span>₹{cart.summary.total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-6 p-3 bg-green-50 rounded-lg border border-green-200">
                  <div className="flex items-center space-x-2">
                    <Shield className="w-4 h-4 md:w-5 md:h-5 text-green-600" />
                    <span className="text-xs md:text-sm text-green-700 font-medium">Secure Checkout</span>
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default CheckoutPage;
