
const { Client } = require('pg');

// Use the pooled connection string for potentially large number of inserts
const connectionString = "postgresql://postgres.riesqqctsavzpprucbal:%23uTzRMmmnED83Nc@aws-1-us-east-1.pooler.supabase.com:6543/postgres";
const DATASET_URL = "https://raw.githubusercontent.com/toedter/movies-demo/master/backend/src/main/resources/static/movie-data/movies-250.json";

function parseDuration(runtime) {
    // "142 min" -> 2.36
    if (!runtime) return 0;
    const minutes = parseInt(runtime.split(' ')[0]) || 0;
    return parseFloat((minutes / 60).toFixed(2));
}

function parseAge(rated) {
    switch (rated) {
        case 'G': return 0;
        case 'PG': return 7;
        case 'PG-13': return 13;
        case 'R': return 17;
        case 'NC-17': return 18;
        default: return 12;
    }
}

async function importMovies() {
    const client = new Client({
        connectionString: connectionString,
        ssl: { rejectUnauthorized: false }
    });

    try {
        console.log("Fetching movie data...");
        const response = await fetch(DATASET_URL);
        const data = await response.json();
        const movies = data.movies;

        console.log(`Fetched ${movies.length} movies. Connecting to database...`);
        await client.connect();

        let count = 0;
        // Start from ID 100 to avoid conflict with manual seed (0-~20)
        let idCounter = 100;

        for (const movie of movies) {
            // Skip invalid entries
            if (!movie.imdbID || !movie.Title) continue;

            const videoSource = `https://vidsrc.xyz/embed/movie/${movie.imdbID}`;
            const age = parseAge(movie.Rated);
            const duration = parseDuration(movie.Runtime);
            const release = parseInt(movie.Year) || 2020;
            const category = "movie";

            // Image fallback if poster is missing or N/A
            const imageString = (movie.Poster && movie.Poster !== "N/A")
                ? movie.Poster
                : "https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&q=80&w=1000";

            const sql = `
                INSERT INTO "Movie" (id, title, age, duration, overview, "imageString", release, "videoSource", category, "youtubeString")
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
                ON CONFLICT (id) DO UPDATE SET
                  title = EXCLUDED.title,
                  age = EXCLUDED.age,
                  duration = EXCLUDED.duration,
                  overview = EXCLUDED.overview,
                  "imageString" = EXCLUDED."imageString",
                  release = EXCLUDED.release,
                  "videoSource" = EXCLUDED."videoSource",
                  category = EXCLUDED.category
            `;

            const values = [
                idCounter,
                movie.Title,
                age,
                duration,
                movie.Plot || "No overview available.",
                imageString,
                release,
                videoSource,
                category,
                "" // youtubeString empty for now
            ];

            await client.query(sql, values);
            process.stdout.write("."); // Progress indicator
            idCounter++;
            count++;
        }

        console.log(`\nSuccessfully imported ${count} movies!`);
        await client.end();

    } catch (err) {
        console.error("Import error:", err);
        if (client) await client.end();
    }
}

importMovies();
