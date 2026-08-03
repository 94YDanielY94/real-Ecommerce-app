"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/components/ui/toast";
import { Loader2, Package, PackageCheck, Truck } from "lucide-react";

// --- Types matching the API response ---
export interface OrderItem {
  id: string;
  quantity: number;
  unit_price: string;
  products: {
    id: string;
    name: string;
    price: string;
    product_images: { image_url: string }[];
  };
}

export interface OrderUser {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
}

export interface OrderAddress {
  id: string;
  address_line1: string;
  address_line2: string | null;
  city: string;
  state: string | null;
  postal_code: string | null;
  country: string;
}

export interface Order {
  id: string;
  user_id: string;
  shipping_address_id: string;
  status: string | null;
  total_amount: string | number;
  created_at: string | null;
  order_items: OrderItem[];
  users: OrderUser;
  addresses: OrderAddress;
}

interface OrdersClientProps {
  orders: Order[];
  isAdmin: boolean;
}

// --- Helpers ---
const normalizeStatus = (status: string | null): string => {
  switch (status?.toUpperCase()) {
    case "DELIVERED":
      return "Delivered";
    case "PROCESSING":
      return "Processing";
    default:
      return "Pending";
  }
};

const formatDate = (date: string | null): string => {
  if (!date) return "N/A";
  const d = new Date(date);
  if (isNaN(d.getTime())) return "N/A";
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

const formatMoney = (value: string | number): string => {
  const num = typeof value === "string" ? parseFloat(value) : value;
  if (isNaN(num)) return "0.00";
  return num.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};

const shortId = (id: string): string => `#ORD-${id.slice(0, 8).toUpperCase()}`;

const updateOrderStatus = async (orderId: string, status: string) => {
  const res = await fetch(`/api/orders/${orderId}/status`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status }),
  });
  const result = await res.json();
  if (!res.ok) {
    throw new Error(result.error || "Failed to update order status");
  }
  return result as Order;
};

export default function OrdersClient({ orders, isAdmin }: OrdersClientProps) {
  const router = useRouter();

  const statusMutation = useMutation({
    mutationFn: ({ orderId, status }: { orderId: string; status: string }) =>
      updateOrderStatus(orderId, status),
    onSuccess: (updatedOrder) => {
      toast.add({
        type: "success",
        title: "Order updated",
        description: `Order marked as ${normalizeStatus(updatedOrder.status)}.`,
      });
      // Re-fetch the orders from the server to reflect the new status.
      router.refresh();
    },
    onError: (error: Error) => {
      toast.add({
        type: "error",
        title: "Error",
        description: error.message,
      });
    },
  });

  return (
    <div className="min-h-screen flex flex-col justify-between space-y-8">
      <main className="max-w-7xl mx-auto w-full px-4 sm:px-8 lg:px-12 space-y-6">
        {/* Page Title Header */}
        <div className="space-y-1">
          <h1 className="text-2xl sm:text-3xl font-bold">Order History</h1>
          <p className="text-sm sm:text-base text-muted-foreground">
            View all your previous orders.
          </p>
        </div>

        {/* Empty State */}
        {orders.length === 0 && (
          <Card className="p-12 sm:p-16 flex flex-col items-center justify-center text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-neutral-100">
              <Package className="h-8 w-8 text-muted-foreground" />
            </div>
            <h2 className="mt-4 text-xl font-semibold">No orders yet</h2>
            <p className="mt-1 text-sm text-muted-foreground max-w-sm">
              When you place an order, it will appear here so you can track its
              status.
            </p>
          </Card>
        )}

        {/* Orders Stack */}
        <div className="space-y-6">
          {orders.map((order) => {
            const status = normalizeStatus(order.status);

            return (
              <Card key={order.id} className="overflow-hidden">
                <CardHeader className="p-4 sm:p-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <CardTitle className="text-lg sm:text-xl font-bold">
                        {shortId(order.id)}
                      </CardTitle>
                      <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
                        Ordered on {formatDate(order.created_at)}
                      </p>
                      {isAdmin && (
                        <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
                          Customer: {order.users.first_name}{" "}
                          {order.users.last_name} · {order.users.email}
                        </p>
                      )}
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-4">
                      <Badge
                        variant={
                          status === "Delivered"
                            ? "default"
                            : status === "Processing"
                              ? "secondary"
                              : "destructive"
                        }
                        className="text-xs px-2.5 py-0.5"
                      >
                        {status}
                      </Badge>

                      <div className="text-right">
                        <p className="text-xs text-muted-foreground">Total</p>
                        <p className="font-semibold text-sm sm:text-base">
                          ${formatMoney(Number(order.total_amount) / 100)}
                        </p>
                      </div>
                    </div>
                  </div>
                </CardHeader>

                <Separator />

                <CardContent className="p-4 sm:p-6 space-y-4">
                  {/* Product List */}
                  <div className="space-y-4">
                    {order.order_items.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center justify-between gap-4"
                      >
                        <div className="flex items-center gap-3 sm:gap-4 min-w-0">
                          <div className="relative w-16 h-16 sm:w-20 sm:h-20 shrink-0 overflow-hidden rounded-md bg-neutral-100">
                            <Image
                              src={
                                item.products.product_images[0]?.image_url ??
                                "/wal16.png"
                              }
                              alt={item.products.name}
                              fill
                              className="object-cover"
                            />
                          </div>

                          <div className="min-w-0">
                            <h3 className="font-medium text-sm sm:text-base truncate">
                              {item.products.name}
                            </h3>
                            <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
                              Qty: {item.quantity}
                            </p>
                          </div>
                        </div>

                        <p className="font-medium text-sm sm:text-base shrink-0">
                          ${formatMoney(item.products.price)}
                        </p>
                      </div>
                    ))}
                  </div>

                  <Separator />

                  {/* Actions Bar */}
                  <div className="flex flex-col sm:flex-row justify-end gap-2.5 pt-1">
                    {isAdmin ? (
                      <>
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full sm:w-auto text-xs sm:text-sm"
                          disabled={
                            statusMutation.isPending || status === "Processing"
                          }
                          onClick={() =>
                            statusMutation.mutate({
                              orderId: order.id,
                              status: "PROCESSING",
                            })
                          }
                        >
                          {statusMutation.isPending ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Truck className="h-4 w-4" />
                          )}
                          Mark as Processing
                        </Button>

                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full sm:w-auto text-xs sm:text-sm"
                          disabled={
                            statusMutation.isPending || status === "Delivered"
                          }
                          onClick={() =>
                            statusMutation.mutate({
                              orderId: order.id,
                              status: "DELIVERED",
                            })
                          }
                        >
                          <PackageCheck className="h-4 w-4" />
                          Mark as Delivered
                        </Button>
                      </>
                    ) : (
                      <>
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full sm:w-auto text-xs sm:text-sm"
                        >
                          View Details
                        </Button>

                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full sm:w-auto text-xs sm:text-sm"
                        >
                          Track Order
                        </Button>

                        <Button
                          size="sm"
                          className="w-full sm:w-auto text-xs sm:text-sm"
                        >
                          Buy Again
                        </Button>
                      </>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </main>
    </div>
  );
}
