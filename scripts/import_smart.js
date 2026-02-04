
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Configuration
const IDLE_TIMEOUT_MS = 60 * 60 * 1000; // 60 minutes
const START_PAGE = 1;
const YTS_MIRRORS = [
    "https://yts.mx/api/v2/list_movies.json",
    "https://yts.lt/api/v2/list_movies.json",
    "https://yts.am/api/v2/list_movies.json",
    "https://yts.bz/api/v2/list_movies.json"
];

async function validateUrl(url) {
    try {
        const response = await fetch(url, {
            method: 'HEAD',
            signal: AbortSignal.timeout(5000)
        });
        return response.ok;
    } catch (error) {
        return false;
    }
}

async function fetchWithRetry(page, mirrorIndex = 0) {
    if (mirrorIndex >= YTS_MIRRORS.length) throw new Error("All mirrors failed");
    const url = `${YTS_MIRRORS[mirrorIndex]}?limit=50&page=${page}`;
    try {
        const res = await fetch(url, { signal: AbortSignal.timeout(10000) });
        if (!res.ok) throw new Error("Status " + res.status);
        const json = await res.json();
        return json.data;
    } catch (e) {
        return fetchWithRetry(page, mirrorIndex + 1);
    }
}

async function main() {
    console.log("Starting SMART IMPORT (Validate & Add)...");

    let lastNewMovieTime = Date.now();
    let totalAdded = 0;

    // Resume logic could be added here, but for now we scan from pg 1 to ensure we fill gaps
    for (let page = START_PAGE; page <= 3000; page++) {

        // 1. Check Idle Timeout
        const idleTime = Date.now() - lastNewMovieTime;
        if (idleTime > IDLE_TIMEOUT_MS) {
            console.log(`❌ STOPPING: No new valid movies found for 60 minutes.`);
            break;
        }

        try {
            console.log(`Fetching Page ${page}... (Idle search: ${(idleTime / 60000).toFixed(1)} min)`);
            const data = await fetchWithRetry(page);

            if (!data || !data.movies || data.movies.length === 0) {
                console.log("No movies returned on this page.");
                // continue searching, don't break immediately in case of gaps, 
                // unless idle timer kills it.
                await new Promise(r => setTimeout(r, 2000));
                continue;
            }

            let pageAddedCount = 0;

            for (const movie of data.movies) {
                // 2. Check Exists in DB (Minimize DB writes)
                const exists = await prisma.movie.findFirst({
                    where: {
                        title: movie.title,
                        release: movie.year
                    }
                });

                if (exists) {
                    process.stdout.write("."); // Dot for existing
                    continue;
                }

                // 3. Validate Links (The "Smart" Part)
                const videoUrl = `https://vidsrc.xyz/embed/movie/${movie.imdb_code}`;
                const imageUrl = movie.large_cover_image || movie.medium_cover_image;

                if (!imageUrl || !movie.imdb_code) continue;

                const isImageValid = await validateUrl(imageUrl);
                const isVideoValid = await validateUrl(videoUrl);

                if (isImageValid && isVideoValid) {
                    // 4. Insert Valid Movie
                    await prisma.movie.create({
                        data: {
                            title: movie.title,
                            age: 0,
                            duration: movie.runtime || 0,
                            imageString: imageUrl,
                            overview: movie.summary || "No overview.",
                            release: movie.year || 2024,
                            videoSource: videoUrl,
                            category: "Movie",
                            youtubeString: movie.yt_trailer_code ? `https://www.youtube.com/watch?v=${movie.yt_trailer_code}` : "",
                        }
                    });

                    process.stdout.write("✅"); // Check for added
                    lastNewMovieTime = Date.now(); // RESET TIMER
                    pageAddedCount++;
                    totalAdded++;
                } else {
                    process.stdout.write("❌"); // X for invalid
                }
            }

            console.log(`\nPage ${page} Done. Added: ${pageAddedCount}. Total Session: ${totalAdded}`);

            // Nice delay
            await new Promise(r => setTimeout(r, 500));

        } catch (err) {
            console.error(`Page ${page} Error: ${err.message}`);
        }
    }
}

main()
    .catch(e => console.error(e))
    .finally(async () => {
        await prisma.$disconnect();
    });
