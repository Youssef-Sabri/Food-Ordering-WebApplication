/* eslint-disable @typescript-eslint/no-require-imports */
const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function main() {
  const adminPassword = await bcrypt.hash("Admin@123", 12);

  await prisma.user.upsert({
    where: { email: "admin@fooddash.com" },
    update: {},
    create: {
      name: "Admin",
      email: "admin@fooddash.com",
      password: adminPassword,
      phone: "01000000000",
      role: "ADMIN",
    },
  });

  const categories = [
    { nameEn: "Burgers", nameAr: "برجر" },
    { nameEn: "Pizza", nameAr: "بيتزا" },
    { nameEn: "Drinks", nameAr: "مشروبات" },
    { nameEn: "Desserts", nameAr: "حلويات" },
  ];

  await prisma.category.deleteMany();

  for (const cat of categories) {
    await prisma.category.create({ data: cat });
  }

  const products = [
    {
      nameEn: "Classic Beef Burger",
      nameAr: "برجر لحم كلاسيكي",
      descriptionEn: "Juicy beef patty with lettuce, tomato, and special sauce",
      descriptionAr: "شريحة لحم بقري طرية مع خس وطماطم وصلصة خاصة",
      category: "Burgers",
      price: 120,
      image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=300&fit=crop",
    },
    {
      nameEn: "Cheese Burger",
      nameAr: "برجر جبن",
      descriptionEn: "Beef patty topped with melted cheddar cheese",
      descriptionAr: "شريحة لحم بقري مع جبنة شيدر ذائبة",
      category: "Burgers",
      price: 140,
      image: "https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?w=400&h=300&fit=crop",
    },
    {
      nameEn: "Chicken Burger",
      nameAr: "برجر دجاج",
      descriptionEn: "Crispy chicken fillet with coleslaw",
      descriptionAr: "فيليه دجاج مقرمش مع سلطة الكولسلو",
      category: "Burgers",
      price: 130,
      image: "https://images.unsplash.com/photo-1777634659945-fae3d53ea1dd?w=400&h=300&fit=crop",
    },
    {
      nameEn: "Pepperoni Pizza",
      nameAr: "بيتزا بيبروني",
      descriptionEn: "Classic pepperoni with mozzarella cheese",
      descriptionAr: "بيبروني كلاسيكي مع جبنة موزاريلا",
      category: "Pizza",
      price: 160,
      image: "https://images.unsplash.com/photo-1534308983496-4fabb1a015ee?w=400&h=300&fit=crop",
    },
    {
      nameEn: "Margherita Pizza",
      nameAr: "بيتزا مارجريتا",
      descriptionEn: "Fresh tomatoes, mozzarella, and basil",
      descriptionAr: "طماطم طازجة، موزاريلا، وريحان",
      category: "Pizza",
      price: 140,
      image: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400&h=300&fit=crop",
    },
    {
      nameEn: "BBQ Chicken Pizza",
      nameAr: "بيتزا دجاج باربكيو",
      descriptionEn: "Grilled chicken with BBQ sauce and onions",
      descriptionAr: "دجاج مشوي مع صلصة باربكيو وبصل",
      category: "Pizza",
      price: 180,
      image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&h=300&fit=crop",
    },
    {
      nameEn: "Cola",
      nameAr: "كولا",
      descriptionEn: "Refreshing carbonated drink",
      descriptionAr: "مشروب غازي منعش",
      category: "Drinks",
      price: 15,
      image: "https://images.unsplash.com/photo-1554866585-cd94860890b7?w=400&h=300&fit=crop",
    },
    {
      nameEn: "Orange Juice",
      nameAr: "عصير برتقال",
      descriptionEn: "Freshly squeezed orange juice",
      descriptionAr: "عصير برتقال طازج",
      category: "Drinks",
      price: 25,
      image: "https://images.unsplash.com/photo-1583073600538-f219abfb20bc?w=400&h=300&fit=crop",
    },
    {
      nameEn: "Water",
      nameAr: "مياه",
      descriptionEn: "Mineral water 500ml",
      descriptionAr: "مياه معدنية 500 مل",
      category: "Drinks",
      price: 5,
      image: "https://images.unsplash.com/photo-1523362628745-0c100150b504?w=400&h=300&fit=crop",
    },
    {
      nameEn: "Chocolate Cake",
      nameAr: "كعكة شوكولاتة",
      descriptionEn: "Rich chocolate layer cake",
      descriptionAr: "كعكة شوكولاتة غنية",
      category: "Desserts",
      price: 60,
      image: "https://images.unsplash.com/photo-1606890737304-57a1ca8a5b62?w=400&h=300&fit=crop",
    },
    {
      nameEn: "Ice Cream Sundae",
      nameAr: "آيس كريم صنداي",
      descriptionEn: "Vanilla ice cream with chocolate syrup",
      descriptionAr: "آيس كريم فانيليا مع صوص شوكولاتة",
      category: "Desserts",
      price: 45,
      image: "https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=400&h=300&fit=crop",
    },
    {
      nameEn: "Cheesecake",
      nameAr: "تشيز كيك",
      descriptionEn: "New York style cheesecake with berry topping",
      descriptionAr: "تشيز كيك بنيويورك مع طبقة توت",
      category: "Desserts",
      price: 70,
      image: "https://images.unsplash.com/photo-1533134242443-d4fd215305ad?w=400&h=300&fit=crop",
    },
  ];

  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.product.deleteMany();

  for (const product of products) {
    await prisma.product.create({ data: product });
  }

  console.log("Database seeded successfully!");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
