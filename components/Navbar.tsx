import { SignedOut, SignInButton, SignedIn, UserButton } from "@clerk/nextjs";
import Link from "next/link";
import React from "react";
import { Button } from "@/components/ui/button";
import { MapPin } from "lucide-react";

const Navbar = () => {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between max-w-7xl mx-auto px-4">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2 text-2xl font-bold">
            <MapPin className="h-6 w-6" />
            <span>My Trip</span>
          </Link>
          <nav className="hidden md:flex items-center gap-6">
            <Link
              href="/"
              className="text-sm font-medium transition-colors hover:text-primary"
            >
              홈
            </Link>
            <Link
              href="/stats"
              className="text-sm font-medium transition-colors hover:text-primary"
            >
              통계
            </Link>
            <SignedIn>
              <Link
                href="/bookmarks"
                className="text-sm font-medium transition-colors hover:text-primary"
              >
                북마크
              </Link>
            </SignedIn>
          </nav>
        </div>
        <div className="flex gap-4 items-center">
          <SignedOut>
            <SignInButton mode="modal">
              <Button variant="default" size="sm">
                로그인
              </Button>
            </SignInButton>
          </SignedOut>
          <SignedIn>
            <UserButton />
          </SignedIn>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
