import { prisma } from "@/lib/prisma";

export const getOrders = async (userId: string, isAdmin: boolean) => {
  return prisma.orders.findMany({
    where: isAdmin ? undefined : { user_id: userId },
    orderBy: { created_at: "desc" },
    include: {
      users: {
        select: {
          id: true,
          first_name: true,
          last_name: true,
          email: true,
        },
      },
      addresses: true,
      order_items: {
        include: {
          products: {
            include: {
              product_images: {
                where: { is_primary: true },
                take: 1,
              },
            },
          },
        },
      },
    },
  });
};
