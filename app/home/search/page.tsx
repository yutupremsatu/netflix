"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";
// Using Card from MovieCard component below
import { MovieCard as Card } from "@/app/components/MovieCard";

export default function SearchPage() {
    const searchParams = useSearchParams();
    const query = searchParams.get("q");
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
                });
        }
    }, [query]);

    return (
        <div className="max-w-7xl mx-auto px-5 lg:px-8 mt-10">
            <h1 className="text-white text-3xl font-bold mb-8">
                Search Results for: <span className="text-primary italic">&quot;{query}&quot;</span>
            </h1>

            {loading ? (
                <div className="text-gray-400 text-center py-20">Searching...</div>
            ) : results.length > 0 ? (
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
            ) : (
                <div className="text-gray-400 text-center py-20">No results found.</div>
            )}
        </div>
    );
}
