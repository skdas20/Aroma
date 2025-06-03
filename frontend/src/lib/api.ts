const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

// API response types
export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
}

export interface Product {
  id: number;
  name: string;
  brand: string;
  category: string;
  price: number;
  originalPrice: number;
  image: string;
  images: string[];
  description: string;
  notes: {
    top: string[];
    middle: string[];
    base: string[];
  };
  size: string;
  stock: number;
  rating: number;
  reviews: number;
}

export interface CartItem extends Product {
  quantity: number;
  addedAt: string;
}

export interface CartSummary {
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
  itemCount: number;
}

export interface Cart {
  items: CartItem[];
  summary: CartSummary;
}

// API functions
export const api = {
  // Products
  async getProducts(params?: {
    category?: string;
    search?: string;
    minPrice?: number;
    maxPrice?: number;
    sort?: string;
  }): Promise<{ success: boolean; products: Product[]; total: number }> {
    const searchParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          searchParams.append(key, value.toString());
        }
      });
    }
    
    const response = await fetch(`${API_BASE_URL}/products?${searchParams}`);
    return response.json();
  },

  async getProduct(id: number): Promise<{ success: boolean; product: Product }> {
    const response = await fetch(`${API_BASE_URL}/products/${id}`);
    return response.json();
  },

  async getCategories(): Promise<{ success: boolean; categories: string[] }> {
    const response = await fetch(`${API_BASE_URL}/products/categories/list`);
    return response.json();
  },

  // Cart
  async getCart(userId: string): Promise<{ success: boolean; cart: Cart }> {
    const response = await fetch(`${API_BASE_URL}/cart/${userId}`);
    return response.json();
  },

  async addToCart(userId: string, productId: number, quantity: number = 1): Promise<{ success: boolean; message: string; cartItemCount: number }> {
    const response = await fetch(`${API_BASE_URL}/cart/${userId}/add`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ productId, quantity }),
    });
    return response.json();
  },

  async updateCartItem(userId: string, itemId: number, quantity: number): Promise<{ success: boolean; message: string }> {
    const response = await fetch(`${API_BASE_URL}/cart/${userId}/update/${itemId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ quantity }),
    });
    return response.json();
  },

  async removeFromCart(userId: string, itemId: number): Promise<{ success: boolean; message: string }> {
    const response = await fetch(`${API_BASE_URL}/cart/${userId}/remove/${itemId}`, {
      method: 'DELETE',
    });
    return response.json();
  },

  async clearCart(userId: string): Promise<{ success: boolean; message: string }> {
    const response = await fetch(`${API_BASE_URL}/cart/${userId}/clear`, {
      method: 'DELETE',
    });
    return response.json();
  },

  // Auth
  async login(email: string, name: string, avatar?: string): Promise<{ success: boolean; user: User; token: string }> {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, name, avatar }),
    });
    return response.json();
  },
  // Chatbot
  chatbot: {
    async sendMessage(data: { 
      message: string; 
      isQuiz?: boolean; 
      userPreferences?: Record<string, any> 
    }): Promise<{ 
      success: boolean; 
      response: string; 
      suggestions?: Product[];
      quizQuestion?: {
        question: string;
        options: string[];
        step: number;
      };
      isQuizComplete?: boolean;
    }> {
      const response = await fetch(`${API_BASE_URL}/chatbot/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      return response.json();
    }
  },

  // Legacy chatbot method (keeping for backward compatibility)
  async chatWithBot(message: string): Promise<{ success: boolean; response: string; suggestions: Product[] }> {
    const response = await fetch(`${API_BASE_URL}/chatbot/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message }),
    });
    return response.json();
  },

  // Health check
  async healthCheck(): Promise<{ status: string; message: string; timestamp: string }> {
    const response = await fetch(`${API_BASE_URL}/health`);
    return response.json();
  }
};
