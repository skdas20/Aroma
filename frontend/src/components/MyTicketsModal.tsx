'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, MessageSquare, Clock, CheckCircle, AlertTriangle, User, MessageCircle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface Ticket {
  _id: string;
  ticketNumber: string;
  subject: string;
  message: string;
  status: 'open' | 'in-progress' | 'closed';
  priority: 'low' | 'medium' | 'high';
  createdAt: string;
  relatedOrderNumber?: string;
  responses: Array<{
    _id: string;
    message: string;
    isAdminResponse: boolean;
    respondedAt: string;
    respondedBy: string;
  }>;
}

interface MyTicketsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const statusColors = {
  open: 'bg-red-100 text-red-800',
  'in-progress': 'bg-amber-100 text-amber-800',
  closed: 'bg-emerald-100 text-emerald-800'
};

const priorityColors = {
  low: 'bg-green-100 text-green-800',
  medium: 'bg-yellow-100 text-yellow-800',
  high: 'bg-red-100 text-red-800'
};

const priorityIcons = {
  low: '🟢',
  medium: '🟡',
  high: '🔴'
};

export default function MyTicketsModal({ isOpen, onClose }: MyTicketsModalProps) {
  const { user } = useAuth();
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [newResponse, setNewResponse] = useState('');
  const [isSubmittingResponse, setIsSubmittingResponse] = useState(false);

  useEffect(() => {
    if (isOpen && user) {
      fetchTickets();
    }
  }, [isOpen, user]);

  const fetchTickets = async () => {
    try {
      setLoading(true);
      const response = await fetch(`http://localhost:5000/api/support/user/${user?.email}`);
      if (response.ok) {
        const data = await response.json();
        setTickets(data.tickets || []);
      }
    } catch (error) {
      console.error('Error fetching tickets:', error);
    } finally {
      setLoading(false);
    }
  };

  const submitResponse = async (ticketId: string) => {
    if (!newResponse.trim()) return;

    try {
      setIsSubmittingResponse(true);      const response = await fetch(`http://localhost:5000/api/support/${ticketId}/respond`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: newResponse,
          author: user?.displayName || user?.email || 'Customer',
          isAdmin: false
        }),
      });

      if (response.ok) {
        setNewResponse('');
        fetchTickets(); // Refresh tickets
        // Update selected ticket
        if (selectedTicket) {
          const updatedResponse = await fetch(`http://localhost:5000/api/support/${ticketId}`);
          if (updatedResponse.ok) {
            const updatedTicket = await updatedResponse.json();
            setSelectedTicket(updatedTicket.ticket);
          }
        }
      }
    } catch (error) {
      console.error('Error submitting response:', error);
    } finally {
      setIsSubmittingResponse(false);
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
          className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
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
                  <h2 className="text-xl font-bold text-gray-800">My Support Tickets</h2>
                  <p className="text-sm text-gray-600">View and manage your support requests</p>
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

          <div className="flex h-[600px]">
            {/* Tickets List */}
            <div className="w-1/2 border-r border-gray-100 overflow-y-auto">
              <div className="p-4">
                <h3 className="font-semibold text-gray-800 mb-4">All Tickets ({tickets.length})</h3>
                
                {loading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-500 border-t-transparent mx-auto" />
                  </div>
                ) : tickets.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <MessageSquare className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                    <p>No support tickets found</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {tickets.map((ticket) => (
                      <motion.div
                        key={ticket._id}
                        whileHover={{ scale: 1.02 }}
                        onClick={() => setSelectedTicket(ticket)}
                        className={`p-4 border rounded-xl cursor-pointer transition-all ${
                          selectedTicket?._id === ticket._id 
                            ? 'border-blue-300 bg-blue-50' 
                            : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center space-x-2">
                            <span className="text-sm font-medium text-gray-600">#{ticket.ticketNumber}</span>
                            <span className={`text-xs px-2 py-1 rounded-full ${statusColors[ticket.status]}`}>
                              {ticket.status}
                            </span>
                          </div>
                          <span className={`text-xs px-2 py-1 rounded-full ${priorityColors[ticket.priority]}`}>
                            {priorityIcons[ticket.priority]} {ticket.priority}
                          </span>
                        </div>
                        
                        <h4 className="font-medium text-gray-800 mb-1 line-clamp-1">{ticket.subject}</h4>
                        <p className="text-sm text-gray-600 line-clamp-2 mb-2">{ticket.message}</p>
                        
                        <div className="flex items-center justify-between text-xs text-gray-500">
                          <span>{formatDate(ticket.createdAt)}</span>
                          {ticket.relatedOrderNumber && (
                            <span className="font-medium">Order #{ticket.relatedOrderNumber}</span>
                          )}
                        </div>
                        
                        {ticket.responses.length > 0 && (
                          <div className="mt-2 flex items-center text-xs text-blue-600">
                            <MessageCircle className="w-3 h-3 mr-1" />
                            {ticket.responses.length} response(s)
                          </div>
                        )}
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Ticket Details */}
            <div className="w-1/2 overflow-y-auto">
              {selectedTicket ? (
                <div className="p-4">
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-bold text-gray-800">#{selectedTicket.ticketNumber}</h3>
                      <div className="flex items-center space-x-2">
                        <span className={`text-xs px-2 py-1 rounded-full ${statusColors[selectedTicket.status]}`}>
                          {selectedTicket.status}
                        </span>
                        <span className={`text-xs px-2 py-1 rounded-full ${priorityColors[selectedTicket.priority]}`}>
                          {priorityIcons[selectedTicket.priority]} {selectedTicket.priority}
                        </span>
                      </div>
                    </div>
                    
                    <h4 className="text-lg font-semibold text-gray-800 mb-2">{selectedTicket.subject}</h4>
                    
                    {selectedTicket.relatedOrderNumber && (
                      <p className="text-sm text-gray-600 mb-2">
                        Related to Order #{selectedTicket.relatedOrderNumber}
                      </p>
                    )}
                    
                    <p className="text-sm text-gray-500 mb-4">
                      Created on {formatDate(selectedTicket.createdAt)}
                    </p>
                  </div>

                  {/* Original Message */}
                  <div className="mb-6">
                    <div className="bg-gray-50 rounded-xl p-4">
                      <div className="flex items-center mb-2">
                        <User className="w-4 h-4 text-gray-500 mr-2" />
                        <span className="text-sm font-medium text-gray-700">Your Message</span>
                      </div>
                      <p className="text-gray-800">{selectedTicket.message}</p>
                    </div>
                  </div>

                  {/* Responses */}
                  {selectedTicket.responses.length > 0 && (
                    <div className="mb-6">
                      <h5 className="font-semibold text-gray-800 mb-3">Responses</h5>
                      <div className="space-y-3">
                        {selectedTicket.responses.map((response) => (
                          <div
                            key={response._id}
                            className={`p-4 rounded-xl ${
                              response.isAdminResponse 
                                ? 'bg-blue-50 border-l-4 border-blue-400' 
                                : 'bg-gray-50 border-l-4 border-gray-400'
                            }`}
                          >
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-sm font-medium text-gray-700">
                                {response.isAdminResponse ? '👨‍💼 Admin' : '👤 You'}
                              </span>
                              <span className="text-xs text-gray-500">
                                {formatDate(response.respondedAt)}
                              </span>
                            </div>
                            <p className="text-gray-800">{response.message}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Add Response (only if ticket is not closed) */}
                  {selectedTicket.status !== 'closed' && (
                    <div>
                      <h5 className="font-semibold text-gray-800 mb-3">Add Response</h5>
                      <div className="space-y-3">
                        <textarea
                          value={newResponse}
                          onChange={(e) => setNewResponse(e.target.value)}
                          rows={4}
                          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none"
                          placeholder="Type your response here..."
                        />
                        <button
                          onClick={() => submitResponse(selectedTicket._id)}
                          disabled={!newResponse.trim() || isSubmittingResponse}
                          className="w-full bg-gradient-to-r from-blue-500 to-indigo-500 text-white py-3 rounded-xl hover:from-blue-600 hover:to-indigo-600 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                        >
                          {isSubmittingResponse ? (
                            <>
                              <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                              <span>Sending...</span>
                            </>
                          ) : (
                            <>
                              <MessageCircle className="w-4 h-4" />
                              <span>Send Response</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center justify-center h-full text-gray-500">
                  <div className="text-center">
                    <MessageSquare className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                    <p>Select a ticket to view details</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
