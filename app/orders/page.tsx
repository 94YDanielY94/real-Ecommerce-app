import Image from "next/image";
import Navbar from "@/components/ui/Navbar";
import Footer from "@/components/ui/Footer";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

const orders = [
  {
    id: "#ORD-10254",
    date: "July 20, 2026",
    total: 5069.4,
    status: "Delivered",
    items: [
      {
        id: 1,
        name: "Aalto Sofa",
        qty: 1,
        price: 2480,
        image: "/products/sofa.jpg",
      },
      {
        id: 2,
        name: "Hearth Dining Table",
        qty: 1,
        price: 1860,
        image: "/products/table.jpg",
      },
      {
        id: 3,
        name: "Hue Wall Sconce",
        qty: 2,
        price: 420,
        image: "/products/light.jpg",
      },
    ],
  },
  {
    id: "#ORD-10212",
    date: "July 15, 2026",
    total: 1240,
    status: "Processing",
    items: [
      {
        id: 4,
        name: "Office Chair",
        qty: 1,
        price: 1240,
        image: "/products/chair.jpg",
      },
    ],
  },
];

export default function OrdersPage() {
  return (
    <div className="min-h-screen flex flex-col justify-between space-y-8">
      <Navbar />

      <main className="max-w-7xl mx-auto w-full px-4 sm:px-8 lg:px-12 space-y-6">
        {/* Page Title Header */}
        <div className="space-y-1">
          <h1 className="text-2xl sm:text-3xl font-bold">Order History</h1>
          <p className="text-sm sm:text-base text-muted-foreground">
            View all your previous orders.
          </p>
        </div>

        {/* Orders Stack */}
        <div className="space-y-6">
          {orders.map((order) => (
            <Card key={order.id} className="overflow-hidden">
              <CardHeader className="p-4 sm:p-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <CardTitle className="text-lg sm:text-xl font-bold">
                      {order.id}
                    </CardTitle>
                    <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
                      Ordered on {order.date}
                    </p>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-4">
                    <Badge
                      variant={
                        order.status === "Delivered"
                          ? "default"
                          : order.status === "Processing"
                          ? "secondary"
                          : "destructive"
                      }
                      className="text-xs px-2.5 py-0.5"
                    >
                      {order.status}
                    </Badge>

                    <div className="text-right">
                      <p className="text-xs text-muted-foreground">Total</p>
                      <p className="font-semibold text-sm sm:text-base">
                        ${order.total.toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
              </CardHeader>

              <Separator />

              <CardContent className="p-4 sm:p-6 space-y-4">
                {/* Product List */}
                <div className="space-y-4">
                  {order.items.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between gap-4"
                    >
                      <div className="flex items-center gap-3 sm:gap-4 min-w-0">
                        <div className="relative w-16 h-16 sm:w-20 sm:h-20 shrink-0 overflow-hidden rounded-md bg-neutral-100">
                          <Image
                            src="/wal16.png"
                            alt={item.name}
                            fill
                            className="object-cover"
                          />
                        </div>

                        <div className="min-w-0">
                          <h3 className="font-medium text-sm sm:text-base truncate">
                            {item.name}
                          </h3>
                          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
                            Qty: {item.qty}
                          </p>
                        </div>
                      </div>

                      <p className="font-medium text-sm sm:text-base shrink-0">
                        ${item.price.toLocaleString()}
                      </p>
                    </div>
                  ))}
                </div>

                <Separator />

                {/* Actions Bar */}
                <div className="flex flex-col sm:flex-row justify-end gap-2.5 pt-1">
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
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}