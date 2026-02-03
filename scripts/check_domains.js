
const { Client } = require('pg');
const connectionString = "postgresql://postgres.riesqqctsavzpprucbal:%23uTzRMmmnED83Nc@aws-1-us-east-1.pooler.supabase.com:6543/postgres";

async function checkDomains() {
    const client = new Client({ connectionString, ssl: { rejectUnauthorized: false } });
    try {
        await client.connect();
        const res = await client.query('SELECT "imageString" FROM "Movie"');
        const domains = new Set();
        res.rows.forEach(r => {
            try {
                if (r.imageString && r.imageString.startsWith('http')) {
                    domains.add(new URL(r.imageString).hostname);
                }
            } catch (e) { }
        });
        console.log("Domains found:", Array.from(domains));
        await client.end();
    } catch (e) { console.error(e); }
}
checkDomains();
