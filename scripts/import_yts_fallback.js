
const { Client } = require('pg');

const connectionString = "postgresql://postgres.riesqqctsavzpprucbal:%23uTzRMmmnED83Nc@aws-1-us-east-1.pooler.supabase.com:6543/postgres";
const MIRRORS = [
    "https://yts.mx/api/v2/list_movies.json",
    "https://yts.am/api/v2/list_movies.json",
    "https://yts.lt/api/v2/list_movies.json",
    "https://yts.rs/api/v2/list_movies.json"
];

async function importMoviesFallback() {
    const client = new Client({ connectionString, ssl: { rejectUnauthorized: false } });
    await client.connect();

    let idBase = 7000;
    let totalAdded = 0;

    // Try each mirror until one works for at least one page
    for (const mirror of MIRRORS) {
        console.log(`\nTrying mirror: ${mirror}`);
        let successOnMirror = false;

        for (let page = 1; page <= 5; page++) { // Try 5 pages per mirror first
            try {
                const url = `${mirror}?limit=50&page=${page}&sort_by=download_count`;
                const res = await fetch(url);
                if (!res.ok) throw new Error(`HTTP ${res.status}`);

                const json = await res.json();
                if (!json.data || !json.data.movies) break;

                const movies = json.data.movies;
                console.log(`  Fetched ${movies.length} movies from page ${page}`);
                successOnMirror = true;

                for (const m of movies) {
                    if (!m.imdb_code) continue;

                    const values = [
                        idBase + totalAdded,
                        m.title,
                        12,
                        m.runtime ? parseFloat((m.runtime / 60).toFixed(2)) : 1.5,
                        m.summary || m.description_full || "No overview",
                        m.large_cover_image || m.medium_cover_image,
                        m.year || 2023,
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
            } catch (err) {
                console.log(`  Mirror ${mirror} failed on page ${page}: ${err.message}`);
                break; // Try next mirror if page 1 fails, or stop if mid-stream
            }
        }

        if (successOnMirror) {
            console.log(`Mirror ${mirror} seems working. Continuing...`);
            // Could continue more pages here if needed, but for now let's just use what we got
            if (totalAdded > 100) break; // Stop if we have enough
        }
    }

    console.log(`\nGRAND TOTAL ADDED: ${totalAdded}`);
    await client.end();
}

importMoviesFallback();
