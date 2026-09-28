import Hero from "../app/components/Hero";
import TopRatedMovies from "../app/components/TopRatedMovies";
import TopRatedTVSeries from "../app/components/TopRatedTVSeries";
import TrendingMovies from "../app/components/TrendingMovies";
import TrendingTVSeries from "../app/components/TrendingTVSeries";
export default function Home() {
  return (
    <div className="text-white min-h-screen">
      <main>
        <Hero />
        <TrendingMovies />
        <TopRatedMovies />
        <TopRatedTVSeries />
        <TrendingTVSeries />
        
      </main>
    </div>
  );
}
