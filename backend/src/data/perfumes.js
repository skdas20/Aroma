const perfumes = [
  {
    id: 1,
    name: "Mystic Rose",
    brand: "Aroma Exclusive",
    category: "Women",
    price: 89.99,
    originalPrice: 120.00,
    image: "/api/placeholder/300/400",
    images: ["/api/placeholder/300/400", "/api/placeholder/300/400", "/api/placeholder/300/400"],
    description: "A captivating blend of Bulgarian rose, vanilla, and sandalwood. Perfect for romantic evenings.",
    notes: {
      top: ["Rose Petals", "Bergamot", "Pink Pepper"],
      middle: ["Bulgarian Rose", "Jasmine", "Lily of Valley"],
      base: ["Sandalwood", "Vanilla", "Musk"]
    },
    size: "50ml",
    stock: 25,
    rating: 4.8,
    reviews: 124
  },
  {
    id: 2,
    name: "Ocean Breeze",
    brand: "Aroma Marine",
    category: "Men",
    price: 75.99,
    originalPrice: 95.00,
    image: "/api/placeholder/300/400",
    images: ["/api/placeholder/300/400", "/api/placeholder/300/400"],
    description: "Fresh aquatic scent with citrus top notes and woody base. Ideal for daily wear.",
    notes: {
      top: ["Sea Salt", "Lime", "Grapefruit"],
      middle: ["Marine Accord", "Lavender", "Geranium"],
      base: ["Cedarwood", "Ambergris", "White Musk"]
    },
    size: "75ml",
    stock: 18,
    rating: 4.6,
    reviews: 89
  },
  {
    id: 3,
    name: "Golden Sunset",
    brand: "Aroma Luxury",
    category: "Unisex",
    price: 110.99,
    originalPrice: 140.00,
    image: "/api/placeholder/300/400",
    images: ["/api/placeholder/300/400", "/api/placeholder/300/400", "/api/placeholder/300/400"],
    description: "Warm and sophisticated with amber, oud, and spices. A luxurious evening fragrance.",
    notes: {
      top: ["Saffron", "Cardamom", "Orange Blossom"],
      middle: ["Rose", "Oud", "Patchouli"],
      base: ["Amber", "Vanilla", "Benzoin"]
    },
    size: "100ml",
    stock: 12,
    rating: 4.9,
    reviews: 67
  },
  {
    id: 4,
    name: "Fresh Garden",
    brand: "Aroma Natural",
    category: "Women",
    price: 65.99,
    originalPrice: 85.00,
    image: "/api/placeholder/300/400",
    images: ["/api/placeholder/300/400"],
    description: "Light and refreshing with green notes and white flowers. Perfect for spring and summer.",
    notes: {
      top: ["Green Leaves", "Cucumber", "Lemon"],
      middle: ["White Tea", "Magnolia", "Freesia"],
      base: ["White Musk", "Cedar", "Amber"]
    },
    size: "50ml",
    stock: 30,
    rating: 4.5,
    reviews: 156
  },
  {
    id: 5,
    name: "Dark Knight",
    brand: "Aroma Intense",
    category: "Men",
    price: 95.99,
    originalPrice: 125.00,
    image: "/api/placeholder/300/400",
    images: ["/api/placeholder/300/400", "/api/placeholder/300/400"],
    description: "Bold and masculine with tobacco, leather, and dark woods. For the confident man.",
    notes: {
      top: ["Black Pepper", "Ginger", "Elemi"],
      middle: ["Tobacco", "Leather", "Rose"],
      base: ["Oud", "Sandalwood", "Patchouli"]
    },
    size: "75ml",
    stock: 8,
    rating: 4.7,
    reviews: 93
  },
  {
    id: 6,
    name: "Citrus Burst",
    brand: "Aroma Fresh",
    category: "Unisex",
    price: 55.99,
    originalPrice: 70.00,
    image: "/api/placeholder/300/400",
    images: ["/api/placeholder/300/400", "/api/placeholder/300/400"],
    description: "Energizing citrus blend perfect for morning wear. Uplifting and invigorating.",
    notes: {
      top: ["Lemon", "Orange", "Grapefruit"],
      middle: ["Mint", "Basil", "Green Tea"],
      base: ["White Musk", "Vetiver", "Amberwood"]
    },
    size: "30ml",
    stock: 45,
    rating: 4.4,
    reviews: 201
  }
];

module.exports = perfumes;