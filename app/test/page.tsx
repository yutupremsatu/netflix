
import prisma from "../utils/db";

export const dynamic = 'force-dynamic';

export default async function TestPage() {
    // Mask the password in the URL for security
    const dbUrl = process.env.DATABASE_URL || "NOT_SET";
    const maskedUrl = dbUrl.replace(/:[^@]+@/, ':****@');
    const directUrl = process.env.DIRECT_URL || "NOT_SET";
    const maskedDirectUrl = directUrl.replace(/:[^@]+@/, ':****@');

    try {
        const movie = await prisma.movie.findFirst();
        return (
            <div>
                <h1>VERIFICATION PAGE</h1>
                <p>Status: SUCCESS</p>
                <p>DATABASE_URL: {maskedUrl}</p>
                <p>DIRECT_URL: {maskedDirectUrl}</p>
                <p>Movie Title: {movie ? movie.title : "No movie found"}</p>
            </div>
        );
    } catch (error: any) {
        return (
            <div>
                <h1>VERIFICATION PAGE - ERROR</h1>
                <p>Status: FAILED</p>
                <p>DATABASE_URL: {maskedUrl}</p>
                <p>DIRECT_URL: {maskedDirectUrl}</p>
                <pre>{JSON.stringify(error, Object.getOwnPropertyNames(error), 2)}</pre>
                <p>Error Message: {error?.message}</p>
            </div>
        );
    }
}
