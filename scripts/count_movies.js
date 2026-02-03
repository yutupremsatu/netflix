
const { Client } = require('pg');
const connectionString = "postgresql://postgres.riesqqctsavzpprucbal:%23uTzRMmmnED83Nc@aws-1-us-east-1.pooler.supabase.com:6543/postgres";

async function countMovies() {
    const client = new Client({ connectionString, ssl: { rejectUnauthorized: false } });
    try {
        await client.connect();
        const res = await client.query('SELECT count(*) FROM "Movie"');
        console.log("Total Movies:", res.rows[0].count);
        await client.end();
    } catch (e) { console.error(e); }
}
countMovies();
