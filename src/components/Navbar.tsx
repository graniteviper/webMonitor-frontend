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
  // const [lastScrollY, setLastScrollY] = useState(0);

  // useEffect(() => {
  //   const handleScroll = () => {
  //     const currentScrollY = window.scrollY;

  //     if (currentScrollY > lastScrollY && currentScrollY > 50) {
  //       setVisible(false); // scrolling down
  //     } else {
  //       setVisible(true); // scrolling up
  //     }

  //     setLastScrollY(currentScrollY);
  //   };

  //   window.addEventListener("scroll", handleScroll);
  //   return () => window.removeEventListener("scroll", handleScroll);
  // }, [lastScrollY]);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 px-6 py-3 flex justify-between items-center w-full transition-transform duration-300 backdrop-blur-xl bg-white/0 ${
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

      {/* Auth Buttons */}
      <div className="flex gap-4 items-center">
        <SignedOut>
          <SignInButton>
            <Button variant="ghost" className="text-white">
              Sign In
            </Button>
          </SignInButton>
          <SignUpButton>
            <Button variant="ghost" className="text-white">
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
