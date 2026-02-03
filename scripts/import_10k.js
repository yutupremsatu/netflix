
const { Client } = require('pg');

const connectionString = "postgresql://postgres.riesqqctsavzpprucbal:%23uTzRMmmnED83Nc@aws-1-us-east-1.pooler.supabase.com:6543/postgres";
// Using the mirror that worked best previously
const MIRRORS = [
    "https://yts.mx/api/v2/list_movies.json",
    "https://yts.am/api/v2/list_movies.json"
];

async function import10kMovies() {
    const client = new Client({ connectionString, ssl: { rejectUnauthorized: false } });
    await client.connect();

    console.log("Starting 10k MOVIE IMPORT...");

    let totalAdded = 0;
    // We need 10,000 movies. 50 per page = 200 pages.
    // Let's run from page 1 to 200.
    // We'll increment ID base to ensuring we don't collide with previous imports if IDs were manual, 
    // but we are using manual IDs.
    // Let's just use the movie's IMDB ID hash or something? 
    // No, existing schema uses integer ID.
    // Let's find the current max ID first.

    const res = await client.query('SELECT MAX(id) as max_id FROM "Movie"');
    let currentId = (res.rows[0].max_id || 0) + 1;
    console.log(`Starting with ID: ${currentId}`);

    for (let page = 1; page <= 220; page++) { // buffer for duplicates
        let success = false;
        for (const mirror of MIRRORS) {
            try {
                // sort_by=year to get a good mix or download_count? 
                // download_count gives popular ones.
                const url = `${mirror}?limit=50&page=${page}&sort_by=download_count`;
                const response = await fetch(url);
                if (!response.ok) continue;

                const json = await response.json();
                if (!json.data || !json.data.movies) break;

                const movies = json.data.movies;
                let batchCount = 0;

                for (const m of movies) {
                    if (!m.imdb_code) continue;

                    // Check if IMDB ID exists to avoid duplicates?
                    // Ideally yes, but "Movie" table doesn't seem to have imdb_code column constraints visible here.
                    // We rely on "Overview" uniqueness? No.
                    // Let's just insert. Duplicate titles might appear but with different IDs.

                    const values = [
                        currentId,
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
                    currentId++;
                    batchCount++;
                    totalAdded++;
                }

                success = true;
                process.stdout.write(`Page ${page}: +${batchCount} movies\r`);
                break; // Mirror worked, move to next page

            } catch (e) {
                // Try next mirror
            }
        }

        if (!success) console.log(`\nFailed to fetch page ${page}`);

        // Politeness delay slightly reduced for speed but safe
        await new Promise(r => setTimeout(r, 100));
    }

    console.log(`\n\nFINISHED. Total added in this session: ${totalAdded}`);
    await client.end();
}

import10kMovies();
