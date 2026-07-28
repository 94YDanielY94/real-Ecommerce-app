import Image from "next/image";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Stepper } from "@/components/ui/stepper";
import Navbar from "@/components/ui/Navbar";
import Footer from "@/components/ui/Footer";

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
    <main className="space-y-8 min-h-screen flex flex-col justify-between">
      <Navbar />

      <div className="max-w-7xl mx-auto w-full space-y-8 px-4 sm:px-8 lg:px-12">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold">Your Cart</h1>
            <p className="text-muted-foreground text-sm">3 items</p>
          </div>

          <div className="flex items-center gap-2 sm:gap-4 text-xs sm:text-sm overflow-x-auto pb-2 md:pb-0">
            <div className="flex items-center gap-2 shrink-0">
              <span className="rounded-full bg-primary text-primary-foreground px-3 py-1 font-medium">1</span>
              <span>Cart</span>
            </div>
            
            <div className="h-0.5 w-6 sm:w-16 md:w-24 bg-primary shrink-0 flex-1" />
            
            <div className="flex items-center gap-2 shrink-0">
              <span className="rounded-full border px-3 py-1 font-medium">2</span>
              <span className="text-muted-foreground">Shipping</span>
            </div>

            <div className="h-0.5 w-6 sm:w-16 md:w-24 bg-neutral-200 shrink-0 flex-1" />

            <div className="flex items-center gap-2 shrink-0">
              <span className="rounded-full border px-3 py-1 font-medium">3</span>
              <span className="text-muted-foreground">Payment</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          <div className="lg:col-span-2 space-y-5">
            {cartItems.map((item) => (
              <Card key={item.sku} className="overflow-hidden">
                <CardContent className="p-4 sm:p-6 flex flex-col sm:flex-row gap-4 sm:gap-6">
                  
                  <div className="relative w-full sm:w-36 h-48 sm:h-36 shrink-0 overflow-hidden rounded-lg">
                    <Image
                      src="/wal16.png"
                      alt={item.name}
                      fill
                      className="object-cover"
                    />
                  </div>

                  <div className="flex-1 space-y-2 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start gap-2">
                        <h2 className="text-lg sm:text-xl font-semibold">{item.name}</h2>
                        <p className="text-base sm:text-lg font-medium sm:hidden">
                          ${item.price.toLocaleString()}
                        </p>
                      </div>

                      <p className="text-sm text-muted-foreground mt-1">
                        {item.description}
                      </p>

                      <p className="text-xs text-muted-foreground mt-0.5">
                        SKU: {item.sku}
                      </p>

                      <p className="text-xs text-emerald-600 font-medium mt-1">
                        ✓ {item.stock}
                      </p>
                    </div>

                    {/* Stepper & Actions */}
                    <div className="flex flex-wrap items-center gap-2 sm:gap-3 pt-3">
                      <Stepper />

                      <div className="flex items-center gap-1 sm:gap-2">
                        <Button variant="ghost" size="sm" className="h-8 px-2 text-xs sm:text-sm">
                          Remove
                        </Button>

                        <Button variant="ghost" size="sm" className="h-8 px-2 text-xs sm:text-sm">
                          Save for later
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* Price (Desktop Right Column) */}
                  <div className="text-right hidden sm:block shrink-0">
                    <p className="text-lg font-medium">
                      ${item.price.toLocaleString()}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}

            <div className="pt-2">
              <Button variant="link" className="px-0 text-sm">
                ← Continue Shopping
              </Button>
            </div>
          </div>

          <div className="lg:col-span-1">
            <Card className="h-fit sticky top-24">
              <CardHeader>
                <CardTitle className="font-serif text-xl">Order Summary</CardTitle>
              </CardHeader>

              <CardContent className="space-y-4">
                <Separator />

                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal (3 items)</span>
                  <span className="font-medium">$4,760</span>
                </div>

                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Shipping</span>
                  <span className="font-medium text-emerald-600">Free</span>
                </div>

                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Estimated Tax</span>
                  <span className="font-medium">$309.40</span>
                </div>

                <div className="flex gap-2 pt-2">
                  <Input placeholder="Promo code" className="text-sm" />
                  <Button variant="outline" className="shrink-0">
                    Apply
                  </Button>
                </div>

                <Separator />

                <div className="flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span>$5,069.40</span>
                </div>

                <Button className="w-full" size="lg" >
                  <Link href="/checkout">Proceed to Checkout</Link>
                </Button>

                <div className="text-xs text-muted-foreground space-y-1.5 pt-2">
                  <p className="flex items-center gap-1.5">
                    <span>🛡</span> Secure checkout, encrypted payment
                  </p>
                  <p className="flex items-center gap-1.5">
                    <span>📦</span> Free white-glove delivery on this order
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

        </div>
      </div>

      <Footer />
    </main>
  );
}