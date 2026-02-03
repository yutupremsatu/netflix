"use client";

import { useState } from "react";
import { Menu, X, Home, Film, Tv, Heart, Search } from "lucide-react";
import Link from "next/link";

const menuItems = [
    { icon: Home, label: "Home", href: "/home" },
    { icon: Film, label: "Movies", href: "/home/movies" },
    { icon: Tv, label: "TV Shows", href: "/home/shows" },
    { icon: Heart, label: "My List", href: "/home/user/list" },
    { icon: Search, label: "Search", href: "/home/search" },
];

export default function HamburgerMenu() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            {/* Hamburger Button */}
            <button
                onClick={() => setIsOpen(true)}
                className="p-2 text-white hover:bg-white/10 rounded-lg transition-colors"
                aria-label="Open menu"
            >
                <Menu className="w-6 h-6" />
            </button>

            {/* Overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/60 z-40 transition-opacity"
                    onClick={() => setIsOpen(false)}
                />
            )}

            {/* Slide-out Drawer */}
            <div
                className={`fixed top-0 left-0 h-full w-72 bg-gradient-to-b from-gray-900 to-black z-50 transform transition-transform duration-300 ease-in-out ${isOpen ? "translate-x-0" : "-translate-x-full"
                    }`}
            >
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-gray-800">
                    <span className="text-red-600 font-bold text-2xl">NETEKFLIX</span>
                    <button
                        onClick={() => setIsOpen(false)}
                        className="p-2 text-gray-400 hover:text-white transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Menu Items */}
                <nav className="p-4">
                    <ul className="space-y-2">
                        {menuItems.map((item) => (
                            <li key={item.href}>
                                <Link
                                    href={item.href}
                                    onClick={() => setIsOpen(false)}
                                    className="flex items-center gap-4 px-4 py-3 text-gray-300 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                                >
                                    <item.icon className="w-5 h-5" />
                                    <span className="font-medium">{item.label}</span>
                                </Link>
                            </li>
                        ))}
                    </ul>
                </nav>

                {/* Footer */}
                <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-800">
                    <p className="text-gray-500 text-xs text-center">
                        © 2024 yutupremsatu
                    </p>
                </div>
            </div>
        </>
    );
}
