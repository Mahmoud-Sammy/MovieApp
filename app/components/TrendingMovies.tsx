import Card from "./Card";

type Movie = {
    id: number;
    title: string;
    overview: string;
    poster_path: string | null;
    backdrop_path: string | null;
    vote_average: number;
    release_date: string;
    media_type: "movie";
};

async function fetchTrendingMovies() {
    const apiKey = process.env.NEXT_PUBLIC_TMDB_API_KEY;
    const res = await fetch(`https://api.themoviedb.org/3/trending/movie/week?api_key=${apiKey}`);

    if (!res.ok) return [];

    const data = await res.json();
    const movies = data.results ? data.results.slice(0, 5) : [];

    return movies;
}

export default async function TrendingMovies() {
    const movies = await fetchTrendingMovies();

    return (
        <section className="py-8 px-4 sm:px-8 md:px-20 bg-black text-white">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-yellow-400 mb-4">Trending Movies</h2>

            <div className="flex overflow-x-auto gap-14 pb-4">
                {
                    movies.length > 0 ? (
                        movies.map((movie: Movie) => <Card key={movie.id} media={movie} />)
                    ) : (
                        <p className="text-gray-400">No Movies Found</p>
                    )
                }
            </div>
        </section>
    );
}