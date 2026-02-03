
const { Client } = require('pg');

const connectionString = "postgresql://postgres.riesqqctsavzpprucbal:%23uTzRMmmnED83Nc@aws-1-us-east-1.pooler.supabase.com:6543/postgres";
const MIRROR = "https://yts.mx/api/v2/list_movies.json";

async function importMassMovies() {
    const client = new Client({ connectionString, ssl: { rejectUnauthorized: false } });
    await client.connect();

    // Start high to avoid collisions
    let idBase = 10000;
    let totalAdded = 0;

    console.log("Starting MASS IMPORT (Target: 1000 movies)...");

    // Fetch 20 pages (50 per page = 1000)
    // We can go higher to be safe, let's do 25 pages.
    for (let page = 1; page <= 25; page++) {
        console.log(`Fetching page ${page}...`);
        try {
            // sort by download_count to get popular ones
            const url = `${MIRROR}?limit=50&page=${page}&sort_by=download_count`;
            const res = await fetch(url);

            if (!res.ok) {
                console.log(`Failed to fetch page ${page}: ${res.status}`);
                continue;
            }

            const json = await res.json();
            if (!json.data || !json.data.movies) break;

            const movies = json.data.movies;

            for (const m of movies) {
                if (!m.imdb_code) continue;

                // Simple transformation
                const values = [
                    idBase + totalAdded,
                    m.title,
                    12,
                    m.runtime ? parseFloat((m.runtime / 60).toFixed(2)) : 1.5,
                    m.summary || m.description_full || "No overview",
                    m.large_cover_image || m.medium_cover_image,
                    m.year || 2022,
                    `https://vidsrc.xyz/embed/movie/${m.imdb_code}`,
                    "movie",
                    ""
                ];

                const sql = `
                    INSERT INTO "Movie" (id, title, age, duration, overview, "imageString", release, "videoSource", category, "youtubeString")
                    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
                    ON CONFLICT (id) DO NOTHING
                `;

                await client.query(sql, values);
                totalAdded++;
            }

            // Politeness
            await new Promise(r => setTimeout(r, 200));

        } catch (err) {
            console.log(`Error on page ${page}: ${err.message}`);
        }
    }

    console.log(`\nGRAND TOTAL ADDED: ${totalAdded}`);
    await client.end();
}

importMassMovies();
