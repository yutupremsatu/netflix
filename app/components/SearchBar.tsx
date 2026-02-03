"use client";

import { Search, X } from "lucide-react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface SearchBarProps {
    onSearch?: (query: string) => void;
    placeholder?: string;
}

export default function SearchBar({
    onSearch,
    placeholder = "Search movies, shows...",
}: SearchBarProps) {
    const [query, setQuery] = useState("");
    const [isExpanded, setIsExpanded] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const debounce = setTimeout(() => {
            if (onSearch) {
                onSearch(query);
            }
        }, 300);

        return () => clearTimeout(debounce);
    }, [query, onSearch]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (query.trim()) {
            router.push(`/home/search?q=${encodeURIComponent(query.trim())}`);
        }
    };

    const handleClear = () => {
        setQuery("");
        if (onSearch) onSearch("");
    };

    return (
        <form onSubmit={handleSubmit} className="relative">
            <div
                className={`flex items-center bg-black/60 border border-gray-700 rounded-full transition-all duration-300 ${isExpanded ? "w-64 md:w-80" : "w-10"
                    }`}
            >
                <button
                    type="button"
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="p-2.5 text-gray-400 hover:text-white transition-colors"
                >
                    <Search className="w-5 h-5" />
                </button>

                {isExpanded && (
                    <>
                        <input
                            type="text"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder={placeholder}
                            className="flex-1 bg-transparent text-white text-sm placeholder-gray-500 outline-none pr-2"
                            autoFocus
                        />
                        {query && (
                            <button
                                type="button"
                                onClick={handleClear}
                                className="p-2 text-gray-400 hover:text-white transition-colors"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        )}
                    </>
                )}
            </div>
        </form>
    );
}
