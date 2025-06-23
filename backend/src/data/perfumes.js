const perfumes = [
  {
    id: 1,
    name: "Mystic Rose",
    brand: "Aroma Exclusive",
    category: "Women",    price: 7499,
    originalPrice: 9960,
    image: "https://images.unsplash.com/photo-1541643600914-78b084683601?w=400&h=500&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1541643600914-78b084683601?w=400&h=500&fit=crop",
      "https://images.unsplash.com/photo-1588405748880-12d1d2a59d32?w=400&h=500&fit=crop",
      "https://images.unsplash.com/photo-1595425970377-c9703cf48b6f?w=400&h=500&fit=crop"
    ],
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
    category: "Men",    price: 6307,
    originalPrice: 7885,
    image: "https://images.unsplash.com/photo-1594035910387-fea47794261f?w=400&h=500&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1594035910387-fea47794261f?w=400&h=500&fit=crop",
      "https://images.unsplash.com/photo-1585386959984-a4155224a1ad?w=400&h=500&fit=crop"
    ],
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
    category: "Unisex",    price: 9212,
    originalPrice: 11620,
    image: "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=400&h=500&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=400&h=500&fit=crop",
      "https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=400&h=500&fit=crop",
      "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&h=500&fit=crop"
    ],
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
  },  {
    id: 4,
    name: "Fresh Garden",
    brand: "Aroma Natural",
    category: "Women",    price: 5477,
    originalPrice: 7055,
    image: "https://images.unsplash.com/photo-1615634260167-c8cdede054de?w=400&h=500&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1615634260167-c8cdede054de?w=400&h=500&fit=crop",
      "https://images.unsplash.com/photo-1606107557141-4e5ed22b54b6?w=400&h=500&fit=crop"
    ],
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
  },  {
    id: 5,
    name: "Dark Knight",
    brand: "Aroma Intense",
    category: "Men",    price: 7967,
    originalPrice: 10375,
    image: "https://images.unsplash.com/photo-1563170351-be82bc888aa4?w=400&h=500&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1563170351-be82bc888aa4?w=400&h=500&fit=crop",
      "https://images.unsplash.com/photo-1615634260167-c8cdede054de?w=400&h=500&fit=crop"
    ],
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
  },  {
    id: 6,
    name: "Citrus Burst",
    brand: "Aroma Fresh",
    category: "Unisex",    price: 4647,
    originalPrice: 5810,
    image: "https://th.bing.com/th/id/OIP.Uexxd5gDkWHHPZn_udlWVwHaE8?rs=1&pid=ImgDetMain",
    images: [
      "https://th.bing.com/th/id/OIP.Uexxd5gDkWHHPZn_udlWVwHaE8?rs=1&pid=ImgDetMain",
      "https://images.unsplash.com/photo-1604654894610-df63bc536371?w=400&h=500&fit=crop"
    ],
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