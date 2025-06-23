'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Package, 
  Users, 
  ShoppingCart, 
  MessageSquare, 
  TrendingUp, 
  AlertCircle,
  CheckCircle,
  Clock,
  Truck
} from 'lucide-react';

interface DashboardStats {
  totalOrders: number;
  pendingOrders: number;
  shippedOrders: number;
  deliveredOrders: number;
  totalUsers: number;
  openTickets: number;
  totalRevenue: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalOrders: 0,
    pendingOrders: 0,
    shippedOrders: 0,
    deliveredOrders: 0,
    totalUsers: 0,
    openTickets: 0,
    totalRevenue: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      // Simulate API calls - replace with actual backend calls
      setTimeout(() => {
        setStats({
          totalOrders: 156,
          pendingOrders: 23,
          shippedOrders: 45,
          deliveredOrders: 88,
          totalUsers: 342,
          openTickets: 12,
          totalRevenue: 45670
        });
        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      setLoading(false);
    }
  };

  const StatCard = ({ 
    title, 
    value, 
    icon: Icon, 
    color, 
    change 
  }: {
    title: string;
    value: string | number;
    icon: React.ElementType;
    color: string;
    change?: string;
  }) => (
    <div className="bg-white rounded-lg shadow-md p-6 border-l-4" style={{ borderLeftColor: color }}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          {change && (
            <p className="text-xs text-green-600 mt-1">{change}</p>
          )}
        </div>
        <div className="p-3 rounded-full" style={{ backgroundColor: `${color}20` }}>
          <Icon className="w-6 h-6" style={{ color }} />
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <Package className="w-8 h-8 text-blue-600 mr-3" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">AMARAA LUXURY</h1>
                <p className="text-sm text-gray-600">Admin Dashboard</p>
              </div>
            </div>
            <nav className="flex space-x-6">
              <Link 
                href="/orders" 
                className="text-gray-600 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium"
              >
                Orders
              </Link>
              <Link 
                href="/support" 
                className="text-gray-600 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium"
              >
                Support
              </Link>
              <Link 
                href="/customers" 
                className="text-gray-600 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium"
              >
                Customers
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Total Orders"
            value={stats.totalOrders}
            icon={ShoppingCart}
            color="#3B82F6"
            change="+12% from last month"
          />
          <StatCard
            title="Pending Orders"
            value={stats.pendingOrders}
            icon={Clock}
            color="#F59E0B"
          />
          <StatCard
            title="Total Customers"
            value={stats.totalUsers}
            icon={Users}
            color="#10B981"
            change="+8% from last month"
          />
          <StatCard
            title="Open Tickets"
            value={stats.openTickets}
            icon={MessageSquare}
            color="#EF4444"
          />
        </div>

        {/* Revenue Card */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Revenue Overview</h3>
            <TrendingUp className="w-5 h-5 text-green-600" />
          </div>
          <div className="text-3xl font-bold text-gray-900 mb-2">
            ${stats.totalRevenue.toLocaleString()}
          </div>
          <p className="text-sm text-green-600">+15.3% from last month</p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <Link
            href="/orders"
            className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
          >
            <div className="flex items-center mb-4">
              <Package className="w-8 h-8 text-blue-600 mr-3" />
              <h3 className="text-lg font-semibold text-gray-900">Manage Orders</h3>
            </div>
            <p className="text-gray-600 mb-4">
              View and update order statuses, track shipments, and manage deliveries.
            </p>
            <div className="flex justify-between text-sm">
              <span className="text-orange-600">📦 {stats.pendingOrders} Pending</span>
              <span className="text-blue-600">🚚 {stats.shippedOrders} Shipped</span>
            </div>
          </Link>

          <Link
            href="/support"
            className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
          >
            <div className="flex items-center mb-4">
              <MessageSquare className="w-8 h-8 text-green-600 mr-3" />
              <h3 className="text-lg font-semibold text-gray-900">Support Tickets</h3>
            </div>
            <p className="text-gray-600 mb-4">
              Handle customer inquiries, complaints, and provide assistance.
            </p>
            <div className="flex justify-between text-sm">
              <span className="text-red-600">🔴 {stats.openTickets} Open</span>
              <span className="text-green-600">✅ Quick Response</span>
            </div>
          </Link>

          <Link
            href="/customers"
            className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
          >
            <div className="flex items-center mb-4">
              <Users className="w-8 h-8 text-purple-600 mr-3" />
              <h3 className="text-lg font-semibold text-gray-900">Customer Management</h3>
            </div>
            <p className="text-gray-600 mb-4">
              View customer profiles, order history, and preferences.
            </p>
            <div className="flex justify-between text-sm">
              <span className="text-purple-600">👥 {stats.totalUsers} Total</span>
              <span className="text-blue-600">📈 Growing</span>
            </div>
          </Link>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
          <div className="space-y-4">
            <div className="flex items-center p-3 bg-blue-50 rounded-lg">
              <CheckCircle className="w-5 h-5 text-green-600 mr-3" />
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">Order #AR-12345678 delivered</p>
                <p className="text-xs text-gray-600">2 minutes ago</p>
              </div>
            </div>
            <div className="flex items-center p-3 bg-orange-50 rounded-lg">
              <AlertCircle className="w-5 h-5 text-orange-600 mr-3" />
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">New support ticket created</p>
                <p className="text-xs text-gray-600">15 minutes ago</p>
              </div>
            </div>
            <div className="flex items-center p-3 bg-green-50 rounded-lg">
              <Truck className="w-5 h-5 text-blue-600 mr-3" />
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">Order #AR-12345677 shipped</p>
                <p className="text-xs text-gray-600">1 hour ago</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
