import HeroSlider from "./HeroSlider";


async function fetchTrendingMovies(){
    const apiKey = process.env.NEXT_PUBLIC_TMDB_API_KEY;
    const res = await fetch(`https://api.themoviedb.org/3/trending/movie/week?api_key=${apiKey}`);

    if(res.ok){
        const data = await res.json();
        const movies = data.results ? data.results.slice(0, 3) : []

        const detailedMovies = await Promise.all(
            movies.map(async (movie : any) => {
                if(movie.media_type === "movie"){
                    const detailedMovieRes = await fetch(`https://api.themoviedb.org/3/movie/${movie.id}?api_key=${apiKey}`)
                    if(detailedMovieRes.ok){
                        const detailedMovieData = await detailedMovieRes.json();

                    return{
                        ...movie,
                        genres : detailedMovieData.genres,
                        runtime : detailedMovieData.runtime
                    }

                    }
                }
                return movie;
            })
            
        )
        return detailedMovies;
    }else{
        return [];
    }
}

export default async function Hero(){
    const movies = await fetchTrendingMovies();

    return <HeroSlider movies={movies} />;
}