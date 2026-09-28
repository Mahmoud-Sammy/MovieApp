"use client"

import { useSearchParams } from "next/navigation";
import { useState } from "react";
import useSWR from 'swr'
import Image from "next/image";

const fetcher = (url : any) => {
    return fetch(url).then((res) => {
        if(!res.ok) throw new Error("Failed To Fetch Data");
        return res.json();
    })
}

export default function DetailsPage(){
    const searchParams = useSearchParams();
    const id = searchParams.get("id");
    const mediaType = searchParams.get("media_type") || "movie"

    const [isModalOpen, setIsModalOpen] = useState(false);
    const apiKey = process.env.NEXT_PUBLIC_TMDB_API_KEY;
    
    const { data: media } = useSWR(
    id
        ? `https://api.themoviedb.org/3/${mediaType}/${id}?api_key=${apiKey}&language=en-US&append_to_response=credits`
        : null,
    fetcher
    );


    const { data: videos } = useSWR(
    id
        ? `https://api.themoviedb.org/3/${mediaType}/${id}/videos?api_key=${apiKey}&language=en-US`
        : null,
    fetcher
    );

        const { data: recommendations } = useSWR(
        id
            ? `https://api.themoviedb.org/3/${mediaType}/${id}/recommendations?api_key=${apiKey}&language=en-US`
            : null,
        fetcher
        );

        // find the first youtube trailer
        const trailer = videos?.results?.find(
        (v : any) => v.site === "YouTube" && v.type === "Trailer"
        );
        const trailerUrl = trailer
        ? `https://www.youtube.com/embed/${trailer.key}?autoplay=1`
        : null;
        


        const openModal = () => trailerUrl && setIsModalOpen(true);
        const closeModal = () => setIsModalOpen(false);
        const getTitle = () => (mediaType === "movie" ? media?.title : media?.name);

        const getDate = () =>
        mediaType === "movie" ? media?.release_date : media?.first_air_date;
        const getGenres = () => media?.genres?.map((g : any) => g.name).join(", ") || "N/A";
        const getRating = () => media?.vote_average?.toFixed(1) || "N/A";


        const getRunTime = () => {
        if (mediaType === "movie") {
            return media?.runtime
            ? `${Math.floor(media.runtime / 60)}h ${media.runtime % 60}m`
            : "N/A";
        }
        return media?.number_of_seasons ? `${media.number_of_seasons} Season(s)` : "N/A";
        };


    const getDirector = () => {
    if (mediaType === "movie") {
        return (
        media?.credits?.crew?.find((p : any) => p.job === "Director")?.name || "N/A"
        );
    }
    return media?.created_by?.map((p : any) => p.name).join(", ") || "N/A";
    };

    const getCast = () => media?.credits?.cast?.slice(0, 8) || [];

    if (!media)
    return <div className="text-white text-center mt-10">Loading...</div>;





    return (
    <div className="bg-black text-white min-h-screen">
        <section
                className="relative h-[240px] sm:h-[360px] md:h-[480px] w-full bg-cover bg-center z-0"
                style={{
                    backgroundImage: `url(https://image.tmdb.org/t/p/w1280${
                    media.backdrop_path || "/default-poster.jpg"
                    })`,
                }}
                >
                <div className="absolute inset-0 bg-gradient-to-b from-black/40 to-black/80"></div>
            </section>

            <section className="container mx-auto px-6 sm:px-12 md:px-40 rounded-b-lg z-10 relative mt-[-80px] sm:mt-[-120px] md:mt-[-160px]">
                <div className="bg-transparent flex flex-col md:flex-row gap-6 sm:gap-8 pt-4 pb-6 sm:pt-6 sm:pb-8 rounded-b-lg">
                    <div className="flex-none w-full max-w-[240px] sm:max-w-[300px] mx-auto md:mx-0 flex flex-col items-center">
                        <Image
                            src={
                                media.poster_path
                                ? `https://image.tmdb.org/t/p/w500${media.poster_path}`
                                : "/default-poster.jpg"
                            }
                            alt=""
                            width={300}
                            height={450}
                            className="object-cover rounded-lg w-full"
                            quality={90}
                            />


                            <button
                            onClick={openModal}
                            disabled={!trailerUrl}
                            className={`mt-4 w-full bg-yellow-400 text-black px-4 py-2 sm:px-6 sm:py-3 rounded-lg font-medium text-sm sm:text-base hover:bg-yellow-500 transition-colors ${
                                !trailerUrl
                                ? "opacity-50 cursor-not-allowed"
                                : "cursor-pointer"
                            }`}
                            >
                            Watch Trailer
                            </button>

                    </div>


                    <div className="flex-1">

                        <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold">
                            {getTitle()}
                        </h2>


                        <div className="flex items-center gap-3 sm:gap-4 mt-2">
                                <p className="text-xs sm:text-sm md:text-base text-yellow-400">
                                {getGenres()}
                                </p>

                                <p className="text-xs sm:text-sm md:text-base">
                                ⭐ {getRating()}
                                </p>
                        </div>

                            <p className="text-sm sm:text-base md:text-lg mt-4 sm:mt-6 text-gray-300">
                                {media.overview || "No description available"}
                            </p>

                            <div className="mt-4 sm:mt-6 space-y-1 sm:space-y-2">
                                    <p className="text-xs sm:text-sm md:text-base">
                                        <span className="font-medium">Duration: </span>
                                        <span className="text-gray-300">{getRunTime()}</span>
                                    </p>

                                    <p className="text-xs sm:text-sm md:text-base">
                                        <span className="font-medium">Release Date: </span>
                                        <span className="text-gray-300">{getDate()}</span>
                                    </p>

                                    <p className="text-xs sm:text-sm md:text-base">
                                        <span className="font-medium">{mediaType === "movie" ? "Director" : "Creator"}:</span>
                                        <span className="text-gray-300">{getDirector()}</span>
                                    </p>
                            </div>




                        <div className="mt-4 sm:mt-6">
                            <h3 className="text-base sm:text-lg md:text-xl font-semibold">Cast</h3>
                            <div className="flex flex-row overflow-x-auto gap-3 sm:gap-8 mt-3 sm:mt-4 pb-2">
                                {getCast().map((actor : any, index : number) => (
                                <div key={index} className="flex-none flex flex-col items-center w-16 sm:w-20">
                                    <Image
                                        alt=""
                                        width={64}
                                        height={64}
                                        className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-full"
                                        quality={90}
                                        src={actor.profile_path ? `https://image.tmdb.org/t/p/w200${actor.profile_path}` : "/default-profile.png"}
                                        />

                                        <p className="text-xs sm:text-sm text-center mt-1 sm:mt-2 line-clamp-2">{actor.name}</p>

                                </div>
                                ))}
                            </div>
                        </div>



                    </div>


                </div>

                {isModalOpen && trailerUrl && (
                        <div
                            className="fixed inset-0 bg-black/80 flex items-center justify-center z-50"
                            onClick={closeModal}
                        >
                            <div
                                className="relative w-full max-w-3xl aspect-video mx-4"
                                onClick={(e) => e.stopPropagation()}
                            >
                                <button
                                    onClick={closeModal}
                                    className="absolute -top-10 right-0 text-white text-2xl"
                                >
                                    ✕
                                </button>
                                <iframe
                                    src={trailerUrl}
                                    className="w-full h-full rounded-lg"
                                    allow="autoplay; encrypted-media"
                                    allowFullScreen
                                />
                            </div>
                        </div>
                    )}


            </section>



    </div>
    );
}