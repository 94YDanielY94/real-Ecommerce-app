import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function SuccessPage() {
  return (
    <div className="container py-10">
      <h1 className="text-3xl font-bold">Payment Successful</h1>
      <p>Thank you for your order.</p>
      <Button>
        <Link href="/" >
          Continue Shopping
        </Link>
      </Button>
    </div>
  );
}
