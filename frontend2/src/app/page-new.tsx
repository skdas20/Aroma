'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Package, 
  Users, 
  MessageSquare, 
  TrendingUp, 
  ShoppingCart,
  AlertTriangle,
  CheckCircle,
  Clock
} from 'lucide-react';

interface DashboardStats {
  totalOrders: number;
  pendingOrders: number;
  completedOrders: number;
  totalCustomers: number;
  supportTickets: number;
  revenue: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalOrders: 0,
    pendingOrders: 0,
    completedOrders: 0,
    totalCustomers: 0,
    supportTickets: 0,
    revenue: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      // Mock data for now - replace with actual API calls
      setStats({
        totalOrders: 245,
        pendingOrders: 12,
        completedOrders: 198,
        totalCustomers: 89,
        supportTickets: 5,
        revenue: 15420
      });
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const StatCard = ({ 
    title, 
    value, 
    icon: Icon, 
    color, 
    link 
  }: { 
    title: string; 
    value: string | number; 
    icon: React.ElementType; 
    color: string;
    link?: string;
  }) => (
    <div className={`bg-white rounded-lg shadow-md p-6 border-l-4 ${color}`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
        </div>
        <Icon className="h-8 w-8 text-gray-400" />
      </div>
      {link && (
        <div className="mt-4">
          <Link 
            href={link}
            className="text-sm text-blue-600 hover:text-blue-800 font-medium"
          >
            View Details →
          </Link>
        </div>
      )}
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                AMARAA LUXURY - Admin Dashboard
              </h1>
              <p className="text-gray-600">Manage your perfume business</p>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">
                Last updated: {new Date().toLocaleTimeString()}
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <StatCard
            title="Total Orders"
            value={stats.totalOrders}
            icon={ShoppingCart}
            color="border-blue-500"
            link="/orders"
          />
          <StatCard
            title="Pending Orders"
            value={stats.pendingOrders}
            icon={Clock}
            color="border-yellow-500"
            link="/orders?status=pending"
          />
          <StatCard
            title="Completed Orders"
            value={stats.completedOrders}
            icon={CheckCircle}
            color="border-green-500"
            link="/orders?status=completed"
          />
          <StatCard
            title="Total Customers"
            value={stats.totalCustomers}
            icon={Users}
            color="border-purple-500"
            link="/customers"
          />
          <StatCard
            title="Support Tickets"
            value={stats.supportTickets}
            icon={AlertTriangle}
            color="border-red-500"
            link="/support"
          />
          <StatCard
            title="Revenue"
            value={`$${stats.revenue.toLocaleString()}`}
            icon={TrendingUp}
            color="border-indigo-500"
          />
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Orders */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Recent Orders</h2>
              <Link 
                href="/orders"
                className="text-blue-600 hover:text-blue-800 text-sm font-medium"
              >
                View All
              </Link>
            </div>
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                  <div>
                    <p className="font-medium">Order #AR-{Date.now() + i}</p>
                    <p className="text-sm text-gray-600">Customer #{i}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">${(Math.random() * 200 + 50).toFixed(2)}</p>
                    <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800">
                      Pending
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Support Tickets */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Support Tickets</h2>
              <Link 
                href="/support"
                className="text-blue-600 hover:text-blue-800 text-sm font-medium"
              >
                View All
              </Link>
            </div>
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                  <div>
                    <p className="font-medium">Ticket #{1000 + i}</p>
                    <p className="text-sm text-gray-600">Order issue</p>
                  </div>
                  <div className="text-right">
                    <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">
                      Open
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Navigation Menu */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link 
            href="/orders"
            className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
          >
            <div className="flex items-center space-x-4">
              <Package className="h-10 w-10 text-blue-600" />
              <div>
                <h3 className="font-semibold text-gray-900">Manage Orders</h3>
                <p className="text-gray-600 text-sm">View and update order status</p>
              </div>
            </div>
          </Link>

          <Link 
            href="/customers"
            className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
          >
            <div className="flex items-center space-x-4">
              <Users className="h-10 w-10 text-green-600" />
              <div>
                <h3 className="font-semibold text-gray-900">Customer Management</h3>
                <p className="text-gray-600 text-sm">View customer details and history</p>
              </div>
            </div>
          </Link>

          <Link 
            href="/support"
            className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
          >
            <div className="flex items-center space-x-4">
              <MessageSquare className="h-10 w-10 text-purple-600" />
              <div>
                <h3 className="font-semibold text-gray-900">Support Center</h3>
                <p className="text-gray-600 text-sm">Handle customer support tickets</p>
              </div>
            </div>
          </Link>
        </div>
      </main>
    </div>
  );
}
