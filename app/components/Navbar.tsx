"use client";

import Image from "next/image";
import Link from "next/link";
import Logo from "../../public/netflix_logo.svg";
import { usePathname } from "next/navigation";
import { Bell, Search, Menu, X } from "lucide-react";
import UserNav from "./UserNav";
import { useState } from "react";
import { useRouter } from "next/navigation";

interface linkProps {
  name: string;
  href: string;
}

const links: linkProps[] = [
  { name: "Home", href: "/home" },
  { name: "Tv Shows", href: "/home/shows" },
  { name: "Movies", href: "/home/movies" },
  { name: "Recently Added", href: "/home/recently" },
  { name: "My List", href: "/home/user/list" },
];

export default function Navbar() {
  const pathName = usePathname();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/home/search?q=${searchQuery}`);
      setIsSearchOpen(false);
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto items-center justify-between px-5 sm:px-6 py-5 lg:px-8 flex relative z-50">
      <div className="flex items-center">
        {/* Mobile Hamburger Menu */}
        <div className="lg:hidden mr-4">
          <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
            {isMobileMenuOpen ? <X className="h-6 w-6 text-white" /> : <Menu className="h-6 w-6 text-white" />}
          </button>
        </div>

        <Link href="/home" className="w-32">
          <Image src={Logo} alt="Netflix logo" priority />
        </Link>
        <ul className="lg:flex gap-x-4 ml-14 hidden">
          {links.map((link, idx) => (
            <div key={idx}>
              {pathName === link.href ? (
                <li>
                  <Link
                    href={link.href}
                    className="text-white font-semibold underline text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ) : (
                <li>
                  <Link
                    className="text-gray-300 font-normal text-sm hover:text-white transition"
                    href={link.href}
                  >
                    {link.name}
                  </Link>
                </li>
              )}
            </div>
          ))}
        </ul>
      </div>

      <div className="flex items-center gap-x-4 sm:gap-x-8">
        {/* Search Bar */}
        <div className={`relative flex items-center transition-all duration-300 ${isSearchOpen ? "w-40 sm:w-64" : "w-8"}`}>
          {isSearchOpen ? (
            <form onSubmit={handleSearch} className="w-full flex items-center bg-black/50 border border-gray-500 rounded-md px-2">
              <input
                autoFocus
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Titles, people, genres"
                className="bg-transparent text-white text-xs sm:text-sm py-1 outline-none w-full"
                onBlur={() => !searchQuery && setIsSearchOpen(false)}
              />
              <button type="submit"><Search className="w-4 h-4 text-gray-300" /></button>
            </form>
          ) : (
            <Search
              className="w-5 h-5 text-gray-300 cursor-pointer hover:text-white"
              onClick={() => setIsSearchOpen(true)}
            />
          )}
        </div>

        <Bell className="h-5 w-5 text-gray-300 cursor-pointer hidden sm:block" />
        <UserNav />
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="absolute top-20 left-0 w-full bg-black/95 border-b border-gray-800 z-50 lg:hidden py-4 px-5">
          <ul className="flex flex-col gap-y-4">
            {links.map((link, idx) => (
              <li key={idx}>
                <Link
                  href={link.href}
                  className={`block py-2 text-lg ${pathName === link.href ? "text-white font-bold" : "text-gray-400"}`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
