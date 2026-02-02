const { Client } = require('pg');
const connectionString = "postgresql://postgres.riesqqctsavzpprucbal:%23uTzRMmmnED83Nc@aws-1-us-east-1.pooler.supabase.com:6543/postgres";

async function check() {
    const client = new Client({
        connectionString: connectionString,
        ssl: { rejectUnauthorized: false }
    });

    try {
        await client.connect();
        const res = await client.query('SELECT id, title, "videoSource" FROM "Movie"');
        console.log("Movie Video Sources:");
        res.rows.forEach(row => {
            console.log(`ID: ${row.id}, Title: ${row.title}, Source: "${row.videoSource}"`);
        });
        await client.end();
    } catch (err) {
        console.error("Error:", err.message);
    }
}

check();
