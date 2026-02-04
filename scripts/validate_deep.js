
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Configuration
const BATCH_SIZE = 20;

async function checkImage(url) {
    try {
        const res = await fetch(url, { method: 'HEAD', signal: AbortSignal.timeout(5000) });
        return res.ok;
    } catch { return false; }
}

async function checkVideo(url) {
    try {
        // Must use GET to see body content because status might be 200 lie
        const res = await fetch(url, {
            method: 'GET',
            signal: AbortSignal.timeout(8000),
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
                'Referer': 'https://netekflix.vercel.app/'
            }
        });

        if (!res.ok) return false; // Real 404/500

        const text = await res.text();

        // Vidsrc specific error signatures
        // invalid IDs often return small pages or pages with "404" in title
        if (text.length < 500) return false; // Too small to be a player
        if (text.includes("<title>404</title>")) return false;
        if (text.includes("File not found")) return false;

        return true;
    } catch { return false; }
}

async function main() {
    console.log("Starting AGGRESSIVE Deep Validation...");

    let lastId = 0;
    let deletedCount = 0;
    let checkedCount = 0;

    while (true) {
        try {
            const movies = await prisma.movie.findMany({
                take: BATCH_SIZE,
                where: { id: { gt: lastId } },
                orderBy: { id: 'asc' }
            });

            if (movies.length === 0) {
                console.log("Scan complete. Waiting 60s before restart...");
                await new Promise(r => setTimeout(r, 60000));
                lastId = 0; // Loop forever
                continue;
            }

            for (const movie of movies) {
                if (movie.id > lastId) lastId = movie.id;
                checkedCount++;

                // 1. Check Poster
                const posterOk = await checkImage(movie.imageString);

                let valid = posterOk;

                // 2. Check Video (Only if poster was ok, to save time? No, check both)
                if (valid) {
                    const videoOk = await checkVideo(movie.videoSource);
                    if (!videoOk) valid = false;
                }

                if (!valid) {
                    console.log(`[DELETE] ${movie.title} (${movie.id}) - Broken Link/Poster`);
                    await prisma.movie.delete({ where: { id: movie.id } });
                    deletedCount++;
                } else {
                    // console.log(`[OK] ${movie.title}`);
                }
            }

            console.log(`Checked: ${checkedCount} | Deleted: ${deletedCount} | LastID: ${lastId}`);
            await new Promise(r => setTimeout(r, 500)); // Polite delay

        } catch (err) {
            console.error("Error in loop:", err.message);
            await new Promise(r => setTimeout(r, 5000));
        }
    }
}

main()
    .catch(e => console.error(e))
    .finally(async () => {
        await prisma.$disconnect();
    });
