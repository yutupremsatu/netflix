"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState, Suspense } from "react";
import Image from "next/image";
import { MovieCard as Card } from "@/app/components/MovieCard";

function SearchContent() {
    const searchParams = useSearchParams();
    const query = searchParams.get("q") || "";
    const [results, setResults] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (query) {
            setLoading(true);
            fetch(`/api/search?q=${query}`)
                .then((res) => res.json())
                .then((data) => {
                    setResults(data);
                    setLoading(false);
                })
                .catch(() => setLoading(false));
        }
    }, [query]);

    return (
        <div className="max-w-7xl mx-auto px-5 lg:px-8 mt-10 pb-24">
            <div className="mb-10">
                <form onSubmit={(e) => {
                    e.preventDefault();
                    // Let the form submission update the URL via navigation or state if needed, 
                    // but query is monitored by useEffect.
                    // Actually, simpler to just push to router.
                }} className="relative max-w-2xl mx-auto">
                    <input
                        type="text"
                        defaultValue={query}
                        onChange={(e) => {
                            // Optional: Debounce or just wait for Enter
                        }}
                        placeholder="Search for movies, TV shows..."
                        className="w-full bg-gray-900 border border-gray-700 text-white px-5 py-4 rounded-full text-lg focus:outline-none focus:border-red-600 transition shadow-lg"
                        onKeyDown={(e) => {
                            if (e.key === "Enter") {
                                const val = (e.target as HTMLInputElement).value;
                                if (val.trim()) {
                                    window.location.href = `/home/search?q=${encodeURIComponent(val)}`;
                                }
                            }
                        }}
                    />
                    <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </div>
                </form>
            </div>

            <h1 className="text-white text-3xl font-bold mb-8">
                {query ? (
                    <>Search Results for: <span className="text-red-500 italic">&quot;{query}&quot;</span></>
                ) : (
                    "Trending Searches"
                )}
            </h1>

            {!query && (
                <div className="text-gray-400 text-center py-20">
                    Use the search bar above to find movies and TV shows.
                </div>
            )}

            {query && loading && (
                <div className="text-gray-400 text-center py-20">
                    <div className="animate-pulse">Searching...</div>
                </div>
            )}

            {query && !loading && results.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {results.map((movie) => (
                        <div key={movie.id} className="relative h-60">
                            <Image
                                src={movie.imageString}
                                alt="Movie"
                                width={500}
                                height={400}
                                className="rounded-sm absolute w-full h-full object-cover"
                            />
                            <div className="h-60 relative z-10 w-full transform transition duration-500 hover:scale-125 opacity-0 hover:opacity-100">
                                <div className="bg-gradient-to-b from-transparent via-black/50 to-black z-10 w-full h-full rounded-lg flex items-center justify-center">
                                    <Image
                                        src={movie.imageString}
                                        alt="Movie"
                                        width={800}
                                        height={800}
                                        className="absolute w-full h-full -z-10 rounded-lg object-cover"
                                    />
                                    <Card
                                        key={movie.id}
                                        age={movie.age}
                                        movieId={movie.id}
                                        overview={movie.overview || ""}
                                        time={movie.duration}
                                        title={movie.title}
                                        wachtListId=""
                                        watchList={false}
                                        year={movie.release}
                                        youtubeUrl={movie.youtubeString}
                                        videoSource={movie.videoSource}
                                    />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {query && !loading && results.length === 0 && (
                <div className="text-gray-400 text-center py-20">
                    No results found for &quot;{query}&quot;
                </div>
            )}
        </div>
    );
}

export default function SearchPage() {
    return (
        <Suspense fallback={
            <div className="max-w-7xl mx-auto px-5 lg:px-8 mt-10">
                <div className="text-gray-400 text-center py-20 animate-pulse">
                    Loading search...
                </div>
            </div>
        }>
            <SearchContent />
        </Suspense>
    );
}
