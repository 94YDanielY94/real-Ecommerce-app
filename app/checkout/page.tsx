import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import {
  RadioGroup,
  RadioGroupItem,
} from "@/components/ui/radio-group"
import { Separator } from "@/components/ui/separator"
import Image from "next/image"

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
  ]

  return (
    <main className="grid lg:grid-cols-2 gap-8 p-8">

      {/* LEFT SIDE */}
      <section>
        <h1 className="text-3xl font-bold mb-8">
          Checkout
        </h1>


        <Card>
          <CardContent className="space-y-8 pt-6">

            {/* Customer Details */}
            <div>
              <h2 className="font-semibold mb-4">
                Customer Details
              </h2>

              <div className="grid grid-cols-2 gap-4">

                <div>
                  <Label>First Name</Label>
                  <Input placeholder="Sarah" />
                </div>

                <div>
                  <Label>Last Name</Label>
                  <Input placeholder="Davis" />
                </div>

                <div>
                  <Label>Email</Label>
                  <Input placeholder="mail@example.com" />
                </div>

                <div>
                  <Label>Phone Number</Label>
                  <Input placeholder="00000 00000" />
                </div>

              </div>
            </div>


            {/* Shipping */}
            <div>
              <h2 className="font-semibold mb-4">
                Shipping Details
              </h2>

              <div className="space-y-4">

                <div>
                  <Label>Street Address</Label>
                  <Input placeholder="Address" />
                </div>


                <div className="grid grid-cols-3 gap-4">

                  <div>
                    <Label>Postal Code</Label>
                    <Input />
                  </div>

                  <div>
                    <Label>City</Label>
                    <Input />
                  </div>

                  <div>
                    <Label>Country</Label>
                    <Input />
                  </div>

                </div>

              </div>
            </div>



            {/* Payment */}
            <div>

              <h2 className="font-semibold mb-4">
                Payment Method
              </h2>


              <RadioGroup defaultValue="card">

                <div className="flex gap-6">

                  <div className="flex items-center gap-2">
                    <RadioGroupItem value="paypal" />
                    <Label>Paypal</Label>
                  </div>


                  <div className="flex items-center gap-2">
                    <RadioGroupItem value="card" />
                    <Label>Credit / Debit Card</Label>
                  </div>


                  <div className="flex items-center gap-2">
                    <RadioGroupItem value="cod" />
                    <Label>COD</Label>
                  </div>

                </div>

              </RadioGroup>


              <div className="grid grid-cols-3 gap-4 mt-5">

                <div className="col-span-1">
                  <Label>Card Number</Label>
                  <Input placeholder="XXXX XXXX XXXX 4568" />
                </div>


                <div>
                  <Label>Expiry Date</Label>
                  <Input placeholder="08/2027" />
                </div>


                <div>
                  <Label>CVV</Label>
                  <Input placeholder="000" />
                </div>

              </div>

            </div>


          </CardContent>
        </Card>

      </section>




      {/* RIGHT SIDE */}
      <section>

        <Card>

          <CardHeader>
            <CardTitle>
              Order Summary
            </CardTitle>
          </CardHeader>


          <CardContent className="space-y-6">


            {cartItems.map(item => (

              <div
                key={item.id}
                className="flex items-center justify-between"
              >

                <div className="flex gap-4">

                  <Image
                    src={item.image}
                    width={80}
                    height={80}
                    alt={item.name}
                  />


                  <div>
                    <p>{item.name}</p>
                    <p className="font-semibold">
                      ${item.price}
                    </p>


                    <div className="flex gap-2 mt-2">

                      <Button size="sm" variant="outline">
                        -
                      </Button>

                      <span>
                        {item.quantity}
                      </span>

                      <Button size="sm" variant="outline">
                        +
                      </Button>

                    </div>

                  </div>

                </div>


                <Button
                  variant="ghost"
                  size="sm"
                >
                  X
                </Button>

              </div>

            ))}



            <Separator />


            <div className="flex gap-2">

              <Input placeholder="Discount Code" />

              <Button>
                Apply
              </Button>

            </div>


            <Separator />


            <div className="space-y-3">

              <SummaryItem
                label="Subtotal"
                value="$90.68"
              />

              <SummaryItem
                label="Shipping Charge"
                value="$08.00"
              />

              <SummaryItem
                label="Taxes"
                value="$22.00"
              />

              <SummaryItem
                label="Discount"
                value="$12.00"
              />

              <Separator />

              <SummaryItem
                label="Total"
                value="$108.68"
                bold
              />

            </div>


            <Button className="w-full">
              Checkout
            </Button>


          </CardContent>

        </Card>


      </section>

    </main>
  )
}



function SummaryItem({
  label,
  value,
  bold
}: {
  label:string
  value:string
  bold?:boolean
}) {

  return (
    <div className={`flex justify-between ${bold ? "font-bold" : ""}`}>
      <span>{label}</span>
      <span>{value}</span>
    </div>
  )
}