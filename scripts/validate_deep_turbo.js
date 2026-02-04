
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Configuration
const CONCURRENCY_LIMIT = 8;
const BATCH_SIZE = 50;

async function checkImage(url) {
    try {
        const res = await fetch(url, { method: 'HEAD', signal: AbortSignal.timeout(5000) });
        return res.ok;
    } catch { return false; }
}

async function checkVideo(url) {
    try {
        const res = await fetch(url, {
            method: 'GET',
            signal: AbortSignal.timeout(8000), // 8s timeout
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
                'Referer': 'https://netekflix.vercel.app/'
            }
        });

        if (!res.ok) return false;
        const text = await res.text();

        if (text.length < 500) return false;
        if (text.includes("<title>404</title>")) return false;
        if (text.includes("File not found")) return false;

        return true;
    } catch { return false; }
}

async function validateMovie(movie) {
    const posterOk = await checkImage(movie.imageString);
    if (!posterOk) return { id: movie.id, title: movie.title, valid: false, reason: "Poster" };

    // Check video parallel to image? No, waste of bandwidth if poster fails.
    const videoOk = await checkVideo(movie.videoSource);
    if (!videoOk) return { id: movie.id, title: movie.title, valid: false, reason: "Video" };

    return { id: movie.id, valid: true };
}

async function main() {
    console.log(`Starting TURBO Validation (${CONCURRENCY_LIMIT} Threads)...`);

    let lastId = 0;
    let totalChecked = 0;
    let totalDeleted = 0;

    while (true) {
        try {
            // 1. Fetch Batch
            const movies = await prisma.movie.findMany({
                take: BATCH_SIZE,
                where: { id: { gt: lastId } },
                orderBy: { id: 'asc' }
            });

            if (movies.length === 0) {
                console.log("Cycle complete. Waiting 30s...");
                await new Promise(r => setTimeout(r, 30000));
                lastId = 0;
                continue;
            }

            // Update Cursor immediately
            if (movies[movies.length - 1].id > lastId) {
                lastId = movies[movies.length - 1].id;
            }

            // 2. Process in Chunks (Concurrency Control)
            // We have BATCH_SIZE movies. We want to run them with CONCURRENCY_LIMIT.
            // Simple approach: Map all to promises, but that might technically exceed 8 if batch is 50.
            // Better: Use a pool or just stick to Limit = Batch/k. 
            // User asked for 8 threads. We can just process 'Batch' in parallel if Batch=8?
            // Or just fire all 50. 50 parallel reqs is fine for "good network".
            // Let's stick to the user's "8 threads" request precisely by slicing.

            const results = [];
            for (let i = 0; i < movies.length; i += CONCURRENCY_LIMIT) {
                const chunk = movies.slice(i, i + CONCURRENCY_LIMIT);
                const chunkResults = await Promise.all(chunk.map(validateMovie));
                results.push(...chunkResults);
            }

            // 3. Handle Deletions (Sequentially to be safe on DB)
            const invalidMovies = results.filter(r => !r.valid);

            if (invalidMovies.length > 0) {
                // Bulk delete possible? 
                // await prisma.movie.deleteMany({ where: { id: { in: ids } } })
                // Yes, much faster.
                const idsToDelete = invalidMovies.map(m => m.id);

                await prisma.movie.deleteMany({
                    where: { id: { in: idsToDelete } }
                });

                totalDeleted += idsToDelete.length;
                console.log(`[Batch] Checked ${results.length}. Deleted ${idsToDelete.length} (e.g. ${invalidMovies[0].title})`);
            } else {
                console.log(`[Batch] Checked ${results.length}. All Clean.`);
            }

            totalChecked += results.length;
            console.log(`>>> Total Checked: ${totalChecked} | Total Deleted: ${totalDeleted} | Cursor: ${lastId}`);

        } catch (err) {
            console.error("Critical Error:", err.message);
            await new Promise(r => setTimeout(r, 5000));
        }
    }
}

main()
    .catch(e => console.error(e))
    .finally(async () => {
        await prisma.$disconnect();
    });
