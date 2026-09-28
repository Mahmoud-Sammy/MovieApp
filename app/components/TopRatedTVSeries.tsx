import Card from "./Card";

async function fetchTopRatedTVSeries() {
    const apiKey = process.env.NEXT_PUBLIC_TMDB_API_KEY;
    const res = await fetch(`https://api.themoviedb.org/3/tv/top_rated?api_key=${apiKey}`);

    if (!res.ok) return [];

    const data = await res.json();
    const tvs = data.results
        ? data.results.slice(0, 5).map((tv: any) => ({ ...tv, media_type: "tv" }))
        : [];

    return tvs;
}

export default async function TopRatedTVSeries() {
    const tvs = await fetchTopRatedTVSeries();

    return (
        <section className="py-8 px-4 sm:px-8 md:px-20 bg-black text-white">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-yellow-400 mb-4">Top Rated TV Series</h2>

            <div className="flex overflow-x-auto gap-14 pb-4">
                {
                    tvs.length > 0 ? (
                        tvs.map((tv: any) => <Card key={tv.id} media={tv} />)
                    ) : (
                        <p className="text-gray-400">No Top Rated TV Series Found</p>
                    )
                }
            </div>
        </section>
    );
}