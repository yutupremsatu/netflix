
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function validateUrl(url) {
    try {
        const response = await fetch(url, {
            method: 'HEAD',
            signal: AbortSignal.timeout(5000)
        });
        return response.ok;
    } catch (error) {
        return false;
    }
}

async function main() {
    console.log("Starting movie validation and pruning (CRASH-PROOF MODE)...");

    let totalChecked = 0;
    let totalDeleted = 0;
    const batchSize = 50;

    // Use ID-based pagination (gt) to be safe against deletions
    let lastId = 0;

    while (true) {
        try {
            const movies = await prisma.movie.findMany({
                take: batchSize,
                where: {
                    id: { gt: lastId }
                },
                orderBy: { id: 'asc' }
            });

            if (movies.length === 0) {
                // End of list reached. Wait and retry (for infinite background mode)
                // or just break if we want to stop. 
                // User asked to run continuously, so we wait for new imports.
                console.log("End of current list. Waiting 10s for new imports...");
                await new Promise(r => setTimeout(r, 10000));
                continue;
            }

            for (const movie of movies) {
                // Determine next cursor
                if (movie.id > lastId) lastId = movie.id;

                totalChecked++;

                // Concurrent validation for speed? (Maybe too heavy, keep sequential for safety)
                const isImageValid = await validateUrl(movie.imageString);
                const isVideoValid = await validateUrl(movie.videoSource);

                if (!isImageValid || !isVideoValid) {
                    // console.warn(`[DELETE] ${movie.title} (ID: ${movie.id})`);
                    try {
                        await prisma.movie.delete({
                            where: { id: movie.id }
                        });
                        totalDeleted++;
                    } catch (delErr) {
                        // Ignore delete errors (record might be gone already or DB lock)
                        // console.error("Delete failed, skipping");
                    }
                }
            }

            console.log(`[STATUS] Checked: ${totalChecked} | Deleted: ${totalDeleted} | Current ID: ${lastId}`);

            // Anti-rate limit delay
            await new Promise(r => setTimeout(r, 100));

        } catch (loopErr) {
            console.error("Critical Loop Error (Recovering per instruction):", loopErr.message);
            // Wait a bit longer before retrying to let DB recover
            await new Promise(r => setTimeout(r, 5000));
        }
    }
}

main()
    .catch(e => console.error(e))
    .finally(async () => {
        await prisma.$disconnect();
    });
