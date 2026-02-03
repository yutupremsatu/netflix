
const { Client } = require('pg');

const connectionString = "postgresql://postgres.riesqqctsavzpprucbal:%23uTzRMmmnED83Nc@aws-1-us-east-1.pooler.supabase.com:6543/postgres";
const YTS_API_URL = "https://yts.am/api/v2/list_movies.json";

async function importLatestMovies() {
    const client = new Client({
        connectionString: connectionString,
        ssl: { rejectUnauthorized: false }
    });

    try {
        await client.connect();
        let totalImported = 0;
        let idCounter = 3000; // Start at 3000 for latest

        // Fetch 5 pages of latest movies = 100 movies (2025-2024)
        for (let page = 1; page <= 5; page++) {
            if (page > 1) await new Promise(r => setTimeout(r, 1000));

            // sort_by=year to get latest
            const url = `${YTS_API_URL}?limit=20&page=${page}&sort_by=year&order_by=desc`;
            console.log(`Fetching latest page ${page}...`);

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

                    // Log domain for potential new config
                    const poster = movie.large_cover_image || movie.medium_cover_image;
                    if (poster) {
                        try {
                            const domain = new URL(poster).hostname;
                            // Check manually against known domains later or log unique ones
                            // console.log("Domain:", domain);
                        } catch (e) { }
                    }

                    const videoSource = `https://vidsrc.xyz/embed/movie/${movie.imdb_code}`;
                    const age = 12;
                    const duration = movie.runtime ? parseFloat((movie.runtime / 60).toFixed(2)) : 1.5;
                    const release = movie.year || 2025;
                    const category = "movie";

                    const imageString = poster;

                    const sql = `
                        INSERT INTO "Movie" (id, title, age, duration, overview, "imageString", release, "videoSource", category, "youtubeString")
                        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
                        ON CONFLICT (id) DO NOTHING
                    `;

                    const values = [
                        idCounter,
                        movie.title,
                        age,
                        duration,
                        movie.summary || movie.description_full || "No overview",
                        imageString || "",
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

        console.log(`\nSuccessfully imported ${totalImported} LASTEST movies!`);
        await client.end();

    } catch (err) {
        console.error("Critical error:", err);
        if (client) await client.end();
    }
}

importLatestMovies();
