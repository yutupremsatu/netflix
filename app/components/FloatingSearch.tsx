
"use client";

import { Search, X } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function FloatingSearch() {
    const [isOpen, setIsOpen] = useState(false);
    const [query, setQuery] = useState("");
    const inputRef = useRef<HTMLInputElement>(null);
    const router = useRouter();

    useEffect(() => {
        if (isOpen && inputRef.current) {
            inputRef.current.focus();
        }
    }, [isOpen]);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (query.trim()) {
            router.push(`/home/search?q=${encodeURIComponent(query)}`);
            setIsOpen(false);
        }
    };

    return (
        <>
            {/* Floating Button (Top Right, slightly below Navbar to avoid conflict) */}
            <div className="fixed top-24 right-4 z-50 flex flex-col items-end gap-2">
                {!isOpen && (
                    <button
                        onClick={() => setIsOpen(true)}
                        className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center shadow-lg hover:bg-red-700 transition transform hover:scale-110 border-2 border-white/20"
                        title="Search Movies"
                    >
                        <Search className="text-white w-6 h-6" />
                    </button>
                )}

                {/* Expandable Search Area */}
                {isOpen && (
                    <div className="bg-black/90 p-2 rounded-lg border border-red-500 shadow-2xl flex items-center animate-in fade-in slide-in-from-right-10 duration-200">
                        <form onSubmit={handleSearch} className="flex items-center gap-2">
                            <input
                                ref={inputRef}
                                type="text"
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                placeholder="Search..."
                                className="bg-transparent text-white border-b border-gray-500 focus:border-red-500 outline-none px-2 py-1 w-48"
                            />
                            <button type="submit" className="text-red-500 hover:text-white">
                                <Search className="w-5 h-5" />
                            </button>
                            <button
                                type="button"
                                onClick={() => setIsOpen(false)}
                                className="text-gray-400 hover:text-white"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </form>
                    </div>
                )}
            </div>
        </>
    );
}
