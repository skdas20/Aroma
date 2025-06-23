'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Package, Clock, Truck, CheckCircle, XCircle, Eye, MessageSquare, LifeBuoy } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import SupportTicketModal from '@/components/SupportTicketModal';
import MyTicketsModal from '@/components/MyTicketsModal';

interface OrderItem {
  productId: string;
  name: string;
  brand: string;
  price: number;
  quantity: number;
  image: string;
  size: string;
}

interface Order {
  _id: string;
  orderNumber: string;
  items: OrderItem[];
  totalAmount: number;
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  orderDate: string;
  estimatedDelivery?: string;
  trackingNumber?: string;
  shippingAddress: {
    fullName: string;
    email: string;
    phone: string;
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
}

const statusColors = {
  pending: 'bg-yellow-100 text-yellow-800',
  confirmed: 'bg-blue-100 text-blue-800',
  processing: 'bg-purple-100 text-purple-800',
  shipped: 'bg-orange-100 text-orange-800',
  delivered: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800'
};

const statusIcons = {
  pending: Clock,
  confirmed: CheckCircle,
  processing: Package,
  shipped: Truck,
  delivered: CheckCircle,
  cancelled: XCircle
};

export default function OrdersPage() {
  const { user } = useAuth();  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
  const [supportModalOpen, setSupportModalOpen] = useState(false);
  const [myTicketsModalOpen, setMyTicketsModalOpen] = useState(false);
  const [selectedOrderForSupport, setSelectedOrderForSupport] = useState<{ orderNumber: string; orderId: string } | null>(null);

  useEffect(() => {
    if (user) {
      fetchOrders();
    }
  }, [user, selectedStatus]);

  const fetchOrders = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      const statusQuery = selectedStatus !== 'all' ? `&status=${selectedStatus}` : '';
      const response = await fetch(`http://localhost:5000/api/orders/user/${user.id}?${statusQuery}`);
      
      if (response.ok) {
        const data = await response.json();
        setOrders(data.orders || []);
      } else {
        throw new Error('Failed to fetch orders');
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
      setError('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(price);
  };
  const getStatusIcon = (status: string) => {
    const IconComponent = statusIcons[status as keyof typeof statusIcons] || Package;
    return <IconComponent className="w-4 h-4" />;
  };

  const handleRaiseComplaint = (orderNumber: string, orderId: string) => {
    setSelectedOrderForSupport({ orderNumber, orderId });
    setSupportModalOpen(true);
  };

  const handleViewMyTickets = () => {
    setMyTicketsModalOpen(true);
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center p-8 bg-white rounded-2xl shadow-lg"
        >
          <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Please Sign In</h2>
          <p className="text-gray-600">Sign in to view your orders</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 py-8">
      <div className="max-w-6xl mx-auto px-4">        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary-700 to-golden-600 bg-clip-text text-transparent mb-4">
            My Orders
          </h1>
          <p className="text-gray-600 mb-6">Track your fragrance journey</p>
          
          {/* View My Tickets Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleViewMyTickets}
            className="inline-flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-full font-medium hover:shadow-lg transition-all duration-300"
          >
            <LifeBuoy className="w-5 h-5" />
            <span>View My Support Tickets</span>
          </motion.button>
        </motion.div>

        {/* Status Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex flex-wrap gap-2 justify-center">
            {['all', 'pending', 'confirmed', 'processing', 'shipped', 'delivered'].map((status) => (
              <button
                key={status}
                onClick={() => setSelectedStatus(status)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  selectedStatus === status
                    ? 'bg-gradient-to-r from-primary-600 to-golden-600 text-white shadow-lg'
                    : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
                }`}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-2 border-primary-600 border-t-transparent"></div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <XCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Something went wrong</h3>
            <p className="text-gray-600 mb-4">{error}</p>
            <button
              onClick={fetchOrders}
              className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
            >
              Try Again
            </button>
          </motion.div>
        )}

        {/* Orders List */}
        {!loading && !error && (
          <AnimatePresence>
            {orders.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-12"
              >
                <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-800 mb-2">No orders found</h3>
                <p className="text-gray-600">Start shopping to see your orders here!</p>
              </motion.div>
            ) : (
              <div className="space-y-4">
                {orders.map((order, index) => (
                  <motion.div
                    key={order._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-white rounded-2xl shadow-lg overflow-hidden"
                  >                    {/* Order Header */}
                    <div className="p-6 border-b border-gray-100">
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex items-center space-x-4">
                          <div className="flex-shrink-0">
                            {getStatusIcon(order.status)}
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-800">
                              Order #{order.orderNumber}
                            </h3>
                            <p className="text-sm text-gray-600">
                              Placed on {formatDate(order.orderDate)}
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[order.status]}`}>
                            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                          </span>
                          <span className="font-semibold text-lg text-gray-800">
                            {formatPrice(order.totalAmount)}
                          </span>
                          
                          {/* Support Actions - Always Visible */}
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleRaiseComplaint(order.orderNumber, order._id)}
                            className="inline-flex items-center space-x-1 px-3 py-2 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-lg text-xs font-medium hover:shadow-lg transition-all duration-300"
                            title="Raise Complaint"
                          >
                            <MessageSquare className="w-4 h-4" />
                            <span className="hidden sm:inline">Complaint</span>
                          </motion.button>
                          
                          <button
                            onClick={() => setExpandedOrder(expandedOrder === order._id ? null : order._id)}
                            className="p-2 text-gray-400 hover:text-primary-600 transition-colors"
                            title="View Details"
                          >
                            <Eye className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Order Details (Expandable) */}
                    <AnimatePresence>
                      {expandedOrder === order._id && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3 }}
                          className="overflow-hidden"
                        >
                          <div className="p-6 bg-gray-50">
                            {/* Order Items */}
                            <div className="mb-6">
                              <h4 className="font-medium text-gray-800 mb-4">Order Items</h4>
                              <div className="space-y-3">
                                {order.items.map((item, itemIndex) => (
                                  <div key={itemIndex} className="flex items-center space-x-4 bg-white p-4 rounded-lg">
                                    <img
                                      src={item.image}
                                      alt={item.name}
                                      className="w-16 h-16 object-cover rounded-lg"
                                    />
                                    <div className="flex-1">
                                      <h5 className="font-medium text-gray-800">{item.name}</h5>
                                      <p className="text-sm text-gray-600">{item.brand} • {item.size}</p>
                                      <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                                    </div>
                                    <div className="text-right">
                                      <p className="font-medium text-gray-800">{formatPrice(item.price)}</p>
                                      <p className="text-sm text-gray-600">each</p>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>

                            {/* Shipping Address */}
                            <div className="mb-6">
                              <h4 className="font-medium text-gray-800 mb-4">Shipping Address</h4>
                              <div className="bg-white p-4 rounded-lg">
                                <p className="font-medium text-gray-800">{order.shippingAddress.fullName}</p>
                                <p className="text-gray-600">{order.shippingAddress.email}</p>
                                <p className="text-gray-600">{order.shippingAddress.phone}</p>
                                <p className="text-gray-600">{order.shippingAddress.street}</p>
                                <p className="text-gray-600">
                                  {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}
                                </p>
                                <p className="text-gray-600">{order.shippingAddress.country}</p>
                              </div>
                            </div>

                            {/* Tracking Info */}
                            {order.trackingNumber && (
                              <div className="mb-6">
                                <h4 className="font-medium text-gray-800 mb-4">Tracking Information</h4>
                                <div className="bg-white p-4 rounded-lg">
                                  <p className="text-gray-600">Tracking Number</p>
                                  <p className="font-mono text-lg text-primary-600">{order.trackingNumber}</p>
                                </div>
                              </div>
                            )}                            {/* Estimated Delivery */}
                            {order.estimatedDelivery && (
                              <div className="mb-6">
                                <h4 className="font-medium text-gray-800 mb-4">Estimated Delivery</h4>
                                <div className="bg-white p-4 rounded-lg">
                                  <p className="text-lg text-green-600 font-medium">
                                    {formatDate(order.estimatedDelivery)}
                                  </p>
                                </div>
                              </div>
                            )}

                            {/* Support Actions */}
                            <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-200">
                              <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => handleRaiseComplaint(order.orderNumber, order._id)}
                                className="flex-1 inline-flex items-center justify-center space-x-2 px-4 py-3 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-lg font-medium hover:shadow-lg transition-all duration-300"
                              >
                                <MessageSquare className="w-5 h-5" />
                                <span>Raise Complaint</span>
                              </motion.button>
                              
                              <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={handleViewMyTickets}
                                className="flex-1 inline-flex items-center justify-center space-x-2 px-4 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg font-medium hover:shadow-lg transition-all duration-300"
                              >
                                <LifeBuoy className="w-5 h-5" />
                                <span>My Tickets</span>
                              </motion.button>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                ))}
              </div>
            )}          </AnimatePresence>
        )}
      </div>

      {/* Support Ticket Modal */}
      {selectedOrderForSupport && (
        <SupportTicketModal
          isOpen={supportModalOpen}
          onClose={() => {
            setSupportModalOpen(false);
            setSelectedOrderForSupport(null);
          }}
          orderNumber={selectedOrderForSupport.orderNumber}          orderId={selectedOrderForSupport.orderId}
          userEmail={user?.email || ''}
          userName={user?.displayName || ''}
          userId={user?.id || ''}
        />
      )}      {/* My Tickets Modal */}
      <MyTicketsModal
        isOpen={myTicketsModalOpen}
        onClose={() => setMyTicketsModalOpen(false)}
      />
    </div>
  );
}
