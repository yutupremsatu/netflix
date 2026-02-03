
const { Client } = require('pg');

const connectionString = "postgresql://postgres.riesqqctsavzpprucbal:%23uTzRMmmnED83Nc@aws-1-us-east-1.pooler.supabase.com:6543/postgres";
const YTS_API_URL = "https://yts.mx/api/v2/list_movies.json"; // Trying primary domain again, or yts.mx

async function importMoviesAggressive() {
    const client = new Client({
        connectionString: connectionString,
        ssl: { rejectUnauthorized: false }
    });

    try {
        await client.connect();

        // Start ID high to avoid collisions
        let idBase = 5000;
        let totalAdded = 0;

        // Fetch 10 pages of 50 = 500 movies
        for (let page = 1; page <= 10; page++) {
            console.log(`\n--- Fetching Page ${page} ---`);
            const url = `${YTS_API_URL}?limit=50&page=${page}&sort_by=download_count`;

            try {
                const res = await fetch(url);
                if (!res.ok) throw new Error(`HTTP ${res.status}`);
                const json = await res.json();

                if (!json.data || !json.data.movies) {
                    console.log("No data returned.");
                    continue;
                }

                const movies = json.data.movies;
                console.log(`Found ${movies.length} movies via API.`);

                for (const m of movies) {
                    if (!m.imdb_code) continue;

                    const overview = m.summary || m.description_full || "No overview available.";
                    // Truncate overview to fit typical column if needed, or PG handles TEXT well.

                    const values = [
                        idBase + totalAdded, // Unique ID
                        m.title,
                        12, // Age
                        m.runtime ? parseFloat((m.runtime / 60).toFixed(2)) : 1.5,
                        overview,
                        m.large_cover_image || m.medium_cover_image,
                        m.year || 2022,
                        `https://vidsrc.xyz/embed/movie/${m.imdb_code}`, // Video Source
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
                console.log(`Total inserted so far: ${totalAdded}`);

            } catch (err) {
                console.error(`Page ${page} failed: ${err.message}`);
            }

            // Politeness delay
            await new Promise(r => setTimeout(r, 500));
        }

        console.log(`\nGRAND TOTAL ADDED: ${totalAdded}`);
        await client.end();

    } catch (e) {
        console.error("Critical:", e);
    }
}

importMoviesAggressive();
