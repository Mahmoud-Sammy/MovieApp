import Card from "./Card";

async function fetchTrendingTVSeries() {
    const apiKey = process.env.NEXT_PUBLIC_TMDB_API_KEY;
    const res = await fetch(`https://api.themoviedb.org/3/trending/tv/week?api_key=${apiKey}`);

    if (!res.ok) return [];

    const data = await res.json();
    const series = data.results ? data.results.slice(0, 5) : [];

    return series;
}

export default async function TrendingTVSeries() {
    const series = await fetchTrendingTVSeries();

    return (
        <section className="py-8 px-4 sm:px-8 md:px-20 bg-black text-white">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-yellow-400 mb-4">Trending Tv Series</h2>

            <div className="flex overflow-x-auto gap-14 pb-4">
                {
                    series.length > 0 ? (
                        series.map((item: any) => <Card key={item.id} media={item} />)
                    ) : (
                        <p className="text-gray-400">No TV Series Found</p>
                    )
                }
            </div>
        </section>
    );
}