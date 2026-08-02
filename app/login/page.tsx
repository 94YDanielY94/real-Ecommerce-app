"use client";
import Link from "next/link";
import { Eye } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import Image from "next/image";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";

export default function SignInPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin() {
    setError("");
    setLoading(true);

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (result?.error) {
      setError("Invalid email or password");
      setLoading(false);
      return;
    }

    router.push("/");
  }

  return (
    <main className="min-h-screen bg-white">
      {/* Logo */}
      <header className="absolute left-10 top-8">
        <Link
          href="/"
          className="sm:flex hidden items-center gap-3 text-3xl font-bold tracking-tight"
        >
          <Image src="/logo.svg" alt="logo" width={20} height={20} />
          <span>real.</span>
        </Link>
      </header>

      {/* Form */}
      <section className="flex min-h-screen items-center flex-col justify-center px-6">
        <div className="w-full max-w-md flex-1 flex flex-col justify-center">
          <div className="space-y-2 text-center">
            <h1 className="text-5xl font-bold tracking-tight">
              Welcome to real
            </h1>

            <p className="text-muted-foreground">
              Sign in to manage your orders, wishlist, and account.
            </p>
          </div>

          <div className="mt-10 space-y-6">
            <Button
              variant="outline"
              className="w-full h-12 rounded-full"
              onClick={() => signIn("google", { callbackUrl: "/" })}
            >
              <Image src="/google.svg" alt="logo" width={20} height={20} />
              Continue with Google
            </Button>

            <div className="flex items-center gap-4">
              <Separator className="flex-1" />
              <span className="text-sm text-muted-foreground">or</span>
              <Separator className="flex-1" />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Email</label>
              <Input
                type="email"
                className="rounded-full"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">Password</label>

                <Link
                  href="/forgot-password"
                  className="text-sm text-muted-foreground hover:underline"
                >
                  Forgot password?
                </Link>
              </div>

              <div className="relative">
                <Input
                  type="password"
                  className="rounded-full"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />

                <Eye className="absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
              </div>
            </div>
            {error && (
              <p className="text-sm text-red-500 text-center">{error}</p>
            )}
            <Button
              onClick={handleLogin}
              disabled={loading}
              className="h-12 w-full rounded-full"
            >
              {loading ? "Logging in..." : "Log in"}
            </Button>
            <p className="text-center text-sm text-muted-foreground">
              Don&apos;t have an account?{" "}
              <Link
                href="/signup"
                className="font-medium text-foreground hover:underline"
              >
                Create account
              </Link>
            </p>
          </div>
        </div>
        <p className="mb-2 text-center text-xs text-muted-foreground">
          By signing in, you agree to our{" "}
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
