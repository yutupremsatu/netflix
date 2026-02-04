
const fs = require('fs');

async function check(id, type) {
    const url = `https://vidsrc.xyz/embed/movie/${id}`;
    let log = `Checking ${type} (${id})...\n`;

    try {
        const res = await fetch(url);
        const text = await res.text();

        log += `[${type}] Status: ${res.status}\n`;
        log += `[${type}] Length: ${text.length}\n`;
        log += `[${type}] Title: ${text.match(/<title>(.*?)<\/title>/)?.[1]}\n`;
        log += `[${type}] Body has '404': ${text.includes("404")}\n`;
        log += `-------------------------------------------------\n`;
    } catch (e) {
        log += `[${type}] Error: ${e.message}\n`;
    }
    fs.appendFileSync('vidsrc_debug.log', log);
}

async function run() {
    fs.writeFileSync('vidsrc_debug.log', 'START DEBUG\n');
    await check("tt0848228", "VALID");
    await check("tt999999999999", "INVALID");
}

run();
