import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import Image from "next/image";
import { Stepper } from "@/components/ui/stepper";
import Navbar from "@/components/ui/Navbar";
import Footer from "@/components/ui/Footer";
import Link from "next/link";
export default function CheckoutPage() {
  const cartItems = [
    {
      id: 1,
      name: "Eau De Perfume for Men",
      price: 10.68,
      image: "/products/perfume.png",
      quantity: 1,
    },
    {
      id: 2,
      name: "NARS Makeup Kit",
      price: 80,
      image: "/products/makeup.png",
      quantity: 1,
    },
  ];

  return (
    <div className="min-h-screen flex flex-col justify-between space-y-8">
      <Navbar />

      <main className=" w-full px-4 sm:px-8 lg:px-12 grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        <section className="space-y-6">
          <h1 className="text-3xl font-bold">Checkout</h1>

          <Card>
            <CardContent className="space-y-8 pt-6 p-4 sm:p-6">
              {/* Customer Details */}
              <div className="space-y-4">
                <h2 className="font-semibold text-lg">Customer Details</h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="first-name">First Name</Label>
                    <Input id="first-name" placeholder="Sarah" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="last-name">Last Name</Label>
                    <Input id="last-name" placeholder="Davis" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="mail@example.com"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input id="phone" type="tel" placeholder="00000 00000" />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h2 className="font-semibold text-lg">Shipping Details</h2>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="address1">Address Line 1</Label>
                    <Input
                      id="address1"
                      placeholder="Street address or P.O. Box"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="address2">Address Line 2</Label>
                    <Input
                      id="address2"
                      placeholder="Apt, suite, unit, building, floor, etc. (optional)"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="city">City</Label>
                      <Input id="city" placeholder="City" />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="state">State</Label>
                      <Input id="state" placeholder="State / Province" />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="postal">Postal Code</Label>
                      <Input id="postal" placeholder="Zip code" />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="country">Country</Label>
                      <Input id="country" placeholder="Country" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h2 className="font-semibold text-lg">Payment Method</h2>

                <RadioGroup defaultValue="card">
                  <div className="flex flex-wrap gap-4 sm:gap-6">
                    <div className="flex items-center gap-2">
                      <RadioGroupItem value="paypal" id="paypal" />
                      <Label htmlFor="paypal" className="cursor-pointer">
                        Paypal
                      </Label>
                    </div>

                    <div className="flex items-center gap-2">
                      <RadioGroupItem value="card" id="card" />
                      <Label htmlFor="card" className="cursor-pointer">
                        Credit / Debit Card
                      </Label>
                    </div>

                    <div className="flex items-center gap-2">
                      <RadioGroupItem value="cod" id="cod" />
                      <Label htmlFor="cod" className="cursor-pointer">
                        COD
                      </Label>
                    </div>
                  </div>
                </RadioGroup>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                  <div className="sm:col-span-1 space-y-2">
                    <Label htmlFor="card-number">Card Number</Label>
                    <Input id="card-number" placeholder="XXXX XXXX XXXX 4568" />
                  </div>

                  <div className="sm:col-span-1 space-y-2">
                    <Label htmlFor="expiry">Expiry Date</Label>
                    <Input id="expiry" placeholder="08/2027" />
                  </div>

                  <div className="sm:col-span-1 space-y-2">
                    <Label htmlFor="cvv">CVV</Label>
                    <Input id="cvv" placeholder="000" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        <section className="lg:sticky lg:top-24">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Order Summary</CardTitle>
            </CardHeader>

            <CardContent className="space-y-6 p-4 sm:p-6 pt-0 sm:pt-0">
              <div className="space-y-4">
                {cartItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex gap-4 items-start pb-4 border-b last:border-b-0 last:pb-0"
                  >
                    <div className="relative w-20 h-20 shrink-0 overflow-hidden rounded-lg bg-neutral-100">
                      <Image
                        src="/wal16.png"
                        fill
                        alt={item.name}
                        className="object-cover"
                      />
                    </div>

                    <div className="flex-1 flex flex-col justify-between gap-2 min-w-0">
                      <div className="flex justify-between items-start gap-2">
                        <p className="font-medium text-sm sm:text-base truncate">
                          {item.name}
                        </p>
                        <p className="font-semibold text-sm sm:text-base shrink-0">
                          ${item.price}
                        </p>
                      </div>

                      <div className="flex flex-wrap items-center gap-2 pt-1">
                        <Stepper />
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 px-2 text-xs"
                        >
                          Remove
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <Separator />

              <div className="space-y-3 text-sm">
                <SummaryItem label="Subtotal" value="$90.68" />
                <SummaryItem label="Shipping Charge" value="$08.00" />
                <SummaryItem label="Taxes" value="$22.00" />
                <SummaryItem label="Discount" value="$12.00" />

                <Separator />

                <SummaryItem label="Total" value="$108.68" bold />
              </div>
              <Link href="/orders">
                <Button className="w-full" size="lg">
                  Complete Order
                </Button>
              </Link>
            </CardContent>
          </Card>
        </section>
      </main>

      <Footer />
    </div>
  );
}

function SummaryItem({
  label,
  value,
  bold,
}: {
  label: string;
  value: string;
  bold?: boolean;
}) {
  return (
    <div
      className={`flex justify-between items-center ${bold ? "font-bold text-base sm:text-lg" : "text-muted-foreground"}`}
    >
      <span>{label}</span>
      <span className={bold ? "text-foreground" : ""}>{value}</span>
    </div>
  );
}
