
import prisma from "../utils/db";

export const dynamic = 'force-dynamic';
const VERSION = "1.0.5 - DIRECT CONNECTION ATTEMPT";

export default async function TestPage() {
    const dbUrl = process.env.DATABASE_URL || "NOT_SET";
    const maskedUrl = dbUrl.replace(/:[^@]+@/, ':****@');

    try {
        // Run raw query to list tables
        const tables: any = await prisma.$queryRaw`SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'`;
        const tableNames = tables.map((t: any) => t.table_name);

        return (
            <div>
                <h1>VERIFICATION PAGE (v{VERSION})</h1>
                <p>Status: SUCCESS (Connected to DB)</p>
                <p>DATABASE_URL: {maskedUrl}</p>
                <p>Tables found: {tableNames.join(", ") || "NONE"}</p>
                {tableNames.includes("Movie") && (
                    <p>Movie table is VISIBLE.</p>
                )}
            </div>
        );
    } catch (error: any) {
        return (
            <div>
                <h1>VERIFICATION PAGE (v{VERSION}) - ERROR</h1>
                <p>Status: FAILED</p>
                <p>DATABASE_URL: {maskedUrl}</p>
                <pre>{JSON.stringify(error, Object.getOwnPropertyNames(error), 2)}</pre>
                <p>Error Message: {error?.message}</p>
            </div>
        );
    }
}
