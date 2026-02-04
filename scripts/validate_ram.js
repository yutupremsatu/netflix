
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// CONFIGURATION
const FETCH_SIZE = 1000;    // Fetch 1000 movies at once (Reduces DB Reads drastically)
const CONCURRENCY = 20;    // Check 20 Links simultaneously (Maximize Network)

async function checkUrl(url) {
    try {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 8000); // 8s timeout

        const res = await fetch(url, {
            method: 'GET', // Must be GET to see content
            signal: controller.signal,
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
                'Referer': 'https://netekflix.vercel.app/'
            }
        });
        clearTimeout(timeout);

        if (!res.ok) return false;

        const text = await res.text();
        // Validation Logic
        if (text.length < 500) return false;
        if (text.includes("<title>404</title>")) return false;
        if (text.includes("File not found")) return false;

        return true;
    } catch {
        return false;
    }
}

async function validateBatch(movies) {
    const invalidIds = [];

    // Process in chunks of CONCURRENCY
    for (let i = 0; i < movies.length; i += CONCURRENCY) {
        const chunk = movies.slice(i, i + CONCURRENCY);

        const results = await Promise.all(chunk.map(async (movie) => {
            // Check Poster first (HEAD request, fast)
            // Skip for speed if we mostly trust posters, but better check both.
            // Let's rely on Video Check mostly as it's the "Heavy" one.

            const isValid = await checkUrl(movie.videoSource);
            return { id: movie.id, valid: isValid };
        }));

        for (const res of results) {
            if (!res.valid) invalidIds.push(res.id);
        }

        process.stdout.write("."); // Progress visual
    }
    return invalidIds;
}

async function main() {
    console.log(`Starting RAM-BATCH Validator (Fetch: ${FETCH_SIZE}, Threads: ${CONCURRENCY})`);

    let lastId = 0;
    let totalChecked = 0;
    let totalDeleted = 0;

    while (true) {
        try {
            // 1. Efficient Fetch
            // Select ONLY what we need to save bandwidth
            const movies = await prisma.movie.findMany({
                take: FETCH_SIZE,
                where: { id: { gt: lastId } },
                orderBy: { id: 'asc' },
                select: { id: true, videoSource: true }
            });

            if (movies.length === 0) {
                console.log("\nScan Complete. Waiting 1 minute...");
                await new Promise(r => setTimeout(r, 60000));
                lastId = 0;
                continue;
            }

            // Update Cursor
            lastId = movies[movies.length - 1].id;

            // 2. Heavy Lifting in RAM (No DB connection needed here)
            const idsToDelete = await validateBatch(movies);

            // 3. Bulk Delete (One Single DB Call)
            if (idsToDelete.length > 0) {
                await prisma.movie.deleteMany({
                    where: { id: { in: idsToDelete } }
                });
                process.stdout.write("🗑️");
            }

            totalChecked += movies.length;
            totalDeleted += idsToDelete.length;

            console.log(`\n[BATCH DONE] Checked: ${movies.length} | Deleted: ${idsToDelete.length} | Total: ${totalChecked}`);

        } catch (err) {
            console.error("\nError:", err.message);
            await new Promise(r => setTimeout(r, 2000));
        }
    }
}

main()
    .catch(e => console.error(e))
    .finally(async () => {
        await prisma.$disconnect();
    });
