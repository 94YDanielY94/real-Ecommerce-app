import Navbar from "@/components/ui/Navbar";
import Footer from "@/components/ui/Footer";
import OrdersClient, { Order } from "./OrdersClient";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { getOrders } from "@/lib/queries/orders";

export default async function OrdersPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  const rawOrders = await getOrders(
    session.user.id,
    session.user.is_admin === true,
  );

  // Serialize Prisma Decimal/Date values into plain JSON-safe primitives
  // so they can be passed from the server component to the client component.
  const orders: Order[] = rawOrders.map((order) => ({
    ...order,
    total_amount: order.total_amount.toString(),
    created_at: order.created_at?.toISOString() ?? null,
    order_items: order.order_items.map((item) => ({
      ...item,
      unit_price: item.unit_price.toString(),
      products: {
        ...item.products,
        price: item.products.price.toString(),
      },
    })),
  }));

  return (
    <div className="min-h-screen flex flex-col justify-between space-y-8">
      <Navbar />

      <OrdersClient orders={orders} isAdmin={session.user.is_admin === true} />

      <Footer />
    </div>
  );
}
