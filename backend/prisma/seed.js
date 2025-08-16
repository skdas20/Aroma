const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const newProductsData = [
  {
    numericId: 1,
    name: "The Director",
    brand: "Amara",
    category: "Intense",
    sex: "For Him",
    description: "Command attention with this bold, magnetic scent. Dark, powerful, and undeniably sophisticated — made for the man who leads with confidence.",
    notes: { top: "Bergamot, Black Pepper", middle: "Leather, Tobacco", base: "Amber, Cedarwood" },
    size: "100ml",
  },
  {
    numericId: 2,
    name: "Mistique",
    brand: "Amara",
    category: "Luxury",
    sex: "For Her",
    description: "Wrap yourself in mystery and elegance. A luxurious blend that lingers like a whispered secret — timeless, feminine, and utterly captivating.",
    notes: { top: "Rose Petal, Citrus", middle: "Jasmine, Orris Root", base: "Vanilla, White Musk" },
    size: "100ml",
  },
  {
    numericId: 3,
    name: "Fresh",
    brand: "Amara",
    category: "Fresh",
    sex: "Unisex",
    description: "Pure, clean, and instantly refreshing. A burst of crisp energy that awakens the senses — perfect for every moment, every mood.",
    notes: { top: "Lemon, Mint", middle: "Green Leaves, Apple", base: "White Musk, Driftwood" },
    size: "100ml",
  },
  {
    numericId: 4,
    name: "Wanted",
    brand: "Amara",
    category: "Intense",
    sex: "For Him",
    description: "A daring fragrance that exudes power and allure. Unapologetically bold — for the man who knows what he wants, and takes it.",
    notes: { top: "Spices, Cardamom", middle: "Patchouli, Incense", base: "Leather, Tonka Bean" },
    size: "100ml",
  },
  {
    numericId: 5,
    name: "Smoky",
    brand: "Amara",
    category: "Natural",
    sex: "Unisex",
    description: "Earthy, warm, and deeply grounding. Inspired by open fires and wild forests — a raw, natural scent for the free spirit.",
    notes: { top: "Smoked Wood, Birch Tar", middle: "Vetiver, Oakmoss", base: "Sandalwood, Amber" },
    size: "100ml",
  },
  {
    numericId: 6,
    name: "Temptation",
    brand: "Amara",
    category: "Luxury",
    sex: "For Her",
    description: "Indulge in irresistible charm. A rich, seductive blend that turns heads and lingers in memory — true luxury in a bottle.",
    notes: { top: "Peach, Bergamot", middle: "Jasmine, Ylang-Ylang", base: "Vanilla, Patchouli" },
    size: "100ml",
  },
  {
    numericId: 7,
    name: "The Vikings",
    brand: "Amara",
    category: "Fresh",
    sex: "Unisex",
    description: "Fierce, zesty, and untamed. Like a Nordic breeze — icy, sharp, and full of adventure. For those who live life on the edge.",
    notes: { top: "Bergamot, Sea Salt", middle: "Peppermint, Pine", base: "Driftwood, Musk" },
    size: "100ml",
  }
];

const imageUrl = '/images/perfume.jpeg';

async function main() {
  console.log('Wiping existing product data...');
  await prisma.product.deleteMany({});
  console.log('Existing data wiped.');

  console.log('Start seeding new data...');
  const productsToCreate = newProductsData.map(p => {
    const price = Math.floor(Math.random() * (8000 - 2000 + 1)) + 2000;
    const originalPrice = price + Math.floor(Math.random() * (1000 - 500 + 1)) + 500;
    const rating = (Math.random() * (5.0 - 4.0) + 4.0).toFixed(1);
    const reviews = Math.floor(Math.random() * (300 - 10 + 1)) + 10;
    const stock = Math.floor(Math.random() * (150 - 20 + 1)) + 20;

    return {
      ...p,
      price,
      originalPrice,
      stock,
      rating: parseFloat(rating),
      reviews,
      image: imageUrl,
      images: [imageUrl],
    };
  });

  await prisma.product.createMany({
    data: productsToCreate,
  });

  console.log(`Seeding finished. ${productsToCreate.length} products created.`);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
