
import prisma from "../utils/db";

export const dynamic = 'force-dynamic';

export default async function TestPage() {
    const movie = await prisma.movie.findFirst();
    console.log("Movie found:", movie);
    return (
        <div>
            <h1>VERIFICATION PAGE</h1>
            <p>Movie Title: {movie ? movie.title : "No movie found"}</p>
        </div>
    );
}
