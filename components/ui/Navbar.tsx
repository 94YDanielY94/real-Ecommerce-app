"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { InputButtonGroup } from "./search";
import { Button } from "./button";

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  return (
    <header className="w-full bg-white sticky top-0 z-50">
      <div className=" mx-auto px-4 sm:px-6 lg:px-18 py-4 flex justify-between items-center gap-4">
        
        {/* Brand Logo */}
        <Link href="/" className="shrink-0">
          <div className="flex items-center gap-2 ">
            <Image src="/logo.svg" alt="logo" width={24} height={24} priority />
            <span className="text-2xl sm:text-3xl font-bold tracking-tight">
              real.
            </span>
          </div>
        </Link>

        {/* Desktop Search */}
        <div className="hidden md:block flex-1 max-w-lg mx-6">
          <InputButtonGroup />
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-1 sm:gap-3">
          
          {/* Mobile Search Toggle Button */}
          <button
            onClick={() => setIsSearchOpen(!isSearchOpen)}
            className="md:hidden p-2 rounded-full hover:bg-neutral-100 transition-colors"
            aria-label="Toggle Search"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.3-4.3" />
            </svg>
          </button>

          {/* Cart / Products Link */}
          <Link
            href="/cart"
            className="p-2.5 rounded-full hover:bg-neutral-100 transition-colors"
            aria-label="Cart"
          >
            <svg
              width="22"
              height="22"
              viewBox="0 0 0.72 0.72"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M0.15 0.21h0.414a0.06 0.06 0 0 1 0.06 0.066l-0.018 0.18A0.06 0.06 0 0 1 0.546 0.51H0.259a0.06 0.06 0 0 1 -0.059 -0.048z"
                stroke="#000"
                strokeWidth="0.06"
                strokeLinejoin="round"
              />
              <path
                d="m0.15 0.21 -0.024 -0.097A0.03 0.03 0 0 0 0.097 0.09H0.06"
                stroke="#000"
                strokeWidth="0.06"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M0.24 0.63h0.06M0.48 0.63h0.06"
                stroke="#000"
                strokeWidth="0.06"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </Link>

          {/* Desktop Auth Links */}
          <Link
            href="/login"
            className="hidden sm:inline-block px-4 py-2 text-sm font-medium rounded-full hover:bg-neutral-100 transition-colors"
          >
            Login
          </Link>

          <Button  className="hidden sm:inline-flex">
            <Link href="/signup">Signup</Link>
          </Button>

          {/* Mobile Menu Hamburger Toggle Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-neutral-100 transition-colors text-xl leading-none"
            aria-label="Toggle Menu"
          >
            {isMobileMenuOpen ? "✕" : "☰"}
          </button>
        </div>
      </div>

      {/* Mobile Search Bar Dropdown */}
      {isSearchOpen && (
        <div className="md:hidden px-4 pb-4 pt-1 border-t border-neutral-100">
          <InputButtonGroup />
        </div>
      )}

      {/* Mobile Slide-down Navigation Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-neutral-100 bg-white px-4 py-6 space-y-4 shadow-lg">
          <div className="flex flex-col gap-3">
            <Link
              href="/login"
              className="w-full text-center px-4 py-2.5 text-sm font-medium rounded-lg hover:bg-neutral-100 transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Login
            </Link>
            <Button  className="w-full">
              <Link href="/signup" onClick={() => setIsMobileMenuOpen(false)}>
                Signup
              </Link>
            </Button>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;