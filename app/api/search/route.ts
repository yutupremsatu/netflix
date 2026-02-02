import prisma from "@/app/utils/db";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q");

    if (!query) {
        return NextResponse.json([]);
    }

    const movies = await prisma.movie.findMany({
        where: {
            OR: [
                { title: { contains: query, mode: "insensitive" as any } },
                { overview: { contains: query, mode: "insensitive" as any } },
            ],
        },
        select: {
            id: true,
            title: true,
            imageString: true,
            release: true,
            duration: true,
            age: true,
            youtubeString: true,
            videoSource: true,
            overview: true,
        },
        take: 20,
    });

    return NextResponse.json(movies);
}
