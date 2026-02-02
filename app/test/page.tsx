
import prisma from "../utils/db";

export const dynamic = 'force-dynamic';

export default async function TestPage() {
    try {
        const movie = await prisma.movie.findFirst();
        console.log("Movie found:", movie);
        return (
            <div>
                <h1>VERIFICATION PAGE</h1>
                <p>Status: SUCCESS</p>
                <p>Movie Title: {movie ? movie.title : "No movie found"}</p>
            </div>
        );
    } catch (error: any) {
        console.error("Database connection error:", error);
        return (
            <div>
                <h1>VERIFICATION PAGE - ERROR</h1>
                <p>Status: FAILED</p>
                <pre>{JSON.stringify(error, Object.getOwnPropertyNames(error), 2)}</pre>
                <p>Error Message: {error?.message}</p>
            </div>
        );
    }
}
