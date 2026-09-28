import Card from "./Card";

async function fetchTopRatedMovies() {
    const apiKey = process.env.NEXT_PUBLIC_TMDB_API_KEY;
    const res = await fetch(`https://api.themoviedb.org/3/movie/top_rated?api_key=${apiKey}`);

    if (!res.ok) return [];

    const data = await res.json();
    const movies = data.results
        ? data.results.slice(0, 5).map((movie: any) => ({ ...movie, media_type: "movie" }))
        : [];

    return movies;
}

export default async function TopRatedMovies() {
    const movies = await fetchTopRatedMovies();

    return (
        <section className="py-8 px-4 sm:px-8 md:px-20 bg-black text-white">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-yellow-400 mb-4">Top Rated Movies</h2>

            <div className="flex overflow-x-auto gap-14 pb-4">
                {
                    movies.length > 0 ? (
                        movies.map((movie: any) => <Card key={movie.id} media={movie} />)
                    ) : (
                        <p className="text-gray-400">No Top Rated Movies Found</p>
                    )
                }
            </div>
        </section>
    );
}