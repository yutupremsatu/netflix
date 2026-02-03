"use client";

import { Home, Search, Grid3X3, Heart } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
    { icon: Home, label: "Home", href: "/home" },
    { icon: Search, label: "Search", href: "/home/search" },
    { icon: Grid3X3, label: "Categories", href: "/home/movies" },
    { icon: Heart, label: "My List", href: "/home/user/list" },
];

export default function BottomNav() {
    const pathname = usePathname();

    return (
        <nav className="fixed bottom-0 left-0 right-0 bg-gradient-to-t from-black via-black/95 to-transparent pb-safe z-30 md:hidden">
            <div className="flex items-center justify-around py-2 px-4">
                {navItems.map((item) => {
                    const isActive = pathname === item.href ||
                        (item.href !== "/home" && pathname.startsWith(item.href));

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`flex flex-col items-center gap-1 px-4 py-2 rounded-lg transition-colors ${isActive
                                    ? "text-red-500"
                                    : "text-gray-400 hover:text-white"
                                }`}
                        >
                            <item.icon className={`w-6 h-6 ${isActive ? "scale-110" : ""} transition-transform`} />
                            <span className="text-xs font-medium">{item.label}</span>
                        </Link>
                    );
                })}
            </div>
        </nav>
    );
}
