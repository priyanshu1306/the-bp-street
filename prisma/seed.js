const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const products = [
    // Momos Category
    {
        name: "Classic Steamed Momos",
        description: "Soft and juicy steamed dumplings with your choice of filling, served with spicy red chutney",
        price: 99,
        image: "/images/products/momos-steamed.jpg",
        category: "Momos",
        isVeg: true,
        isBestSeller: true,
        isTrending: false,
    },
    {
        name: "Fried Momos",
        description: "Crispy golden fried momos with a crunchy exterior and juicy filling",
        price: 119,
        image: "/images/products/momos-fried.jpg",
        category: "Momos",
        isVeg: true,
        isBestSeller: false,
        isTrending: true,
    },
    {
        name: "Tandoori Momos",
        description: "Chargrilled momos marinated in tandoori spices with smoky flavor",
        price: 139,
        image: "/images/products/momos-tandoori.jpg",
        category: "Momos",
        isVeg: true,
        isBestSeller: true,
        isTrending: true,
    },
    {
        name: "Kurkure Momos",
        description: "Extra crispy momos coated with crunchy cornflakes and spices",
        price: 129,
        image: "/images/products/momos-kurkure.jpg",
        category: "Momos",
        isVeg: true,
        isBestSeller: false,
        isTrending: true,
    },
    {
        name: "Afghani Momos",
        description: "Creamy and cheesy momos in rich afghani gravy",
        price: 149,
        image: "/images/products/momos-afghani.jpg",
        category: "Momos",
        isVeg: true,
        isBestSeller: true,
        isTrending: false,
    },
    {
        name: "Schezwan Fried Momos",
        description: "Spicy fried momos tossed in hot schezwan sauce",
        price: 139,
        image: "/images/products/momos-schezwan.jpg",
        category: "Momos",
        isVeg: true,
        isBestSeller: false,
        isTrending: false,
    },

    // Rice & Noodles
    {
        name: "Veg Fried Rice",
        description: "Wok-tossed rice with fresh vegetables and aromatic spices",
        price: 129,
        image: "/images/products/fried-rice-veg.jpg",
        category: "Rice & Noodles",
        isVeg: true,
        isBestSeller: true,
        isTrending: false,
    },
    {
        name: "Schezwan Fried Rice",
        description: "Spicy fried rice with schezwan sauce and vegetables",
        price: 139,
        image: "/images/products/fried-rice-schezwan.jpg",
        category: "Rice & Noodles",
        isVeg: true,
        isBestSeller: false,
        isTrending: true,
    },
    {
        name: "Hakka Noodles",
        description: "Classic Indo-Chinese stir-fried noodles with vegetables",
        price: 119,
        image: "/images/products/hakka-noodles.jpg",
        category: "Rice & Noodles",
        isVeg: true,
        isBestSeller: true,
        isTrending: false,
    },
    {
        name: "Chilli Garlic Noodles",
        description: "Spicy noodles with garlic, chilli, and vegetables",
        price: 139,
        image: "/images/products/chilli-garlic-noodles.jpg",
        category: "Rice & Noodles",
        isVeg: true,
        isBestSeller: false,
        isTrending: true,
    },

    // Starters
    {
        name: "Paneer Chilli",
        description: "Crispy paneer cubes tossed with bell peppers in spicy sauce",
        price: 169,
        image: "/images/products/paneer-chilli.jpg",
        category: "Starters",
        isVeg: true,
        isBestSeller: true,
        isTrending: true,
    },
    {
        name: "Mushroom Chilli",
        description: "Crispy mushrooms in Indo-Chinese chilli sauce",
        price: 159,
        image: "/images/products/mushroom-chilli.jpg",
        category: "Starters",
        isVeg: true,
        isBestSeller: false,
        isTrending: false,
    },
    {
        name: "Crispy Corn",
        description: "Golden fried corn kernels with spices and herbs",
        price: 129,
        image: "/images/products/crispy-corn.jpg",
        category: "Starters",
        isVeg: true,
        isBestSeller: true,
        isTrending: false,
    },
    {
        name: "Spring Rolls",
        description: "Crispy rolls stuffed with vegetables, served with sauce",
        price: 99,
        image: "/images/products/spring-rolls.jpg",
        category: "Starters",
        isVeg: true,
        isBestSeller: false,
        isTrending: false,
    },

    // Beverages
    {
        name: "Masala Chai",
        description: "Authentic Indian spiced tea made fresh",
        price: 29,
        image: "/images/products/masala-chai.jpg",
        category: "Beverages",
        isVeg: true,
        isBestSeller: true,
        isTrending: false,
    },
    {
        name: "Cold Coffee",
        description: "Chilled blended coffee with ice cream",
        price: 79,
        image: "/images/products/cold-coffee.jpg",
        category: "Beverages",
        isVeg: true,
        isBestSeller: false,
        isTrending: true,
    },
    {
        name: "Lemon Soda",
        description: "Refreshing lemon soda with mint",
        price: 49,
        image: "/images/products/lemon-soda.jpg",
        category: "Beverages",
        isVeg: true,
        isBestSeller: false,
        isTrending: false,
    },
];

async function main() {
    console.log("🌱 Seeding database...");

    // Clear existing products
    await prisma.product.deleteMany({});
    console.log("🗑️  Cleared existing products");

    // Create products
    for (const product of products) {
        await prisma.product.create({
            data: product,
        });
    }

    console.log(`✅ Created ${products.length} products`);
    console.log("🎉 Seeding complete!");
}

main()
    .catch((e) => {
        console.error("❌ Seeding error:", e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
