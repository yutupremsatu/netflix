
const { Client } = require('pg');

const connectionString = "postgresql://postgres.riesqqctsavzpprucbal:%23uTzRMmmnED83Nc@aws-1-us-east-1.pooler.supabase.com:6543/postgres";
const MIRRORS = [
    "https://yts.am/api/v2/list_movies.json", // This worked last time
    "https://yts.mx/api/v2/list_movies.json",
    "https://yts.lt/api/v2/list_movies.json",
    "https://yts.rs/api/v2/list_movies.json"
];

async function importMassFallback() {
    const client = new Client({ connectionString, ssl: { rejectUnauthorized: false } });
    await client.connect();

    // Start high to avoid collisions
    let idBase = 15000;
    let totalAdded = 0;

    console.log("Starting MASS IMPORT RETRY (Target: 1000 movies)...");

    for (const mirror of MIRRORS) {
        console.log(`\nTrying mirror: ${mirror}`);
        let successOnMirror = false;
        let mirrorAdded = 0;

        // Try up to 25 pages
        for (let page = 1; page <= 25; page++) {
            try {
                const url = `${mirror}?limit=50&page=${page}&sort_by=download_count`;
                // console.log(`  Fetching page ${page}...`);
                const res = await fetch(url);
                if (!res.ok) throw new Error(`HTTP ${res.status}`);

                const json = await res.json();
                if (!json.data || !json.data.movies) {
                    console.log(`  No data on page ${page}. Stopping this mirror.`);
                    break;
                }

                const movies = json.data.movies;
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
                    mirrorAdded++;
                }

                process.stdout.write("."); // Progress bar
            } catch (err) {
                console.log(`\n  Mirror ${mirror} failed on page ${page}: ${err.message}`);
                break; // Move to next mirror if this one fails mid-way
            }

            // Politeness
            await new Promise(r => setTimeout(r, 200));
        }

        if (successOnMirror && mirrorAdded > 0) {
            console.log(`\n  Mirror ${mirror} successful. Added ${mirrorAdded} movies.`);
            // If we got good data, we can stop iterating mirrors, OR we can keep going if we want MORE?
            // User wants 1000. 25 pages * 50 = 1250. So one good mirror is enough.
            if (totalAdded >= 1000) break;
        }
    }

    console.log(`\nGRAND TOTAL ADDED in this run: ${totalAdded}`);
    await client.end();
}

importMassFallback();
