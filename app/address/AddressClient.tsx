"use client";

import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/components/ui/toast";
import {
  Loader2,
  MapPin,
  Plus,
  Trash2,
  CheckCircle2,
  User,
} from "lucide-react";
import type { Cart, Address, UserProfile } from "./page";

interface AddressClientProps {
  cart: Cart;
  addresses: Address[];
  userId: string;
  user: UserProfile;
}

type NewAddress = {
  address_line1: string;
  address_line2: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
  is_default: boolean;
};

const emptyForm: NewAddress = {
  address_line1: "",
  address_line2: "",
  city: "",
  state: "",
  postal_code: "",
  country: "",
  is_default: false,
};

const createAddress = async (data: NewAddress) => {
  const res = await fetch("/api/addresses", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  const result = await res.json();
  if (!res.ok) {
    throw new Error(result.error || "Failed to save address");
  }
  return result;
};

const deleteAddress = async (id: string) => {
  const res = await fetch(`/api/addresses/${id}`, { method: "DELETE" });
  const result = await res.json();
  if (!res.ok) {
    throw new Error(result.error || "Failed to delete address");
  }
  return result;
};

const updateUser = async (data: {
  first_name: string;
  last_name: string;
  phone: string;
}) => {
  const res = await fetch("/api/user", {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  const result = await res.json();
  if (!res.ok) {
    throw new Error(result.error || "Failed to update contact info");
  }
  return result;
};

export default function AddressClient({
  cart,
  addresses: initialAddresses,
  userId,
  user,
}: AddressClientProps) {
  const [addresses, setAddresses] = useState<Address[]>(initialAddresses);
  const [selectedId, setSelectedId] = useState<string>(
    initialAddresses.find((a) => a.is_default)?.id ??
      initialAddresses[0]?.id ??
      "",
  );
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<NewAddress>(emptyForm);

  // Contact info state (prefilled from the user profile)
  const [contact, setContact] = useState({
    first_name: user.first_name ?? "",
    last_name: user.last_name ?? "",
    phone: user.phone ?? "",
  });

  const items = cart.cart_items ?? [];
  const subtotal = items.reduce(
    (sum, item) => sum + Number(item.products.price) * item.quantity,
    0,
  );
  const estimatedTax = subtotal * 0.065;
  const total = subtotal + estimatedTax;

  const addMutation = useMutation({
    mutationFn: createAddress,
    onSuccess: (address: Address) => {
      setAddresses((prev) => {
        const withoutNew = prev.map((a) => ({
          ...a,
          is_default: address.is_default ? false : a.is_default,
        }));
        return [...withoutNew, address];
      });
      setSelectedId(address.id);
      setForm(emptyForm);
      setShowForm(false);
      toast.add({
        type: "success",
        title: "Address saved",
        description: "Your address has been added successfully.",
      });
    },
    onError: (error: Error) => {
      toast.add({
        type: "error",
        title: "Error",
        description: error.message,
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteAddress,
    onSuccess: (_, id: string) => {
      setAddresses((prev) => {
        const remaining = prev.filter((a) => a.id !== id);
        if (selectedId === id) {
          setSelectedId(
            remaining.find((a) => a.is_default)?.id ?? remaining[0]?.id ?? "",
          );
        }
        return remaining;
      });
      toast.add({
        type: "success",
        title: "Address deleted",
        description: "The address was removed.",
      });
    },
    onError: (error: Error) => {
      toast.add({
        type: "error",
        title: "Error",
        description: error.message,
      });
    },
  });

  const userMutation = useMutation({
    mutationFn: updateUser,
    onError: (error: Error) => {
      toast.add({
        type: "error",
        title: "Error",
        description: error.message,
      });
    },
  });

  const checkoutMutation = useMutation({
    mutationFn: async () => {
      // Persist contact info before redirecting to Stripe
      await userMutation.mutateAsync({
        first_name: contact.first_name,
        last_name: contact.last_name,
        phone: contact.phone,
      });

      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cartId: cart.id,
          userId,
          addressId: selectedId,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to start checkout");
      return data as { url: string };
    },
    onSuccess: (data) => {
      window.location.href = data.url;
    },
    onError: (error: Error) => {
      toast.add({
        type: "error",
        title: "Checkout error",
        description: error.message,
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addMutation.mutate(form);
  };

  const updateField = (field: keyof NewAddress, value: string | boolean) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const updateContact = (field: keyof typeof contact, value: string) => {
    setContact((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <main className="min-h-screen">
      <div className="max-w-7xl mx-auto w-full space-y-8 px-4 sm:px-8 lg:px-12">
        <div>
          <h1 className="text-3xl sm:text-4xl font-bold">Shipping Address</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Enter your contact details and select a saved address or add a new
            one before proceeding to payment.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left: contact + addresses + form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Contact Information */}
            <Card className="shadow-none border border-neutral-300">
              <CardHeader>
                <CardTitle className="text-xl flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Contact Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="first_name">First Name</Label>
                    <Input
                      id="first_name"
                      placeholder="First name"
                      value={contact.first_name}
                      onChange={(e) =>
                        updateContact("first_name", e.target.value)
                      }
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="last_name">Last Name</Label>
                    <Input
                      id="last_name"
                      placeholder="Last name"
                      value={contact.last_name}
                      onChange={(e) =>
                        updateContact("last_name", e.target.value)
                      }
                      required
                    />
                  </div>

                  <div className="space-y-2 sm:col-span-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="00000 00000"
                      value={contact.phone}
                      onChange={(e) => updateContact("phone", e.target.value)}
                    />
                  </div>
                </div>
                <p className="text-xs text-muted-foreground mt-3">
                  This information is saved to your account for faster checkout.
                </p>
              </CardContent>
            </Card>

            {/* Saved addresses */}
            <Card className="shadow-none border border-neutral-300">
              <CardHeader>
                <CardTitle className="text-xl">Saved Addresses</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {addresses.length === 0 ? (
                  <p className="text-sm text-muted-foreground py-4">
                    You don&apos;t have any saved addresses yet. Add one below.
                  </p>
                ) : (
                  addresses.map((address) => (
                    <div
                      key={address.id}
                      onClick={() => setSelectedId(address.id)}
                      className={`flex items-start gap-3 rounded-2xl border p-4 cursor-pointer transition-colors ${
                        selectedId === address.id
                          ? "border-primary bg-primary/5"
                          : "border-neutral-300 hover:border-neutral-400"
                      }`}
                    >
                      <span
                        className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 ${
                          selectedId === address.id
                            ? "border-primary bg-primary text-primary-foreground"
                            : "border-neutral-400"
                        }`}
                      >
                        {selectedId === address.id && (
                          <CheckCircle2 className="h-3.5 w-3.5" />
                        )}
                      </span>

                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <p className="font-medium text-sm sm:text-base">
                            {address.address_line1}
                          </p>
                          {address.is_default && (
                            <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                              Default
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground mt-0.5">
                          {[address.address_line2, address.city, address.state]
                            .filter(Boolean)
                            .join(", ")}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {[address.postal_code, address.country]
                            .filter(Boolean)
                            .join(", ")}
                        </p>
                      </div>

                      <Button
                        type="button"
                        variant="ghost"
                        size="icon-sm"
                        className="text-red-600 hover:bg-red-50 hover:text-red-700 shrink-0"
                        disabled={deleteMutation.isPending}
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteMutation.mutate(address.id);
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))
                )}

                {!showForm && (
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => setShowForm(true)}
                  >
                    <Plus className="h-4 w-4" />
                    Add New Address
                  </Button>
                )}
              </CardContent>
            </Card>

            {/* Add address form */}
            {showForm && (
              <Card className="shadow-none border border-neutral-300">
                <CardHeader>
                  <CardTitle className="text-xl">Add New Address</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="space-y-2">
                      <Label htmlFor="address_line1">Address Line 1</Label>
                      <Input
                        id="address_line1"
                        placeholder="Street address or P.O. Box"
                        value={form.address_line1}
                        onChange={(e) =>
                          updateField("address_line1", e.target.value)
                        }
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="address_line2">
                        Address Line 2{" "}
                        <span className="text-muted-foreground font-normal">
                          (optional)
                        </span>
                      </Label>
                      <Input
                        id="address_line2"
                        placeholder="Apt, suite, unit, building, floor, etc."
                        value={form.address_line2}
                        onChange={(e) =>
                          updateField("address_line2", e.target.value)
                        }
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="city">City</Label>
                        <Input
                          id="city"
                          placeholder="City"
                          value={form.city}
                          onChange={(e) => updateField("city", e.target.value)}
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="state">
                          State{" "}
                          <span className="text-muted-foreground font-normal">
                            (optional)
                          </span>
                        </Label>
                        <Input
                          id="state"
                          placeholder="State / Province"
                          value={form.state}
                          onChange={(e) => updateField("state", e.target.value)}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="postal_code">
                          Postal Code{" "}
                          <span className="text-muted-foreground font-normal">
                            (optional)
                          </span>
                        </Label>
                        <Input
                          id="postal_code"
                          placeholder="Zip code"
                          value={form.postal_code}
                          onChange={(e) =>
                            updateField("postal_code", e.target.value)
                          }
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="country">Country</Label>
                        <Input
                          id="country"
                          placeholder="Country"
                          value={form.country}
                          onChange={(e) =>
                            updateField("country", e.target.value)
                          }
                          required
                        />
                      </div>
                    </div>

                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={form.is_default}
                        onChange={(e) =>
                          updateField("is_default", e.target.checked)
                        }
                        className="h-4 w-4 rounded border-neutral-400"
                      />
                      <span className="text-sm">Set as my default address</span>
                    </label>

                    <div className="flex gap-3">
                      <Button
                        type="submit"
                        disabled={addMutation.isPending}
                        className="flex-1 sm:flex-none"
                      >
                        {addMutation.isPending ? (
                          <>
                            <Loader2 className="h-4 w-4 animate-spin" />
                            Saving...
                          </>
                        ) : (
                          "Save Address"
                        )}
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        onClick={() => setShowForm(false)}
                        disabled={addMutation.isPending}
                      >
                        Cancel
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Right: order summary */}
          <div className="lg:col-span-1">
            <Card className="h-fit sticky top-24 shadow-none border border-neutral-300">
              <CardHeader>
                <CardTitle className="text-xl">Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  {items.map((item) => (
                    <div
                      key={item.id}
                      className="flex gap-3 items-start border-b pb-3 last:border-b-0 last:pb-0"
                    >
                      <div className="relative w-14 h-14 shrink-0 overflow-hidden rounded-lg bg-neutral-100">
                        <Image
                          src={
                            item.products.product_images[0]?.image_url ??
                            "/placeholder.svg"
                          }
                          alt={item.products.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm truncate">
                          {item.products.name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Qty: {item.quantity}
                        </p>
                      </div>
                      <p className="font-medium text-sm shrink-0">
                        ${Number(item.products.price).toLocaleString()}
                      </p>
                    </div>
                  ))}
                </div>

                <Separator />

                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="font-medium">
                    ${subtotal.toLocaleString()}
                  </span>
                </div>

                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Shipping</span>
                  <span className="font-medium text-emerald-600">Free</span>
                </div>

                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Estimated Tax</span>
                  <span className="font-medium">
                    ${estimatedTax.toFixed(2)}
                  </span>
                </div>

                <Separator />

                <div className="flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>

                <Button
                  className="w-full"
                  size="lg"
                  disabled={checkoutMutation.isPending || selectedId === ""}
                  onClick={() => checkoutMutation.mutate()}
                >
                  {checkoutMutation.isPending ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Redirecting to Stripe...
                    </>
                  ) : selectedId === "" ? (
                    "Select an Address"
                  ) : (
                    "Continue to Payment"
                  )}
                </Button>

                <div className="text-xs text-muted-foreground space-y-1.5 pt-2">
                  <p className="flex items-center gap-1.5">
                    <MapPin className="h-3.5 w-3.5" />
                    Free white-glove delivery on this order
                  </p>
                  <p className="flex items-center gap-1.5">
                    <span>🛡</span> Secure checkout, encrypted payment
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="pb-4">
          <Button variant="link" className="px-0 text-sm">
            <Link href="/cart">← Back to Cart</Link>
          </Button>
        </div>
      </div>
    </main>
  );
}
