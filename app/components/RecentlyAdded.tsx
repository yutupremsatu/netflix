import Image from "next/image";
import prisma from "../utils/db";
import { MovieCard } from "./MovieCard";
import { getServerSession } from "next-auth";
import { authOptions } from "../utils/auth";

const PAGE_SIZE = 20;

async function getData(userId: string, page: number = 1) {
  const skip = (page - 1) * PAGE_SIZE;

  const [data, total] = await Promise.all([
    prisma.movie.findMany({
      skip: skip,
      take: PAGE_SIZE,
      select: {
        id: true,
        overview: true,
        title: true,
        WatchLists: {
          where: {
            userId: userId,
          },
        },
        videoSource: true,
        imageString: true,
        youtubeString: true,
        age: true,
        release: true,
        duration: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    }),
    prisma.movie.count()
  ]);

  return { data, total };
}

export default async function RecentlyAdded({ page = 1 }: { page?: number }) {
  const session = await getServerSession(authOptions);
  const { data, total } = await getData(session?.user?.email as string, page);
  const totalPages = Math.ceil(total / PAGE_SIZE);

  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 mt-8 gap-6">
        {data.map((movie) => (
          <div key={movie.id} className="relative h-48">
            <Image
              src={movie.imageString}
              alt="Movie"
              width={500}
              height={400}
              className="rounded-sm absolute w-full h-full object-cover"
            />

            <div className="h-60 relative z-10 w-full transform transition duration-500 hover:scale-125 opacity-0 hover:opacity-100">
              <div className="bg-gradient-to-b from-transparent via-black/50 to-black z-10 w-full h-full rounded-lg flex items-center justify-center border">
                <Image
                  src={movie.imageString}
                  alt="Movie"
                  width={800}
                  height={800}
                  className="absolute w-full h-full -z-10 rounded-lg object-cover"
                />

                <MovieCard
                  movieId={movie.id}
                  overview={movie.overview}
                  title={movie.title}
                  wachtListId={movie.WatchLists[0]?.id}
                  youtubeUrl={movie.youtubeString}
                  watchList={movie.WatchLists.length > 0 ? true : false}
                  key={movie.id}
                  age={movie.age}
                  time={movie.duration}
                  year={movie.release}
                  videoSource={movie.videoSource}
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination Controls */}
      <div className="flex justify-center items-center gap-4 mt-8 mb-10">
        {page > 1 && (
          <a href={`/home/page/${page - 1}`} className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition">
            Previous
          </a>
        )}
        <span className="text-white font-semibold">
          Page {page} of {totalPages}
        </span>
        {page < totalPages && (
          <a href={`/home/page/${page + 1}`} className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition">
            Next
          </a>
        )}
      </div>
    </div>
  );
}
