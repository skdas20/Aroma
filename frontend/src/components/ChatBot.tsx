'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, Send, X, Sparkles, Heart, Star } from 'lucide-react';
import { api } from '@/lib/api';

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
  suggestions?: any[];
  quizQuestion?: {
    question: string;
    options: string[];
    step: number;
  };
}

interface QuizState {
  isActive: boolean;
  step: number;
  preferences: Record<string, any>;
}

export default function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [quizState, setQuizState] = useState<QuizState>({
    isActive: false,
    step: 0,
    preferences: {}
  });
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      // Welcome message
      setMessages([{
        id: '1',
        text: "Hi! I'm your personal luxury consultant. I can help you find the perfect luxury items based on your preferences. Would you like to take a quick quiz or ask me about specific products?",
        isUser: false,
        timestamp: new Date()
      }]);
    }
  }, [isOpen]);

  useEffect(() => {
    // Listen for quiz trigger from homepage
    const handleQuizTrigger = () => {
      setIsOpen(true);
      setTimeout(() => {
        startQuiz();
      }, 500);
    };

    window.addEventListener('openChatbotQuiz', handleQuizTrigger);
    
    return () => {
      window.removeEventListener('openChatbotQuiz', handleQuizTrigger);
    };
  }, []);
  const sendMessage = async (text: string, isQuizAnswer = false) => {
    if (!text.trim() && !isQuizAnswer) return;

    const userMessage: Message = {
      id: `user-${Date.now()}-${Math.random()}`,
      text,
      isUser: true,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      const response = await api.chatbot.sendMessage({
        message: text,
        isQuiz: quizState.isActive,
        userPreferences: quizState.preferences
      });

      if (response.success) {
        const botMessage: Message = {
          id: `bot-${Date.now()}-${Math.random()}`,
          text: response.response,
          isUser: false,
          timestamp: new Date(),
          suggestions: response.suggestions,
          quizQuestion: response.quizQuestion
        };

        setMessages(prev => [...prev, botMessage]);        // Update quiz state
        if (response.quizQuestion) {
          setQuizState(prev => ({
            isActive: true,
            step: response.quizQuestion?.step || 0,
            preferences: { ...prev.preferences, step: response.quizQuestion?.step || 0 }
          }));
        } else if (response.isQuizComplete) {
          setQuizState({ isActive: false, step: 0, preferences: {} });
        }
      }
    } catch (error) {
      console.error('Chatbot error:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: "I'm sorry, I'm having trouble connecting right now. Please try again later.",
        isUser: false,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuizAnswer = (answer: string) => {
    setQuizState(prev => ({
      ...prev,
      preferences: { ...prev.preferences, [prev.step]: answer }
    }));
    sendMessage(answer, true);
  };
  const startQuiz = () => {
    sendMessage("I'd like to take the luxury quiz");
  };

  return (
    <>
      {/* Chat Toggle Button */}
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 w-16 h-16 bg-gradient-to-r from-golden-500 to-golden-600 text-cream-50 rounded-full shadow-xl z-40 flex items-center justify-center ${isOpen ? 'hidden' : 'block'}`}
      >
        <MessageCircle className="w-6 h-6" />
        <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-pink-400 to-rose-500 rounded-full animate-pulse"></div>
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 100 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 100 }}
            className="fixed md:bottom-6 md:right-6 bottom-0 right-0 left-0 top-0 md:left-auto md:top-auto md:w-96 md:h-[600px] w-full h-full md:rounded-2xl bg-gradient-to-br from-cream-50 to-golden-50 shadow-2xl z-50 flex flex-col border-2 border-golden-200"
          >            {/* Header */}
            <div className="bg-gradient-to-r from-golden-500 to-golden-600 text-cream-50 p-4 md:rounded-t-2xl flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-r from-pink-400 to-rose-500 rounded-full flex items-center justify-center">
                  <Sparkles className="w-4 h-4" />
                </div>                <div>
                  <h3 className="font-semibold text-sm md:text-base">Luxury Assistant</h3>
                  <p className="text-xs text-cream-200">AI-Powered Recommendations</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 hover:bg-white/20 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>            {/* Messages */}
            <div className="flex-1 p-3 md:p-4 overflow-y-auto space-y-4">              {messages.map((message, index) => (
                <div key={`${message.id}-${index}`} className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] md:max-w-[80%] p-3 rounded-lg ${
                    message.isUser 
                      ? 'bg-gradient-to-r from-golden-400 to-golden-500 text-cream-50' 
                      : 'bg-white border border-golden-200 text-primary-800'
                  }`}>
                    <p className="text-sm">{message.text}</p>
                      {/* Product Suggestions */}
                    {message.suggestions && message.suggestions.length > 0 && (
                      <div className="mt-3 space-y-2">
                        {message.suggestions.map((product, productIndex) => (
                          <div key={`${product.id}-${productIndex}-${message.id}`} className="bg-gradient-to-r from-golden-50 to-sky-50 p-3 rounded-lg border border-golden-200">
                            <div className="flex justify-between items-start">
                              <div>
                                <h4 className="font-semibold text-primary-800">{product.name}</h4>
                                <p className="text-sm text-primary-600">{product.brand}</p>
                                <div className="flex items-center space-x-2 mt-1">
                                  <span className="text-lg font-bold text-golden-600">₹{product.price}</span>
                                  <div className="flex items-center">
                                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                                    <span className="text-sm text-primary-600 ml-1">{product.rating}</span>
                                  </div>
                                </div>
                              </div>
                              <Heart className="w-5 h-5 text-pink-400" />
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Quiz Questions */}
                    {message.quizQuestion && (
                      <div className="mt-3 space-y-2">
                        <p className="font-semibold text-primary-800">{message.quizQuestion.question}</p>                        <div className="space-y-1">
                          {message.quizQuestion.options.map((option, index) => (
                            <button
                              key={`${message.id}-option-${index}`}
                              onClick={() => handleQuizAnswer(option)}
                              className="w-full text-left p-2 bg-gradient-to-r from-golden-100 to-sky-100 hover:from-golden-200 hover:to-sky-200 rounded border border-golden-200 text-sm transition-colors"
                            >
                              {option}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
              
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-white border border-golden-200 p-3 rounded-lg">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-golden-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-golden-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-golden-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>            {/* Quick Actions */}
            {!quizState.isActive && (
              <div className="p-3 md:p-3 border-t border-golden-200">
                <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2 mb-3">
                  <button
                    onClick={startQuiz}
                    className="flex-1 bg-gradient-to-r from-pink-100 to-rose-100 text-pink-700 py-2 px-3 rounded-lg text-xs font-medium hover:from-pink-200 hover:to-rose-200 transition-colors"
                  >
                    Take Quiz 🌟
                  </button>
                  <button
                    onClick={() => sendMessage("Show me your bestsellers")}
                    className="flex-1 bg-gradient-to-r from-golden-100 to-sunshine-100 text-golden-700 py-2 px-3 rounded-lg text-xs font-medium hover:from-golden-200 hover:to-sunshine-200 transition-colors"
                  >
                    Bestsellers ⭐
                  </button>
                </div>
              </div>
            )}            {/* Input */}
            <div className="p-3 md:p-4 border-t border-golden-200">
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && sendMessage(inputValue)}
                  placeholder="Ask about luxury products..."
                  className="flex-1 p-2 md:p-3 border border-golden-200 rounded-lg focus:border-golden-400 focus:outline-none text-sm"
                  disabled={isLoading}
                />
                <button
                  onClick={() => sendMessage(inputValue)}
                  disabled={isLoading || !inputValue.trim()}
                  className="bg-gradient-to-r from-golden-500 to-golden-600 text-cream-50 p-2 md:p-3 rounded-lg hover:from-golden-600 hover:to-golden-700 transition-colors disabled:opacity-50"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}