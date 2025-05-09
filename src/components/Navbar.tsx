"use client";
import React from "react";
import {
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/nextjs";
import { useRouter } from "next/navigation";

const Navbar = () => {

    const router = useRouter();

  return (
    <header className="flex justify-between items-center p-4 gap-4 h-16 bg-gray-950">
      <div className="flex items-center space-x-2">
        <span className="text-lg font-bold text-white cursor-pointer" onClick={()=>{
            router.push("/dashboard");
        }}>UptimeGuard</span>
      </div>
      <div className="flex gap-16 text-white">
        <SignedOut>
          <SignInButton />
          <SignUpButton />
        </SignedOut>
        <SignedIn>
          <UserButton />
        </SignedIn>
      </div>
    </header>
  );
};

export default Navbar;
