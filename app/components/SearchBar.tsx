"use client";

import { Search, X } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";

interface SearchBarProps {
    onSearch?: (query: string) => void;
    placeholder?: string;
}

export default function SearchBar({
    onSearch,
    placeholder = "Search titles...",
}: SearchBarProps) {
    const [query, setQuery] = useState("");
    const [isExpanded, setIsExpanded] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);
    const router = useRouter();

    useEffect(() => {
        if (isExpanded && inputRef.current) {
            inputRef.current.focus();
        }
    }, [isExpanded]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (query.trim()) {
            router.push(`/home/search?q=${encodeURIComponent(query.trim())}`);
            setIsExpanded(false); // Optional: collapse after search?
        }
    };

    const handleClear = () => {
        setQuery("");
        if (onSearch) onSearch("");
        setIsExpanded(false);
    };

    return (
        <form onSubmit={handleSubmit} className="relative z-50">
            <div
                className={`flex items-center transition-all duration-300 ease-in-out border border-white/30 rounded-full ${isExpanded
                        ? "w-64 sm:w-80 px-4 bg-black/90 py-1"
                        : "w-10 h-10 justify-center cursor-pointer bg-black/40 hover:bg-white/10 hover:border-white/80"
                    }`}
            >
                {/* Search Icon / Toggle Button */}
                <button
                    type="button"
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="text-white flex items-center justify-center min-w-[24px]"
                >
                    <Search className="w-5 h-5" />
                </button>

                {/* Input Field (Hidden until expanded) */}
                <input
                    ref={inputRef}
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder={placeholder}
                    className={`bg-transparent text-white text-sm placeholder-gray-400 outline-none ml-2 w-full transition-opacity duration-200 ${isExpanded ? "opacity-100 block" : "opacity-0 hidden w-0"
                        }`}
                />

                {/* Clear / Close Button */}
                {isExpanded && (
                    <button
                        type="button"
                        onClick={handleClear}
                        className="text-gray-400 hover:text-white ml-1"
                    >
                        <X className="w-4 h-4" />
                    </button>
                )}
            </div>
        </form>
    );
}
