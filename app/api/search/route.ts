
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/app/utils/db";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get("q");

    if (!query) {
        return NextResponse.json({ message: "Query required" }, { status: 400 });
    }

    try {
        const movies = await prisma.movie.findMany({
            where: {
                OR: [
                    {
                        title: {
                            contains: query,
                            mode: "insensitive",
                        },
                    },
                    {
                        overview: {
                            contains: query,
                            mode: "insensitive",
                        },
                    },
                ],
            },
            select: {
                id: true,
                title: true,
                age: true,
                duration: true,
                imageString: true,
                overview: true,
                release: true,
                videoSource: true,
                category: true,
                youtubeString: true,
            },
            take: 20, // Limit results
        });

        return NextResponse.json(movies);
    } catch (error) {
        console.error("Search API Error:", error);
        return NextResponse.json({ message: "Internal Error" }, { status: 500 });
    }
}
