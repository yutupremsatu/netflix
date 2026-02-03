
const { Client } = require('pg');

const connectionString = "postgresql://postgres.riesqqctsavzpprucbal:%23uTzRMmmnED83Nc@aws-1-us-east-1.pooler.supabase.com:6543/postgres";
const YTS_API_URL = "https://yts.am/api/v2/list_movies.json"; // Mirror that worked

async function importYTSMovies() {
    const client = new Client({
        connectionString: connectionString,
        ssl: { rejectUnauthorized: false }
    });

    try {
        await client.connect();
        let totalImported = 0;
        let idCounter = 1000; // Start at 1000 to avoid conflicts with previous imports

        // Fetch 20 pages of 50 movies = 1000 movies
        for (let page = 1; page <= 2; page++) { // Reduced to 2 pages (100 movies) for quick test, user said "add more" not "add all"
            // Wait to avoid rate limits
            if (page > 1) await new Promise(r => setTimeout(r, 1000));

            // Use sort_by=download_count to get popular ones
            const url = `${YTS_API_URL}?limit=50&page=${page}&sort_by=download_count`;
            console.log(`Fetching page ${page}...`);

            try {
                const response = await fetch(url);
                const json = await response.json();

                if (!json.data || !json.data.movies) {
                    console.log("No movies found on page " + page);
                    break;
                }

                const movies = json.data.movies;

                for (const movie of movies) {
                    if (!movie.imdb_code || !movie.title) continue;

                    // Skip adult/junk if needed (YTS usually has mainstream)

                    const videoSource = `https://vidsrc.xyz/embed/movie/${movie.imdb_code}`;
                    const age = 12; // Default, YTS doesn't have simple age rating easily mapped
                    const duration = movie.runtime ? parseFloat((movie.runtime / 60).toFixed(2)) : 1.5;
                    const release = movie.year || 2022;
                    const category = "movie";

                    // Prefer large cover, fallback to medium
                    const imageString = movie.large_cover_image || movie.medium_cover_image;

                    const sql = `
                        INSERT INTO "Movie" (id, title, age, duration, overview, "imageString", release, "videoSource", category, "youtubeString")
                        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
                        ON CONFLICT (id) DO NOTHING
                    `;
                    // Using DO NOTHING to keep existing manual entries if ID conflicts, 
                    // but we started ID at 1000 so it should be fine.
                    // Actually, if we want to update existing movies with better posters, we should match by TITLE or IMDB ID?
                    // But our schema key is 'id'. We can't easily match by immutable ID without querying first.
                    // For now, simple append mode.

                    const values = [
                        idCounter,
                        movie.title,
                        age,
                        duration,
                        movie.summary || movie.description_full || "No overview",
                        imageString,
                        release,
                        videoSource,
                        category,
                        ""
                    ];

                    await client.query(sql, values);
                    process.stdout.write(".");
                    idCounter++;
                    totalImported++;
                }
            } catch (pageErr) {
                console.error(`Error fetching page ${page}:`, pageErr);
            }
        }

        console.log(`\nSuccessfully imported ${totalImported} movies from YTS!`);
        await client.end();

    } catch (err) {
        console.error("Critical error:", err);
        if (client) await client.end();
    }
}

importYTSMovies();
