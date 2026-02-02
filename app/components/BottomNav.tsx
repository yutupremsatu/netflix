"use client";

import Link from "next/link";
import { Home, Search, List, Clock } from "lucide-react";
import { usePathname } from "next/navigation";

export default function BottomNav() {
    const pathName = usePathname();

    const navItems = [
        { icon: Home, label: "Home", href: "/home" },
        { icon: List, label: "My List", href: "/home/user/list" },
        { icon: Clock, label: "Recent", href: "/home/recently" },
        // Search is handled in Navbar, but maybe a quick toggle here too?
        // Let's stick to Home, List, Recent for now as the core actions.
    ];

    return (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 lg:hidden">
            <div className="bg-black/80 backdrop-blur-md border border-gray-800 rounded-full px-6 py-3 flex gap-x-8 shadow-2xl">
                {navItems.map((item, idx) => {
                    const Icon = item.icon;
                    const isActive = pathName === item.href;
                    return (
                        <Link key={idx} href={item.href} className="flex flex-col items-center gap-y-1 group">
                            <Icon
                                className={`h-6 w-6 transition-colors ${isActive ? "text-primary fill-primary" : "text-gray-400 group-hover:text-white"}`}
                            />
                            <span className={`text-[10px] ${isActive ? "text-primary font-bold" : "text-gray-500 overflow-hidden h-0 group-hover:h-auto"}`}>
                                {item.label}
                            </span>
                        </Link>
                    );
                })}
            </div>
        </div>
    );
}
