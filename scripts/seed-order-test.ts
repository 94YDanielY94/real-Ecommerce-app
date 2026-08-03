import { PrismaClient } from "../prisma/generated/client";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcryptjs";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});

const prisma = new PrismaClient({ adapter });

async function main() {
  // 1. Create admin test user if not exists
  let admin = await prisma.users.findUnique({
    where: { email: "ordertest-admin@example.com" },
  });
  if (!admin) {
    admin = await prisma.users.create({
      data: {
        email: "ordertest-admin@example.com",
        first_name: "Order",
        last_name: "Admin",
        is_admin: true,
        password_hash: await bcrypt.hash("TestPass1234", 12),
      },
    });
    console.log("Created admin user:", admin.id);
  } else {
    console.log("Admin user already exists:", admin.id);
  }

  // 2. Ensure regular test user has at least one order for listing tests
  const regular = await prisma.users.findUnique({
    where: { email: "ordertest-user@example.com" },
  });
  if (regular) {
    const existing = await prisma.orders.count({
      where: { user_id: regular.id },
    });
    if (existing === 0) {
      // Need a valid address for the order
      let addr = await prisma.addresses.findFirst({
        where: { user_id: regular.id },
      });
      if (!addr) {
        addr = await prisma.addresses.create({
          data: {
            user_id: regular.id,
            address_line1: "1 Test Street",
            city: "Testville",
            country: "US",
            is_default: true,
          },
        });
      }

      // Find some product to attach an order item
      const product = await prisma.products.findFirst();
      if (!product) {
        console.log("No products found - cannot create order item");
      } else {
        const order = await prisma.orders.create({
          data: {
            user_id: regular.id,
            shipping_address_id: addr.id,
            status: "PROCESSING",
            total_amount: 99.99,
            order_items: {
              create: {
                product_id: product.id,
                quantity: 1,
                unit_price: product.price,
              },
            },
          },
        });
        console.log("Created test order:", order.id);
      }
    } else {
      console.log("Regular user already has orders");
    }
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
