"use client";
import React, { useEffect, useState } from "react";
import {
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { Button } from "./ui/button";

const Navbar = () => {
  const router = useRouter();
  const [visible, setVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  // Handle scroll direction
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY > lastScrollY && currentScrollY > 50) {
        setVisible(false); // scrolling down
      } else {
        setVisible(true); // scrolling up
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  return (
    <header
      className={`fixed top-4 left-1/2 transform -translate-x-1/2 z-50 bg-black border border-neutral-800 rounded-full px-6 py-3 flex justify-between items-center w-[90vw] max-w-4xl transition-transform duration-300 ${
        visible ? "translate-y-0" : "-translate-y-24"
      }`}
    >
      {/* Logo */}
      <div
        className="text-lg font-semibold text-white cursor-pointer hover:opacity-90 transition-opacity"
        onClick={() => router.push("/dashboard")}
      >
        UptimeGuard
      </div>

      {/* Buttons */}
      <div className="flex gap-4 items-center">
        <SignedOut>
          <SignInButton>
            <Button
              variant="ghost"
              className="text-neutral-300 hover:text-white hover:border-b hover:border-neutral-700 rounded-none px-2 py-1 transition-all"
            >
              Sign In
            </Button>
          </SignInButton>
          <SignUpButton>
            <Button
              variant="ghost"
              className="text-neutral-300 hover:text-white hover:border-b hover:border-neutral-700 rounded-none px-2 py-1 transition-all"
            >
              Sign Up
            </Button>
          </SignUpButton>
        </SignedOut>
        <SignedIn>
          <UserButton afterSignOutUrl="/" />
        </SignedIn>
      </div>
    </header>
  );
};

export default Navbar;
