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
import { apiUrl } from '@/lib/api';

interface DashboardStats {
  totalOrders: number;
  pendingOrders: number;
  completedOrders: number;
  totalCustomers: number;
  supportTickets: number;
  revenue: number;
}

interface RecentOrder {
  _id: string;
  orderNumber: string;
  totalAmount: number;
  status: string;
  orderDate: string;
  userId: {
    displayName: string;
    email: string;
  };
}

interface RecentTicket {
  _id: string;
  ticketNumber: string;
  subject: string;
  status: string;
  priority: string;
  createdAt: string;
}

export default function AdminDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [stats, setStats] = useState<DashboardStats>({
    totalOrders: 0,
    pendingOrders: 0,
    completedOrders: 0,
    totalCustomers: 0,
    supportTickets: 0,
    revenue: 0
  });
  const [recentOrders, setRecentOrders] = useState<RecentOrder[]>([]);
  const [recentTickets, setRecentTickets] = useState<RecentTicket[]>([]);
  const [loading, setLoading] = useState(true);  useEffect(() => {
    // Check authentication
    const adminAuth = localStorage.getItem('adminAuth');
    if (!adminAuth) {
      window.location.href = '/admin-login';
      return;
    }
    setIsAuthenticated(true);

    fetchDashboardStats();
    fetchRecentOrders();
    fetchRecentTickets();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      // Fetch real dashboard statistics from backend
      const response = await fetch(apiUrl('/api/admin/stats'));
      if (response.ok) {
        const data = await response.json();
        setStats(data.stats);
      } else {
        console.error('Failed to fetch dashboard stats');
        // Keep stats at zero if API fails
      }
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      // Keep stats at zero if API fails
    } finally {
      setLoading(false);
    }
  };

  const fetchRecentOrders = async () => {
    try {
      const response = await fetch(apiUrl('/api/admin/recent-orders'));
      if (response.ok) {
        const data = await response.json();
        setRecentOrders(data.orders);
      }
    } catch (error) {
      console.error('Error fetching recent orders:', error);
    }
  };

  const fetchRecentTickets = async () => {
    try {
      const response = await fetch(apiUrl('/api/admin/recent-tickets'));
      if (response.ok) {
        const data = await response.json();
        setRecentTickets(data.tickets);
      }
    } catch (error) {
      console.error('Error fetching recent tickets:', error);
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

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-500 border-t-transparent"></div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
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
            value={`₹${stats.revenue.toLocaleString()}`}
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
            </div>            <div className="space-y-3">
              {recentOrders.length > 0 ? (
                recentOrders.map((order) => (
                  <div key={order._id} className="flex items-center justify-between p-4 bg-white border border-slate-200 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                    <div>
                      <p className="font-medium">{order.orderNumber}</p>
                      <p className="text-sm text-slate-600">{order.userId.displayName}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">₹{order.totalAmount.toFixed(2)}</p>
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${                        order.status === 'pending' ? 'bg-amber-100 text-amber-800' :
                        order.status === 'delivered' ? 'bg-emerald-100 text-emerald-800' :
                        order.status === 'shipped' ? 'bg-blue-100 text-blue-800' :
                        'bg-slate-100 text-slate-700'
                      }`}>
                        {order.status}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Package className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                  <p>No recent orders</p>
                </div>
              )}
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
            </div>            <div className="space-y-3">
              {recentTickets.length > 0 ? (
                recentTickets.map((ticket) => (
                  <div key={ticket._id} className="flex items-center justify-between p-4 bg-white border border-slate-200 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                    <div>
                      <p className="font-medium">{ticket.ticketNumber}</p>
                      <p className="text-sm text-slate-600">{ticket.subject}</p>
                    </div>
                    <div className="text-right">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${                        ticket.status === 'open' ? 'bg-red-100 text-red-800' :
                        ticket.status === 'in-progress' ? 'bg-amber-100 text-amber-800' :
                        ticket.status === 'closed' ? 'bg-emerald-100 text-emerald-800' :
                        'bg-slate-100 text-slate-700'
                      }`}>
                        {ticket.status}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <MessageSquare className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                  <p>No recent support tickets</p>
                </div>
              )}
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
