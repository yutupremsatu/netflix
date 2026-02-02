
const { Client } = require('pg');
const connectionString = "postgresql://postgres.riesqqctsavzpprucbal:%23uTzRMmmnED83Nc@aws-1-us-east-1.pooler.supabase.com:6543/postgres";

async function check() {
    const client = new Client({
        connectionString: connectionString,
        ssl: { rejectUnauthorized: false }
    });

    try {
        console.log("Attempting to connect to US-EAST-1 POOLER:", connectionString.replace(/:[^@]+@/, ':****@'));
        await client.connect();
        console.log("Connected successfully!");

        // Check current search path and tables
        const res = await client.query('SELECT current_schema()');
        console.log("Current schema:", res.rows[0].current_schema);

        const tables = await client.query("SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'");
        console.log("Tables in 'public' schema:", tables.rows.map(r => r.table_name));

        const allSchemas = await client.query("SELECT schema_name FROM information_schema.schemata");
        console.log("All schemas:", allSchemas.rows.map(r => r.schema_name));

        await client.end();
    } catch (err) {
        console.error("Connection error:", err.message);
    }
}

check();
