import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function SuccessPage() {
  return (
    <div className=" py-10 flex w-full h-screen items-center justify-center flex-col gap-5">
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
