import Link from "next/link";
import Image from "next/image";
import { Eye } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";

export default function SignUpPage() {
  return (
    <main className="min-h-screen bg-white">
      {/* Logo */}
      <header className="absolute left-10 top-8">
        <Link
          href="/"
          className="flex items-center gap-3 text-3xl font-bold tracking-tight"
        >
          <Image src="/logo.svg" alt="logo" width={20} height={20} />
          <span>real.</span>
        </Link>
      </header>

      {/* Form */}
      <section className="flex min-h-screen flex-col items-center justify-end px-6">
        <div className="flex flex-1 w-full max-w-md flex-col justify-center">
          <div className="space-y-2 text-center">
            <h1 className="text-4xl font-bold tracking-tight">
              Create your account
            </h1>

            <p className="text-muted-foreground">
              Create an account to save your orders, wishlist, and enjoy faster
              checkout.
            </p>
          </div>

          <div className="mt-10 space-y-6">
            <Button variant="outline" className="h-12 w-full rounded-full">
              <Image src="/google.svg" alt="Google" width={20} height={20} />
              Continue with Google
            </Button>

            <div className="flex items-center gap-4">
              <Separator className="flex-1" />
              <span className="text-sm text-muted-foreground">or</span>
              <Separator className="flex-1" />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Email</label>
              <Input type="email" className="rounded-full" />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Password</label>

              <div className="relative">
                <Input type="password" className="rounded-full" />

                <Eye className="absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">
                Confirm Password
              </label>

              <div className="relative">
                <Input type="password" className="rounded-full" />

                <Eye className="absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
              </div>
            </div>

            <Button className="h-12 w-full rounded-full">
              Create Account
            </Button>

            <p className="text-center text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link
                href="/login"
                className="font-medium text-foreground hover:underline"
              >
                Sign in
              </Link>
            </p>
          </div>

        </div>
          <p className="mb-2 text-center text-xs text-muted-foreground">
            By creating an account, you agree to our{" "}
            <Link href="/terms" className="underline">
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link href="/privacy" className="underline">
              Privacy Policy
            </Link>
            .
          </p>
      </section>
    </main>
  );
}