"use client";

import Image from "next/image";
import Link from "next/link";
import Logo from "../../public/netflix_logo.svg";
import { usePathname } from "next/navigation";
import { Bell } from "lucide-react";
import UserNav from "./UserNav";
import HamburgerMenu from "./HamburgerMenu";
import SearchBar from "./SearchBar";

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
  return (
    <div className="w-full max-w-7xl mx-auto items-center justify-between px-5 sm:px-6 py-5 lg:px-8 flex">
      <div className="flex items-center gap-x-4">
        {/* Hamburger Menu - visible on mobile */}
        <div className="lg:hidden">
          <HamburgerMenu />
        </div>

        <Link href="/home" className="w-28 lg:w-32">
          <Image src={Logo} alt="Netflix logo" priority />
        </Link>

        <ul className="lg:flex gap-x-4 ml-8 hidden">
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
                    className="text-gray-300 font-normal text-sm hover:text-white transition-colors"
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

      <div className="flex items-center gap-x-4">
        <SearchBar />
        <Bell className="h-5 w-5 text-gray-300 cursor-pointer hover:text-white transition-colors hidden sm:block" />
        <UserNav />
      </div>
    </div>
  );
}
