'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { 
  ArrowLeft, 
  Search, 
  MessageSquare, 
  Clock, 
  CheckCircle, 
  User,
  Calendar,
  Reply
} from 'lucide-react';

interface SupportTicket {
  _id: string;
  ticketNumber: string;
  customerName: string;
  customerEmail: string;
  subject: string;
  message: string;
  status: 'open' | 'in-progress' | 'closed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  category: 'order-issue' | 'product-inquiry' | 'shipping' | 'refund' | 'technical' | 'other';
  createdAt: string;
  updatedAt: string;
  adminResponse?: string;
  responseDate?: string;
}

export default function SupportPage() {
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null);
  const [showResponseModal, setShowResponseModal] = useState(false);
  const [responseMessage, setResponseMessage] = useState('');
  useEffect(() => {
    fetchTickets();
  }, [statusFilter, searchTerm]);

  const fetchTickets = async () => {
    try {
      const searchParams = new URLSearchParams();
      if (statusFilter !== 'all') {
        searchParams.append('status', statusFilter);
      }
      if (searchTerm) {
        searchParams.append('search', searchTerm);
      }
      
      const response = await fetch(`http://localhost:5000/api/admin/support-tickets?${searchParams}`);
      if (response.ok) {
        const data = await response.json();
        setTickets(data.tickets);
      } else {
        console.error('Failed to fetch support tickets');
        setTickets([]);
      }
    } catch (error) {
      console.error('Error fetching tickets:', error);
      setTickets([]);
    } finally {
      setLoading(false);
    }
  };

  const updateTicketStatus = async (ticketId: string, newStatus: SupportTicket['status'], adminResponse?: string) => {
    try {
      const response = await fetch(`http://localhost:5000/api/admin/support-tickets/${ticketId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          status: newStatus,
          ...(adminResponse && { adminResponse })
        }),
      });      if (response.ok) {
        await response.json();
        setTickets(tickets.map(ticket => 
          ticket._id === ticketId 
            ? { ...ticket, status: newStatus, updatedAt: new Date().toISOString(), ...(adminResponse && { adminResponse }) }
            : ticket
        ));
        setShowResponseModal(false);
        setSelectedTicket(null);
        setResponseMessage('');
      } else {
        console.error('Failed to update ticket status');
      }
    } catch (error) {
      console.error('Error updating ticket status:', error);
    }  };
  const getStatusColor = (status: SupportTicket['status']) => {
    switch (status) {
      case 'open': return 'bg-red-100 text-red-800';
      case 'in-progress': return 'bg-yellow-100 text-yellow-800';
      case 'closed': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: SupportTicket['priority']) => {
    switch (priority) {
      case 'low': return 'bg-blue-100 text-blue-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'urgent': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };
  const getStatusIcon = (status: SupportTicket['status']) => {
    switch (status) {
      case 'open': return <Clock className="w-4 h-4" />;
      case 'in-progress': return <MessageSquare className="w-4 h-4" />;
      case 'closed': return <CheckCircle className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const filteredTickets = tickets.filter(ticket => {
    const matchesSearch = ticket.ticketNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         ticket.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         ticket.subject.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || ticket.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

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
          <div className="flex items-center justify-between py-6">
            <div className="flex items-center space-x-4">
              <Link 
                href="/"
                className="flex items-center text-gray-600 hover:text-gray-900"
              >
                <ArrowLeft className="w-5 h-5 mr-2" />
                Back to Dashboard
              </Link>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Support Center</h1>
                <p className="text-gray-600">Manage customer support tickets</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search tickets..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            
            {/* Status Filter */}
            <div className="md:w-48">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Status</option>
                <option value="open">Open</option>
                <option value="in-progress">In Progress</option>
                <option value="resolved">Resolved</option>
                <option value="closed">Closed</option>
              </select>
            </div>
          </div>
        </div>

        {/* Tickets Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredTickets.map((ticket) => (
            <div key={ticket._id} className="bg-white rounded-lg shadow-md p-6">
              {/* Ticket Header */}
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="font-semibold text-gray-900">{ticket.ticketNumber}</h3>
                  <p className="text-sm text-gray-600">{ticket.subject}</p>
                </div>
                <div className="flex flex-col items-end space-y-1">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(ticket.status)}`}>
                    {getStatusIcon(ticket.status)}
                    <span className="ml-1">{ticket.status}</span>
                  </span>
                  <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(ticket.priority)}`}>
                    {ticket.priority}
                  </span>
                </div>
              </div>

              {/* Customer Info */}
              <div className="flex items-center space-x-2 mb-3">
                <User className="w-4 h-4 text-gray-400" />
                <div>
                  <p className="text-sm font-medium text-gray-900">{ticket.customerName}</p>
                  <p className="text-xs text-gray-500">{ticket.customerEmail}</p>
                </div>
              </div>

              {/* Message Preview */}
              <p className="text-sm text-gray-600 mb-4 line-clamp-3">
                {ticket.message}
              </p>

              {/* Metadata */}
              <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                <div className="flex items-center space-x-1">
                  <Calendar className="w-3 h-3" />
                  <span>{new Date(ticket.createdAt).toLocaleDateString()}</span>
                </div>
                <span className="bg-gray-100 px-2 py-1 rounded">{ticket.category}</span>
              </div>

              {/* Actions */}
              <div className="flex justify-between items-center">                <div className="text-xs text-gray-500">
                  {ticket.adminResponse ? 'Admin responded' : 'No response yet'}
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => {
                      setSelectedTicket(ticket);
                      setShowResponseModal(true);
                    }}
                    className="text-blue-600 hover:text-blue-900 text-sm font-medium inline-flex items-center"
                  >
                    <Reply className="w-4 h-4 mr-1" />
                    Respond
                  </button>
                  
                  {ticket.status !== 'closed' && (
                    <button
                      onClick={() => updateTicketStatus(ticket._id, 'closed')}
                      className="text-green-600 hover:text-green-900 text-sm font-medium"
                    >
                      Close
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Response Modal */}
        {showResponseModal && selectedTicket && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg w-full max-w-2xl max-h-screen overflow-y-auto">
              <div className="p-6">
                <h3 className="text-lg font-semibold mb-4">
                  Respond to {selectedTicket.ticketNumber}
                </h3>
                
                {/* Ticket Details */}
                <div className="bg-gray-50 rounded-lg p-4 mb-4">
                  <h4 className="font-medium text-gray-900 mb-2">{selectedTicket.subject}</h4>
                  <p className="text-sm text-gray-600 mb-2">{selectedTicket.message}</p>
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>From: {selectedTicket.customerName}</span>
                    <span>{new Date(selectedTicket.createdAt).toLocaleString()}</span>
                  </div>
                </div>                {/* Previous Admin Response */}
                {selectedTicket.adminResponse && (
                  <div className="mb-4">
                    <h4 className="font-medium text-gray-900 mb-2">Previous Response</h4>
                    <div className="p-3 rounded-lg bg-blue-50">
                      <p className="text-sm text-gray-900">{selectedTicket.adminResponse}</p>
                      <div className="text-xs text-gray-500 mt-1">
                        Admin response on {selectedTicket.responseDate ? new Date(selectedTicket.responseDate).toLocaleString() : 'Unknown date'}
                      </div>
                    </div>
                  </div>
                )}

                {/* Response Form */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Your Response
                    </label>
                    <textarea
                      value={responseMessage}
                      onChange={(e) => setResponseMessage(e.target.value)}
                      rows={4}
                      placeholder="Type your response here..."
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div className="flex justify-end space-x-3 mt-6">
                  <button
                    onClick={() => {
                      setShowResponseModal(false);
                      setSelectedTicket(null);
                      setResponseMessage('');
                    }}
                    className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    Cancel
                  </button>                  <button
                    onClick={() => updateTicketStatus(selectedTicket._id, 'in-progress', responseMessage)}
                    disabled={!responseMessage.trim()}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Send Response
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}