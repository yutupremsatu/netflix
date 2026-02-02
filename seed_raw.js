
const { Client } = require('pg');
const connectionString = "postgresql://postgres.riesqqctsavzpprucbal:%23uTzRMmmnED83Nc@aws-1-us-east-1.pooler.supabase.com:6543/postgres";

const movies = [
    // ... (previous movies 0-31 included here plus new ones)
    { id: 0, title: "Gran Turismo", age: 12, duration: 2.15, overview: "Wish-fulfillment tale of a teenage Gran Turismo player turned pro racecar driver.", videoSource: "https://vidsrc.to/embed/movie/980489", imageString: "https://image.tmdb.org/t/p/original/r7DuyYJ0N3cD8bRKsR5Ygq2P7oa.jpg", release: 2023, category: "recent", youtubeString: "https://www.youtube.com/embed/GVPzGBvPrzw" },
    { id: 1, title: "A Haunting in Venice", age: 12, duration: 1.44, overview: "Hercule Poirot reluctantly attends a Halloween séance at a decaying, haunted palazzo.", imageString: "https://image.tmdb.org/t/p/original/kHlX3oqdD4VGaLpB8O78M25KfdS.jpg", release: 2023, videoSource: "https://vidsrc.to/embed/movie/945729", category: "recent", youtubeString: "https://www.youtube.com/embed/yEddsSwweyE" },
    { id: 2, title: "Five Nights at Freddy's", age: 16, duration: 1.5, overview: "A troubled young man named Mike agrees to take a position as a night security guard at Freddy Fazbear's Pizzeria.", imageString: "https://image.tmdb.org/t/p/original/t5zCBSB5xMDKcDqe91qahCOUYVV.jpg", release: 2023, videoSource: "https://vidsrc.to/embed/movie/507089", category: "recent", youtubeString: "https://www.youtube.com/embed/0VH9WCFV6XQ" },
    { id: 3, title: "The Blacklist", age: 16, duration: 0, imageString: "https://image.tmdb.org/t/p/original/dDPwCyZG8arYwMDoQl0sm4xccCE.jpg", overview: "Raymond Reddington surrenders in person at FBI Headquarters with a list of the world's most dangerous criminals.", release: 2013, videoSource: "https://vidsrc.to/embed/tv/46952", category: "show", youtubeString: "https://www.youtube.com/embed/-WYdUaK54fU" },
    { id: 4, title: "Suits", age: 12, duration: 0, imageString: "https://image.tmdb.org/t/p/original/or0E36KfzJYZwqXeiCfm1JgepKF.jpg", overview: "A brilliant college-dropout recognized for his raw talent and photographic memory gets hired by Harvey Specter.", release: 2011, videoSource: "https://vidsrc.to/embed/tv/37680", category: "show", youtubeString: "https://www.youtube.com/embed/85z53bAebsI" },
    { id: 5, title: "Chernobyl", age: 16, duration: 0, imageString: "https://image.tmdb.org/t/p/original/900tHlUYUkp7Ol04XFSoAaEIXcT.jpg", overview: "The true story of one of the worst man-made catastrophes in history.", release: 2019, videoSource: "https://vidsrc.to/embed/tv/87108", category: "show", youtubeString: "https://www.youtube.com/embed/s9APLXM9Ei8" },
    { id: 6, title: "Retribution", age: 12, duration: 1.31, imageString: "https://image.tmdb.org/t/p/original/iiXliCeykkzmJ0Eg9RYJ7F2CWSz.jpg", overview: "Matt Turner begins a high-speed chase across the city to complete a series of tasks- all with his kids in the back.", release: 2023, videoSource: "https://vidsrc.to/embed/movie/762430", category: "recent", youtubeString: "https://www.youtube.com/embed/jzQn0-WH4WM" },
    { id: 7, title: "Spider-Man: Across the Spider-Verse", age: 12, duration: 2.2, imageString: "https://image.tmdb.org/t/p/original/nGxUxi3PfXDRm7Vg95VBNgNM8yc.jpg", overview: "Miles Morales catapults across the Multiverse, where he encounters a team of Spider-People.", release: 2023, videoSource: "https://vidsrc.to/embed/movie/569094", category: "movie", youtubeString: "https://www.youtube.com/embed/shW9i6k8cB0" },
    { id: 8, title: "Coco", age: 0, duration: 1.45, imageString: "https://image.tmdb.org/t/p/original/askg3SMvhqEl4OL52YuvdtY40Yb.jpg", overview: "Miguel dreams of becoming a musician like his idol, Ernesto de la Cruz, in the Land of the Dead.", release: 2017, videoSource: "https://vidsrc.to/embed/movie/354912", category: "movie", youtubeString: "https://www.youtube.com/embed/xlnPHQ3TLX8" },
    { id: 10, title: "Family Guy", age: 16, duration: 0, imageString: "https://image.tmdb.org/t/p/original/y4PDksvxM05sNxacoU8xIYITCDA.jpg", overview: "The adventures of the dysfunctional Griffin family in Quahog.", release: 1999, videoSource: "https://vidsrc.to/embed/tv/1434", category: "show", youtubeString: "https://www.youtube.com/embed/7hRxWGo49oc" },
    { id: 11, title: "The Super Mario Bros. Movie", age: 0, duration: 1.32, imageString: "https://image.tmdb.org/t/p/original/qNBAXmqAFebmfnjBTMpS8WjQpWg.jpg", overview: "Brooklyn plumbers Mario and Luigi wander into a magical new world.", release: 2023, videoSource: "https://vidsrc.to/embed/movie/502356", category: "movie", youtubeString: "https://www.youtube.com/embed/TnGl01FkMMo" },
    { id: 12, title: "Barbie", age: 12, duration: 1.54, imageString: "https://image.tmdb.org/t/p/original/iuFNmBTD0X4EXI0V9QpKnoYzsi.jpg", overview: "Barbie and Ken discover the perils of living among humans.", release: 2023, videoSource: "https://vidsrc.to/embed/movie/346698", category: "movie", youtubeString: "https://www.youtube.com/embed/pBk4NYhWNMM" },
    { id: 13, title: "Oppenheimer", age: 16, duration: 3.0, imageString: "https://image.tmdb.org/t/p/original/8GxvynZTMBLS91IrR2MPvO0MBob.jpg", overview: "J. Robert Oppenheimer's role in the development of the atomic bomb.", release: 2023, videoSource: "https://vidsrc.to/embed/movie/872585", category: "movie", youtubeString: "https://www.youtube.com/embed/uYPbbksJxIg" },
    { id: 14, title: "Avatar: The Way of Water", age: 12, duration: 3.12, imageString: "https://image.tmdb.org/t/p/original/t6HIqrRAclMCA60NsSmeqe9RmNV.jpg", overview: "Jake Sully lives with his newfound family on Pandora.", release: 2022, videoSource: "https://vidsrc.to/embed/movie/76600", category: "movie", youtubeString: "https://www.youtube.com/embed/d9MyW72ELq0" },
    { id: 15, title: "Top Gun: Maverick", age: 12, duration: 2.1, imageString: "https://image.tmdb.org/t/p/original/628RefbbAnD2mZ024Rf0KBE1Pcm.jpg", overview: "Pete Mitchell pushes the envelope as a courageous test pilot.", release: 2022, videoSource: "https://vidsrc.to/embed/movie/361743", category: "movie", youtubeString: "https://www.youtube.com/embed/giXco2jaZ_4" },
    { id: 16, title: "The Dark Knight", age: 16, duration: 2.32, imageString: "https://image.tmdb.org/t/p/original/qJ2tW6WMUDp9QZk3yqc06P6YOVZ.jpg", overview: "Batman sets out to dismantle the remaining criminal organizations in Gotham.", release: 2008, videoSource: "https://vidsrc.to/embed/movie/155", category: "movie", youtubeString: "https://www.youtube.com/embed/EXeTwQWaywY" },
    { id: 17, title: "Inception", age: 12, duration: 2.22, imageString: "https://image.tmdb.org/t/p/original/o0IjiqbeERvY66vR47p2XpU9H2x.jpg", overview: "A skilled thief is offered a chance to have his criminal record erased.", release: 2010, videoSource: "https://vidsrc.to/embed/movie/27205", category: "movie", youtubeString: "https://www.youtube.com/embed/YoHD9XEInc0" },
    { id: 18, title: "The Last of Us", age: 18, duration: 0, imageString: "https://image.tmdb.org/t/p/original/uKvH56miDbis6pC9q9L8H87vRYU.jpg", overview: "Joel, a hardened survivor, smuggled Ellie, a 14-year-old girl, out of a quarantine zone.", release: 2023, videoSource: "https://vidsrc.to/embed/tv/100088", category: "show", youtubeString: "https://www.youtube.com/embed/uLtkt8BonwM" },
    { id: 19, title: "The Boys", age: 18, duration: 0, imageString: "https://image.tmdb.org/t/p/original/stTEycfY9G9zG6vM96M5B0986Ug.jpg", overview: "Vigilantes set out to take down corrupt superheroes who abuse their superpowers.", release: 2019, videoSource: "https://vidsrc.to/embed/tv/76479", category: "show", youtubeString: "https://www.youtube.com/embed/M1bhOaLv4FU" },
    { id: 20, title: "Stranger Things", age: 16, duration: 0, imageString: "https://image.tmdb.org/t/p/original/49WpLuvv1HjHdg5w9u69ZkyO6qb.jpg", overview: "Secret experiments and terrifying supernatural forces in a small town.", release: 2016, videoSource: "https://vidsrc.to/embed/tv/66732", category: "show", youtubeString: "https://www.youtube.com/embed/b9EkMc79ZSU" },
    { id: 21, title: "Wednesday", age: 12, duration: 0, imageString: "https://image.tmdb.org/t/p/original/99vBORoA99S8UvP6v9mY3lR8P2J.jpg", overview: "Wednesday Addams attempts to master her psychic ability at Nevermore Academy.", release: 2022, videoSource: "https://vidsrc.to/embed/tv/119051", category: "show", youtubeString: "https://www.youtube.com/embed/Q73UhutHJwo" },
    { id: 22, title: "One Piece", age: 12, duration: 0, imageString: "https://image.tmdb.org/t/p/original/r7v9zi9oG21vY9PxpntvAbvS6S5.jpg", overview: "Monkey D. Luffy goes on an epic voyage for treasure in this live-action adaptation.", release: 2023, videoSource: "https://vidsrc.to/embed/tv/111110", category: "show", youtubeString: "https://www.youtube.com/embed/AqyXp6SkeEw" },
    { id: 32, title: "Avengers: Endgame", age: 12, duration: 3.01, imageString: "https://image.tmdb.org/t/p/original/or0E36KfzJYZwqXeiCfm1JgepKF.jpg", overview: "The Avengers assemble once more in order to undo Thanos' actions and restore order to the universe.", release: 2019, videoSource: "https://vidsrc.to/embed/movie/299534", category: "movie", youtubeString: "https://www.youtube.com/embed/TcMBFSGVi1c" },
    { id: 33, title: "Iron Man", age: 12, duration: 2.06, imageString: "https://image.tmdb.org/t/p/original/786vVpWvIof21u17Yp0W8xJ7rA7.jpg", overview: "Tony Stark creates a powered suit of armor to fight evil.", release: 2008, videoSource: "https://vidsrc.to/embed/movie/1726", category: "movie", youtubeString: "https://www.youtube.com/embed/8hYlB38asgnI" },
    { id: 34, title: "The Matrix", age: 16, duration: 2.16, imageString: "https://image.tmdb.org/t/p/original/f89U3z9vYidpSqcARYygCDj8Rv9.jpg", overview: "A computer hacker learns from mysterious rebels about the true nature of his reality.", release: 1999, videoSource: "https://vidsrc.to/embed/movie/603", category: "movie", youtubeString: "https://www.youtube.com/embed/vKQi3bBA1y8" },
    { id: 35, title: "John Wick", age: 18, duration: 1.41, imageString: "https://image.tmdb.org/t/p/original/pA3vE9Sfo2v3tP8x9R4AgY79WqB.jpg", overview: "An ex-hit-man comes out of retirement to track down the gangsters that killed his dog.", release: 2014, videoSource: "https://vidsrc.to/embed/movie/245891", category: "movie", youtubeString: "https://www.youtube.com/embed/c0PBmbM3q30" },
    { id: 36, title: "Interstellar", age: 12, duration: 2.49, imageString: "https://image.tmdb.org/t/p/original/gEU2QniE6E07Qv8ueNGJuGCOo6.jpg", overview: "Explorers travel through a wormhole in space in an attempt to ensure humanity's survival.", release: 2014, videoSource: "https://vidsrc.to/embed/movie/157336", category: "movie", youtubeString: "https://www.youtube.com/embed/zSWdZVtXT7E" },
    { id: 37, title: "Gladiator", age: 16, duration: 2.35, imageString: "https://image.tmdb.org/t/p/original/ty8TGRvS4WqYp9pt9OBmS58MLJS.jpg", overview: "A former Roman General sets out to exact vengeance against the corrupt emperor who murdered his family.", release: 2000, videoSource: "https://vidsrc.to/embed/movie/98", category: "movie", youtubeString: "https://www.youtube.com/embed/P5ieIbInFpg" },
    { id: 38, title: "The Godfather", age: 18, duration: 2.55, imageString: "https://image.tmdb.org/t/p/original/3bhkrjOiERoSTq9L9vP4NoP1YmI.jpg", overview: "The aging patriarch of an organized crime dynasty transfers control of his clandestine empire to his reluctant son.", release: 1972, videoSource: "https://vidsrc.to/embed/movie/238", category: "movie", youtubeString: "https://www.youtube.com/embed/sY1S34973zA" },
    { id: 39, title: "Forest Gump", age: 12, duration: 2.22, imageString: "https://image.tmdb.org/t/p/original/arw2vcBveWOVZr6pxm9LpEVMww6.jpg", overview: "The presidencies of Kennedy and Johnson, the Vietnam War, the Watergate scandal and other historical events unfold from the perspective of an Alabama man.", release: 1994, videoSource: "https://vidsrc.to/embed/movie/13", category: "movie", youtubeString: "https://www.youtube.com/embed/bLvqoHBptjg" },
    { id: 40, title: "Shrek", age: 0, duration: 1.3, imageString: "https://image.tmdb.org/t/p/original/dyhaZeOqqwu04S0pCbcIvGGXQAs.jpg", overview: "A mean-spirited ogre manages to rescue a princess who is more than she appears to be.", release: 2001, videoSource: "https://vidsrc.to/embed/movie/808", category: "movie", youtubeString: "https://www.youtube.com/embed/cwXfv25x68E" },
    { id: 41, title: "Finding Nemo", age: 0, duration: 1.4, imageString: "https://image.tmdb.org/t/p/original/e9T0uYl20A77AnXjK7K3vFieXvD.jpg", overview: "After his son is captured in the Great Barrier Reef and taken to Sydney, a timid clownfish sets out on a journey to bring him home.", release: 2003, videoSource: "https://vidsrc.to/embed/movie/12", category: "movie", youtubeString: "https://www.youtube.com/embed/2zLkasSlo74" },
    { id: 42, title: "Moana", age: 0, duration: 1.47, imageString: "https://image.tmdb.org/t/p/original/7WsyChvRStvS07v30S0z7p9ad9G.jpg", overview: "In Ancient Polynesia, when a terrible curse incurred by the Demigod Maui reaches Moana's island, she answers the Ocean's call.", release: 2016, videoSource: "https://vidsrc.to/embed/movie/277834", category: "movie", youtubeString: "https://www.youtube.com/embed/LKFuXETZUsI" },
    { id: 43, title: "Demon Slayer", age: 16, duration: 0, imageString: "https://image.tmdb.org/t/p/original/969U09vC8Yp7W83iUOfSsh7G9X7.jpg", overview: "A youth who becomes a demon slayer after his family is slaughtered and his younger sister is turned into a demon.", release: 2019, videoSource: "https://vidsrc.to/embed/tv/85937", category: "show", youtubeString: "https://www.youtube.com/embed/VQGCKyvzIM4" },
    { id: 44, title: "Jujutsu Kaisen", age: 16, duration: 0, imageString: "https://image.tmdb.org/t/p/original/A879v88vT1fS6e5Xk5O6L7Q8UfO.jpg", overview: "A boy swallows a cursed talisman - the finger of a demon - and becomes cursed himself.", release: 2020, videoSource: "https://vidsrc.to/embed/tv/95479", category: "show", youtubeString: "https://www.youtube.com/embed/O6qVAbDAs9k" },
    { id: 45, title: "Attack on Titan", age: 18, duration: 0, imageString: "https://image.tmdb.org/t/p/original/hSTrG3S9v9S9vS9vS9vS9vS9.jpg", overview: "Humanity lives inside cities surrounded by enormous walls due to the Titans, gigantic humanoid beings who eat humans.", release: 2013, videoSource: "https://vidsrc.to/embed/tv/1429", category: "show", youtubeString: "https://www.youtube.com/embed/MGRm4IzK1SQ" },
    { id: 46, title: "Squid Game", age: 18, duration: 0, imageString: "https://image.tmdb.org/t/p/original/d976378e9b0b4b8b9b0b0b0b0b.jpg", overview: "Hundreds of cash-strapped players accept a strange invitation to compete in children's games.", release: 2021, videoSource: "https://vidsrc.to/embed/tv/115036", category: "show", youtubeString: "https://www.youtube.com/embed/oqxAJKy0II4" },
    { id: 47, title: "Money Heist", age: 18, duration: 0, imageString: "https://image.tmdb.org/t/p/original/reAsS9mS9mS9mS9mS9mS9mS9m.jpg", overview: "An unusual group of robbers attempt to carry out the most perfect robbery in Spanish history - stealing 2.4 billion euros from the Royal Mint of Spain.", release: 2017, videoSource: "https://vidsrc.to/embed/tv/71446", category: "show", youtubeString: "https://www.youtube.com/embed/hMANIarjT50" },
    { id: 48, title: "Dark", age: 16, duration: 0, imageString: "https://image.tmdb.org/t/p/original/ap8mS9mS9mS9mS9mS9mS9mS9m.jpg", overview: "A family saga with a supernatural twist, set in a German town, where the disappearance of two young children exposes the relationships among four families.", release: 2017, videoSource: "https://vidsrc.to/embed/tv/70523", category: "show", youtubeString: "https://www.youtube.com/embed/rrwycJ08PSA" }
];

async function seed() {
    const client = new Client({
        connectionString: connectionString,
        ssl: { rejectUnauthorized: false }
    });

    try {
        await client.connect();
        console.log("Connected for seeding.");

        for (const movie of movies) {
            const sql = `
        INSERT INTO "Movie" (id, title, age, duration, overview, "imageString", release, "videoSource", category, "youtubeString")
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
        ON CONFLICT (id) DO UPDATE SET
          title = EXCLUDED.title,
          age = EXCLUDED.age,
          duration = EXCLUDED.duration,
          overview = EXCLUDED.overview,
          "imageString" = EXCLUDED."imageString",
          release = EXCLUDED.release,
          "videoSource" = EXCLUDED."videoSource",
          category = EXCLUDED.category,
          "youtubeString" = EXCLUDED."youtubeString"
      `;
            const values = [
                movie.id, movie.title, movie.age, movie.duration, movie.overview,
                movie.imageString, movie.release, movie.videoSource, movie.category, movie.youtubeString
            ];
            await client.query(sql, values);
            console.log("Seeded movie: " + movie.title);
        }

        console.log("Seeding completed successfully.");
        await client.end();
    } catch (err) {
        console.error("Seeding error:", err.message);
    }
}

seed();
