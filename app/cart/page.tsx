import Image from "next/image";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";

const cartItems = [
  {
    name: "Aalto Sofa",
    description: "Oat Boucle, Walnut Legs",
    sku: "LL-SF-AAL-OAT",
    price: 2480,
    quantity: 1,
    image: "/products/sofa.jpg",
    stock: "In Stock",
  },
  {
    name: "Hearth Dining Table",
    description: "Solid Oak, Seats 6",
    sku: "LL-TB-HRT-OAK",
    price: 1860,
    quantity: 1,
    image: "/products/table.jpg",
    stock: "In Stock",
  },
  {
    name: "Hue Wall Sconce",
    description: "Brushed Brass, Set of 2",
    sku: "LL-LT-HUE-BRS",
    price: 420,
    quantity: 2,
    image: "/products/light.jpg",
    stock: "Only 3 left",
  },
];

export default function CartPage() {
  return (
    <main className="p-8 space-y-8">
      {/* Header */}
      <div className="flex items-center">
        <div>
          <h1 className="text-4xl font-serif">Your Cart</h1>
          <p className="text-muted-foreground">3 items</p>
        </div>

        <div className="flex items-center gap-4 text-sm">
          <span className="rounded-full bg-black text-white px-3 py-1">1</span>
          Cart
          <Separator className="w-12" />
          <span className="rounded-full border px-3 py-1">2</span>
          Shipping
          <Separator className="w-12" />
          <span className="rounded-full border px-3 py-1">3</span>
          Payment
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-5">
          {cartItems.map((item) => (
            <Card key={item.sku}>
              <CardContent className="p-5 flex gap-6">
                <Image
                  src={item.image}
                  alt={item.name}
                  width={120}
                  height={120}
                  className="rounded-lg object-cover"
                />

                <div className="flex-1 space-y-2">
                  <h2 className="text-xl font-serif">{item.name}</h2>

                  <p className="text-sm text-muted-foreground">
                    {item.description}
                  </p>

                  <p className="text-sm text-muted-foreground">
                    SKU: {item.sku}
                  </p>

                  <p className="text-sm">✓ {item.stock}</p>

                  <div className="flex items-center gap-3 pt-3">
                    <div className="flex border rounded-full">
                      <Button variant="ghost">-</Button>

                      <div className="px-4 flex items-center">
                        {item.quantity}
                      </div>

                      <Button variant="ghost">+</Button>
                    </div>

                    <Button variant="ghost">Remove</Button>

                    <Button variant="ghost">Save for later</Button>
                  </div>
                </div>

                <div className="text-right">
                  <p className="text-lg font-medium">
                    ${item.price.toLocaleString()}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}

          <Button variant="link">← Continue Shopping</Button>
        </div>

        {/* Summary */}
        <Card className="h-fit">
          <CardHeader>
            <CardTitle className="font-serif">Order Summary</CardTitle>
          </CardHeader>

          <CardContent className="space-y-5">
            <Separator />

            <div className="flex justify-between">
              <span>Subtotal (3 items)</span>

              <span>$4,760</span>
            </div>

            <div className="flex justify-between">
              <span>Shipping</span>

              <span>Free</span>
            </div>

            <div className="flex justify-between">
              <span>Estimated Tax</span>

              <span>$309.40</span>
            </div>

            <div className="flex gap-3">
              <Input placeholder="Promo code" />

              <Button>Apply</Button>
            </div>

            <Separator />

            <div className="flex justify-between text-xl">
              <span>Total</span>

              <span>$5,069.40</span>
            </div>

            <Link href={"/checkout"}>
              <Button className="w-full">Proceed to Checkout</Button>
            </Link>

            <div className="text-sm text-muted-foreground space-y-2">
              <p>🛡 Secure checkout, encrypted payment</p>

              <p>📦 Free white-glove delivery on this order</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
