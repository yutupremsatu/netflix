
import MovieVideo from "../../../components/MovieVideo";
import RecentlyAdded from "../../../components/RecentlyAdded";

const Copyright = () => (
    <div className="mt-6 text-gray-500 text-xs text-center">
        &copy; yutupremsatu 2024
        <br />
        <a
            href="https://github.com/yutupremsatu/netflix"
            className="text-gray-500 hover:text-white"
            target="_blank"
            rel="noopener noreferrer"
        >
            yutupremsatu
        </a>
    </div>
);

export default function PaginationPage({ params }: { params: { page: string } }) {
    const page = parseInt(params.page) || 1;

    return (
        <div className="p-5 lg:p-0">
            {/* Hide Hero Video on pages > 1 to focus on browsing, or keep it? User didn't specify. Keeping consistent layout. */}
            {page === 1 && <MovieVideo />}

            <h1 className="text-3xl font-bold">Recently Added (Page {page})</h1>
            <RecentlyAdded page={page} />

            <br></br>
            <br></br>

            <div className="mt-6">
                <Copyright />
            </div>
        </div>
    );
}
