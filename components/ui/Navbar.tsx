"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Search, ShoppingCart, Menu, X } from "lucide-react";

import { InputButtonGroup } from "./search";
import { Button } from "./button";

import { useSession, signOut } from "next-auth/react";
import { UserCircle } from "lucide-react";

const Navbar = () => {
  const [mobileMenu, setMobileMenu] = useState(false);
  const [mobileSearch, setMobileSearch] = useState(false);
  const { data: session } = useSession();
  return (
    <header className="sticky top-0 z-50 w-full bg-white">
      <div className="mx-auto flex items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-18">
        {/* Logo */}
        <Logo />

        {/* Desktop Search */}
        <div className="hidden flex-1 md:block max-w-lg">
          <InputButtonGroup />
        </div>

        {/* Actions */}
        <nav className="flex items-center gap-2">
          {/* Mobile Search */}
          <IconButton onClick={() => setMobileSearch(!mobileSearch)}>
            <Search size={20} />
          </IconButton>

          <div className="hidden items-center gap-2 sm:flex">
            {session ? (
              <div className="flex items-center gap-3">
                <Link href="/orders">
                  <Button variant={"outline"} className="cursor-pointer">
                    orders
                  </Button>
                </Link>{" "}
                <Button
                  variant="outline"
                  className={"cursor-pointer"}
                  onClick={() => signOut()}
                >
                  Logout
                </Button>
                <Link
                  href="/profile"
                  className="
                    flex items-center gap-2
                    rounded-full
                    px-3 py-2
                    hover:bg-neutral-100
                  "
                >
                  <UserCircle size={24} />
                </Link>
              </div>
            ) : (
              <>
                <Link
                  href="/login"
                  className="
            rounded-full
            px-4 py-2
            text-sm font-medium
            hover:bg-neutral-100
          "
                >
                  Login
                </Link>

                <Button>
                  <Link href="/signup">Signup</Link>
                </Button>
              </>
            )}
            <Link
              href="/cart"
              className="rounded-full p-2.5 hover:bg-neutral-100"
            >
              <ShoppingCart size={22} />
            </Link>
          </div>

          {/* Mobile Menu */}
          <IconButton onClick={() => setMobileMenu(!mobileMenu)}>
            {mobileMenu ? <X size={22} /> : <Menu size={22} />}
          </IconButton>
        </nav>
      </div>

      {/* Mobile Search */}
      {mobileSearch && (
        <div className="border-t px-4 py-3 md:hidden">
          <InputButtonGroup />
        </div>
      )}

      {/* Mobile Menu */}
      {mobileMenu && (
        <div
          className="
            border-t bg-white 
            px-4 py-6 
            shadow-lg 
            md:hidden
          "
        >
          <div className="flex flex-col gap-3">
            <Link
              href="/login"
              onClick={() => setMobileMenu(false)}
              className="
                  rounded-lg py-3
                  text-center
                  hover:bg-neutral-100
                "
            >
              Login
            </Link>

            <Button className="w-full">
              <Link href="/signup" onClick={() => setMobileMenu(false)}>
                Signup
              </Link>
            </Button>
          </div>
        </div>
      )}
    </header>
  );
};

function Logo() {
  return (
    <Link href="/" className="shrink-0">
      <div className="flex items-center gap-2">
        <Image src="/logo.svg" alt="logo" width={24} height={24} priority />

        <span
          className="
          text-2xl 
          font-bold 
          tracking-tight
        "
        >
          real.
        </span>
      </div>
    </Link>
  );
}

function IconButton({
  children,
  onClick,
}: {
  children: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="
        rounded-full
        p-2.5
        hover:bg-neutral-100
        transition
        md:hidden
      "
    >
      {children}
    </button>
  );
}

export default Navbar;
