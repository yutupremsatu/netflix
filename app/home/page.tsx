import MovieVideo from "../components/MovieVideo";
import Navbar from "../components/Navbar";
import RecentlyAdded from "../components/RecentlyAdded";

const Copyright = () => (
  <div className="mt-6 text-gray-500 text-xs text-center">
    &copy; yutupremsatu 2024
    <br />
    <a
      href="https://github.com/yutupremsatu"
      className="text-gray-500 hover:text-white"
      target="_blank"
      rel="noopener noreferrer"
    >
      GitHub
    </a>
  </div>
);

export default function HomePage() {
  return (
    <div className="p-5 lg:p-0">
      {/* <MovieVideo /> */}
      <h1 className="text-3xl font-bold">Recently Added</h1>
      <RecentlyAdded />
      <br></br>
      <br></br>

      <div className="mt-6">
        <Copyright />
      </div>
    </div>
  );
}
