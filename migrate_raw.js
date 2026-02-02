
const { Client } = require('pg');
const connectionString = "postgresql://postgres.riesqqctsavzpprucbal:%23uTzRMmmnED83Nc@aws-1-us-east-1.pooler.supabase.com:6543/postgres";

const sql = `
CREATE TABLE IF NOT EXISTS "Movie" (
    "id" INTEGER NOT NULL,
    "imageString" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "age" INTEGER NOT NULL,
    "duration" DOUBLE PRECISION NOT NULL,
    "overview" TEXT NOT NULL,
    "release" INTEGER NOT NULL,
    "videoSource" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "youtubeString" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Movie_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "User" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "email" TEXT,
    "emailVerified" TIMESTAMP(3),
    "image" TEXT,
    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "User_email_key" ON "User"("email");

CREATE TABLE IF NOT EXISTS "WatchList" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "movieId" INTEGER,
    CONSTRAINT "WatchList_pkey" PRIMARY KEY ("id")
);

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'WatchList_movieId_fkey') THEN
        ALTER TABLE "WatchList" ADD CONSTRAINT "WatchList_movieId_fkey" FOREIGN KEY ("movieId") REFERENCES "Movie"("id") ON DELETE SET NULL ON UPDATE CASCADE;
    END IF;
END $$;
`;

async function run() {
    const client = new Client({
        connectionString: connectionString,
        ssl: { rejectUnauthorized: false }
    });

    try {
        console.log("Attempting to connect to POOLER host:", connectionString.replace(/:[^@]+@/, ':****@'));
        await client.connect();
        console.log("Connected successfully!");
        await client.query(sql);
        console.log("Tables created/verified successfully.");

        const res = await client.query("SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'");
        console.log("Current tables in public schema:", res.rows.map(r => r.table_name));

        await client.end();
    } catch (err) {
        console.error("Migration error:", err.message);
    }
}

run();
