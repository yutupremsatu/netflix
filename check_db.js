
const { Client } = require('pg');
const connectionString = "postgresql://postgres.riesqqctsavzpprucbal:%23uTzRMmmnED83Nc@db.riesqqctsavzpprucbal.supabase.co:5432/postgres";

async function check() {
    const client = new Client({
        connectionString: connectionString,
        ssl: { rejectUnauthorized: false }
    });

    try {
        console.log("Attempting to connect to DIRECT host:", connectionString.replace(/:[^@]+@/, ':****@'));
        await client.connect();
        console.log("Connected successfully!");
        const res = await client.query('SELECT current_database(), current_user, version()');
        console.log("Info:", res.rows[0]);

        // Check if tables exist
        const tables = await client.query("SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'");
        console.log("Tables found:", tables.rows.map(r => r.table_name));

        await client.end();
    } catch (err) {
        console.error("Connection error type:", err.name);
        console.error("Connection error message:", err.message);
    }
}

check();
