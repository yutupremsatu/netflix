
// Test script to compare valid vs invalid vidsrc responses

async function check(id, type) {
    const url = `https://vidsrc.xyz/embed/movie/${id}`;
    console.log(`Checking ${type} (${id})...`);

    try {
        const res = await fetch(url);
        const text = await res.text();

        console.log(`[${type}] Status: ${res.status}`);
        console.log(`[${type}] Length: ${text.length}`);
        console.log(`[${type}] Title in HTML:`, text.match(/<title>(.*?)<\/title>/)?.[1]);
        console.log(`[${type}] Contains '404':`, text.includes("404"));
        console.log(`[${type}] Contains 'not found':`, text.toLowerCase().includes("not found"));
        console.log("-------------------------------------------------");
    } catch (e) {
        console.log(`[${type}] Error:`, e.message);
    }
}

async function run() {
    await check("tt0848228", "VALID (Avengers)");
    await check("tt999999999999", "INVALID (Fake ID)");
}

run();
