'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Download, Eye, Search, Calendar, DollarSign, Package, Users } from 'lucide-react';
import Header from '@/components/Header';

interface Order {
  id: string;
  customerName: string;
  email: string;
  phone: string;
  products: Array<{
    id: number;
    name: string;
    brand: string;
    price: number;
    quantity: number;
  }>;
  total: number;
  status: 'pending' | 'completed' | 'shipped' | 'delivered';
  orderDate: string;
  deliveryAddress: string;
  paymentMethod: 'cod' | 'online';
}

export default function AdminPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showBillModal, setShowBillModal] = useState(false);

  // Mock data - replace with actual API calls
  useEffect(() => {
    const mockOrders: Order[] = [
      {
        id: 'ORD-001',
        customerName: 'John Doe',
        email: 'john@example.com',
        phone: '+91 9876543210',
        products: [
          { id: 1, name: 'Chanel No. 5', brand: 'Chanel', price: 150, quantity: 1 },
          { id: 2, name: 'Dior Sauvage', brand: 'Dior', price: 120, quantity: 2 }
        ],
        total: 390,
        status: 'completed',
        orderDate: '2025-01-15',
        deliveryAddress: '123 Main St, Delhi, India',
        paymentMethod: 'cod'
      },
      {
        id: 'ORD-002',
        customerName: 'Jane Smith',
        email: 'jane@example.com',
        phone: '+91 9876543211',
        products: [
          { id: 3, name: 'Tom Ford Black Orchid', brand: 'Tom Ford', price: 200, quantity: 1 }
        ],
        total: 200,
        status: 'pending',
        orderDate: '2025-01-16',
        deliveryAddress: '456 Park Ave, Mumbai, India',
        paymentMethod: 'online'
      }
    ];
    setOrders(mockOrders);
    setFilteredOrders(mockOrders);
  }, []);

  // Filter orders based on search and status
  useEffect(() => {
    let filtered = orders;
    
    if (searchTerm) {
      filtered = filtered.filter(order =>
        order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (selectedStatus !== 'all') {
      filtered = filtered.filter(order => order.status === selectedStatus);
    }
    
    setFilteredOrders(filtered);
  }, [searchTerm, selectedStatus, orders]);

  const generateBill = (order: Order) => {
    const billContent = `
<!DOCTYPE html>
<html>
<head>
    <title>Invoice - ${order.id}</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; color: #333; }
        .header { text-align: center; margin-bottom: 30px; border-bottom: 2px solid #d4af37; padding-bottom: 20px; }
        .company-name { font-size: 24px; font-weight: bold; color: #d4af37; margin-bottom: 10px; }
        .invoice-details { display: flex; justify-content: space-between; margin-bottom: 30px; }
        .customer-details, .invoice-info { width: 45%; }
        .table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
        .table th, .table td { border: 1px solid #ddd; padding: 10px; text-align: left; }
        .table th { background-color: #f8f9fa; font-weight: bold; }
        .total-section { text-align: right; margin-top: 20px; }
        .total { font-size: 18px; font-weight: bold; color: #d4af37; }
        .footer { text-align: center; margin-top: 40px; padding-top: 20px; border-top: 1px solid #ddd; color: #666; }
    </style>
</head>
<body>
    <div class="header">
        <div class="company-name">AMARAA LUXURY</div>
        <div>Exquisite Fragrances Collection</div>
        <div>Contact: +91 9999999999 | Email: info@amaraaluxury.com</div>
    </div>

    <div class="invoice-details">
        <div class="customer-details">
            <h3>Bill To:</h3>
            <p><strong>${order.customerName}</strong></p>
            <p>${order.email}</p>
            <p>${order.phone}</p>
            <p>${order.deliveryAddress}</p>
        </div>
        <div class="invoice-info">
            <h3>Invoice Details:</h3>
            <p><strong>Invoice #:</strong> ${order.id}</p>
            <p><strong>Date:</strong> ${new Date(order.orderDate).toLocaleDateString()}</p>
            <p><strong>Payment Method:</strong> ${order.paymentMethod.toUpperCase()}</p>
            <p><strong>Status:</strong> ${order.status.toUpperCase()}</p>
        </div>
    </div>

    <table class="table">
        <thead>
            <tr>
                <th>Product</th>
                <th>Brand</th>
                <th>Quantity</th>
                <th>Unit Price</th>
                <th>Total</th>
            </tr>
        </thead>
        <tbody>
            ${order.products.map(product => `
                <tr>
                    <td>${product.name}</td>
                    <td>${product.brand}</td>
                    <td>${product.quantity}</td>
                    <td>$${product.price}</td>
                    <td>$${product.price * product.quantity}</td>
                </tr>
            `).join('')}
        </tbody>
    </table>

    <div class="total-section">
        <div class="total">Total Amount: $${order.total}</div>
    </div>

    <div class="footer">
        <p>Thank you for choosing Amaraa Luxury!</p>
        <p>For any queries, please contact us at info@amaraaluxury.com</p>
    </div>
</body>
</html>
    `;

    const blob = new Blob([billContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Invoice-${order.id}.html`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const downloadAllBills = () => {
    filteredOrders.forEach(order => {
      setTimeout(() => generateBill(order), 100);
    });
  };

  const stats = {
    totalOrders: orders.length,
    totalRevenue: orders.reduce((sum, order) => sum + order.total, 0),
    pendingOrders: orders.filter(order => order.status === 'pending').length,
    completedOrders: orders.filter(order => order.status === 'completed').length
  };

  return (
    <div className="min-h-screen bg-luxury-gradient">
      <Header />
      
      <div className="py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="text-4xl font-bold bg-gradient-to-r from-golden-600 via-nature-600 to-sky-600 bg-clip-text text-transparent mb-2">
              Admin Dashboard
            </h1>
            <p className="text-primary-700">Manage orders and generate bills</p>
          </motion.div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            {[
              { title: 'Total Orders', value: stats.totalOrders, icon: Package, color: 'from-sky-400 to-sky-600' },
              { title: 'Total Revenue', value: `$${stats.totalRevenue}`, icon: DollarSign, color: 'from-golden-400 to-golden-600' },
              { title: 'Pending Orders', value: stats.pendingOrders, icon: Calendar, color: 'from-nature-400 to-nature-600' },
              { title: 'Completed Orders', value: stats.completedOrders, icon: Users, color: 'from-primary-400 to-primary-600' }
            ].map((stat, index) => (
              <motion.div
                key={stat.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-gradient-to-br from-cream-50 to-golden-50 rounded-2xl p-6 shadow-xl border-2 border-golden-200"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-primary-600 font-medium">{stat.title}</p>
                    <p className="text-2xl font-bold text-primary-800">{stat.value}</p>
                  </div>
                  <div className={`w-12 h-12 bg-gradient-to-r ${stat.color} rounded-full flex items-center justify-center`}>
                    <stat.icon className="w-6 h-6 text-cream-50" />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Controls */}
          <div className="bg-gradient-to-r from-golden-50 to-sky-50 rounded-2xl p-6 shadow-xl border-2 border-golden-200 mb-8">
            <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
              <div className="flex flex-col sm:flex-row gap-4 flex-1">
                {/* Search */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-primary-600" />
                  <input
                    type="text"
                    placeholder="Search orders..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-3 bg-cream-50 border-2 border-golden-200 rounded-lg focus:border-golden-400 focus:outline-none min-w-64"
                  />
                </div>

                {/* Status Filter */}
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="px-4 py-3 bg-cream-50 border-2 border-golden-200 rounded-lg focus:border-golden-400 focus:outline-none"
                >
                  <option value="all">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="completed">Completed</option>
                  <option value="shipped">Shipped</option>
                  <option value="delivered">Delivered</option>
                </select>
              </div>

              {/* Download All Bills Button */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={downloadAllBills}
                className="bg-gradient-to-r from-golden-500 to-golden-600 text-cream-50 px-6 py-3 rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all flex items-center space-x-2"
              >
                <Download className="w-5 h-5" />
                <span>Download All Bills</span>
              </motion.button>
            </div>
          </div>

          {/* Orders Table */}
          <div className="bg-gradient-to-br from-cream-50 to-golden-50 rounded-2xl shadow-xl border-2 border-golden-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gradient-to-r from-golden-100 to-sky-100">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-primary-800">Order ID</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-primary-800">Customer</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-primary-800">Date</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-primary-800">Total</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-primary-800">Status</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-primary-800">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-golden-200">
                  {filteredOrders.map((order, index) => (
                    <motion.tr
                      key={order.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="hover:bg-golden-50/50 transition-colors"
                    >
                      <td className="px-6 py-4 text-sm font-medium text-primary-800">{order.id}</td>
                      <td className="px-6 py-4">
                        <div>
                          <div className="text-sm font-medium text-primary-800">{order.customerName}</div>
                          <div className="text-sm text-primary-600">{order.email}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-primary-700">
                        {new Date(order.orderDate).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 text-sm font-semibold text-golden-700">${order.total}</td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          order.status === 'completed' ? 'bg-nature-100 text-nature-700' :
                          order.status === 'pending' ? 'bg-golden-100 text-golden-700' :
                          order.status === 'shipped' ? 'bg-sky-100 text-sky-700' :
                          'bg-primary-100 text-primary-700'
                        }`}>
                          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => {
                              setSelectedOrder(order);
                              setShowBillModal(true);
                            }}
                            className="p-2 bg-sky-100 text-sky-600 rounded-lg hover:bg-sky-200 transition-colors"
                            title="View Order"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => generateBill(order)}
                            className="p-2 bg-golden-100 text-golden-600 rounded-lg hover:bg-golden-200 transition-colors"
                            title="Download Bill"
                          >
                            <Download className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Bill Modal */}
          {showBillModal && selectedOrder && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-cream-50 rounded-2xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              >
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-2xl font-bold text-primary-800">Order Details</h3>
                  <button
                    onClick={() => setShowBillModal(false)}
                    className="text-primary-600 hover:text-primary-800"
                  >
                    ✕
                  </button>
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-semibold text-primary-800">Customer Details</h4>
                      <p className="text-primary-700">{selectedOrder.customerName}</p>
                      <p className="text-primary-600">{selectedOrder.email}</p>
                      <p className="text-primary-600">{selectedOrder.phone}</p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-primary-800">Order Info</h4>
                      <p className="text-primary-700">Order ID: {selectedOrder.id}</p>
                      <p className="text-primary-600">Date: {new Date(selectedOrder.orderDate).toLocaleDateString()}</p>
                      <p className="text-primary-600">Payment: {selectedOrder.paymentMethod.toUpperCase()}</p>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold text-primary-800 mb-2">Products</h4>
                    <div className="space-y-2">
                      {selectedOrder.products.map(product => (
                        <div key={product.id} className="flex justify-between items-center p-3 bg-golden-50 rounded-lg">
                          <div>
                            <p className="font-medium text-primary-800">{product.name}</p>
                            <p className="text-sm text-primary-600">{product.brand}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-medium text-primary-800">{product.quantity} × ${product.price}</p>
                            <p className="text-sm text-golden-700">${product.quantity * product.price}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="border-t pt-4">
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-semibold text-primary-800">Total Amount:</span>
                      <span className="text-2xl font-bold text-golden-700">${selectedOrder.total}</span>
                    </div>
                  </div>

                  <div className="flex space-x-4">
                    <button
                      onClick={() => generateBill(selectedOrder)}
                      className="flex-1 bg-gradient-to-r from-golden-500 to-golden-600 text-cream-50 py-3 rounded-lg font-semibold flex items-center justify-center space-x-2"
                    >
                      <Download className="w-5 h-5" />
                      <span>Download Bill</span>
                    </button>
                    <button
                      onClick={() => setShowBillModal(false)}
                      className="flex-1 bg-gradient-to-r from-primary-100 to-primary-200 text-primary-700 py-3 rounded-lg font-semibold"
                    >
                      Close
                    </button>
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
