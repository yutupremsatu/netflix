
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// Mirror list to rotate through if blocked
const YTS_MIRRORS = [
    "https://yts.mx/api/v2/list_movies.json",
    "https://yts.lt/api/v2/list_movies.json",
    "https://yts.am/api/v2/list_movies.json",
    "https://yts.bz/api/v2/list_movies.json"
];

// Configuration
const TOTAL_PAGES_TARGET = 2200; // 50 movies * 2200 pages = ~110,000 movies
const START_PAGE = 1;
const MOVIES_PER_PAGE = 50;

async function fetchWithRetry(page, mirrorIndex = 0) {
    if (mirrorIndex >= YTS_MIRRORS.length) {
        throw new Error(`All mirrors failed for page ${page}`);
    }

    const url = `${YTS_MIRRORS[mirrorIndex]}?limit=${MOVIES_PER_PAGE}&page=${page}`;

    try {
        console.log(`Fetching page ${page} from ${YTS_MIRRORS[mirrorIndex]}...`);
        const response = await fetch(url, { signal: AbortSignal.timeout(10000) }); // 10s timeout

        if (!response.ok) {
            throw new Error(`Status ${response.status}`);
        }

        const data = await response.json();
        if (!data.data || !data.data.movies) {
            // Some mirrors return empty data instead of error
            if (data.status === "ok" && !data.data.movies) {
                console.log("No more movies found.");
                return { movies: [] };
            }
            throw new Error("Invalid data structure");
        }

        return data.data;
    } catch (error) {
        console.warn(`Mirror ${YTS_MIRRORS[mirrorIndex]} failed: ${error.message}. Switching...`);
        // Wait briefly before switching to be polite
        await new Promise(r => setTimeout(r, 1000));
        return fetchWithRetry(page, mirrorIndex + 1);
    }
}

async function main() {
    console.log(`Starting MASSIVE import text... Target: 100k Movies`);

    let totalImported = 0;

    // Start ID from a very high number to avoid any conflict with existing manual IDs
    // Although Prisma auto-increments, we are just inserting.

    for (let page = START_PAGE; page <= TOTAL_PAGES_TARGET; page++) {
        try {
            const data = await fetchWithRetry(page);

            if (!data.movies || data.movies.length === 0) {
                console.log("Stream ended/No more movies.");
                break;
            }

            const moviesToInsert = [];

            for (const movie of data.movies) {
                // Skip if critical data missing
                if (!movie.imdb_code || !movie.title) continue;

                moviesToInsert.push({
                    // Let ID be auto-generated or use `upsert` if we want to be safe, 
                    // but `createMany` with `skipDuplicates` is faster for bulk.
                    title: movie.title,
                    age: 0, // Default
                    duration: movie.runtime || 0,
                    imageString: movie.large_cover_image || movie.medium_cover_image || "",
                    overview: movie.summary || "No overview available.",
                    release: movie.year || 2024,
                    videoSource: `https://vidsrc.xyz/embed/movie/${movie.imdb_code}`,
                    category: "Movie", // Default category
                    youtubeString: movie.yt_trailer_code ? `https://www.youtube.com/watch?v=${movie.yt_trailer_code}` : "",
                });
            }

            if (moviesToInsert.length > 0) {
                // createMany is efficient and supported in recent Prisma versions for most DBs
                await prisma.movie.createMany({
                    data: moviesToInsert,
                    skipDuplicates: true,
                });

                totalImported += moviesToInsert.length;
                console.log(`Page ${page}/${TOTAL_PAGES_TARGET} done. Imported ${moviesToInsert.length} movies. Total Session: ${totalImported}`);
            }

            // Polite delay to prevent rate limiting even with mirrors
            await new Promise(r => setTimeout(r, 200));

        } catch (err) {
            console.error(`Failed Page ${page}: ${err.message}`);
            // Continue to next page anyway? Or stop? 
            // For massive import, skipping one bad page is better than stopping.
            continue;
        }
    }

    console.log(`JOB FINISHED. Total new movies imported: ${totalImported}`);
}

main()
    .catch((e) => console.error(e))
    .finally(async () => {
        await prisma.$disconnect();
    });
