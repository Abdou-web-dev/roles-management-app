import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="py-36 flex gap-4 items-center justify-center flex-col">
      <h2 className="roboto-bold text-xl text-red-600 font-bold">
        404 - Not Found
      </h2>
      <p className="roboto-light text-3xl">
        The page you're looking for does not exist.
      </p>
      <Link
        to={`/`}
        className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-full"
      >
        Home
      </Link>
    </div>
  );
};

export default NotFound;
