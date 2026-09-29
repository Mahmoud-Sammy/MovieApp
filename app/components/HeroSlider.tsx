"use client";

import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import type { Swiper as SwiperType } from "swiper";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import {
    Autoplay,
    Pagination,
    EffectFade,
} from "swiper/modules";
import { useState } from "react";
import TrailerModal from "./TrailerModal";
import useSWR from "swr";

interface Genre {
    id: number;
    name: string;
}

interface Media {
    id: number;
    title?: string;
    name?: string;
    media_type: "movie" | "tv";
    backdrop_path: string | null;
    overview?: string;
    vote_average: number;
    genres?: Genre[];
    runtime?: number;
}

interface Video {
    id: string;
    key: string;
    site: string;
    type: string;
    name: string;
}

interface VideosResponse {
    results: Video[];
}

interface HeroSliderProps {
    movies: Media[];
}

const fetcher = async <T,>(
    url: string
): Promise<T> => {
    const res = await fetch(url);

    if (!res.ok) {
        throw new Error(
            "Failed To Fetch Trailer"
        );
    }

    return res.json();
};

export default function HeroSliderTest({
    movies,
}: HeroSliderProps) {
    const [currentSlide, setCurrentSlide] =
        useState(0);

    const [swiperInstance, setSwiperInstance] =
        useState<SwiperType | null>(null);

    const [
        isTrailerModalOpen,
        setIsTrailerModalOpen,
    ] = useState(false);

    const [
        selectedMedia,
        setSelectedMedia,
    ] = useState<Media | null>(null);

    const getMediaTitle = (
        media: Media
    ): string => {
        return media.media_type === "movie"
            ? media.title || "Untitled"
            : media.name || "Untitled";
    };

    const getGenres = (
        media: Media
    ): string => {
        if (
            media.media_type === "movie" &&
            media.genres &&
            media.genres.length > 0
        ) {
            return media.genres
                .map((genre) => genre.name)
                .join(", ");
        }

        return "";
    };

    const formatDuration = (
        media: Media
    ): string => {
        if (
            media.media_type === "movie" &&
            media.runtime
        ) {
            const hours = Math.floor(
                media.runtime / 60
            );

            const minutes =
                media.runtime % 60;

            return `${hours}h ${minutes}m`;
        }

        return "";
    };

    const handleButtonClick = (
        index: number
    ) => {
        if (swiperInstance) {
            swiperInstance.slideToLoop(index);
            setCurrentSlide(index);
        }
    };

    const {
        data: trailerData,
    } = useSWR<VideosResponse>(
        selectedMedia
            ? `https://api.themoviedb.org/3/${selectedMedia.media_type}/${selectedMedia.id}/videos?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}&language=en-US`
            : null,
        fetcher
    );

    const trailer =
        trailerData?.results?.find(
            (video) =>
                video.site === "YouTube" &&
                video.type === "Trailer"
        );

    const trailerUrl = trailer
        ? `https://www.youtube.com/embed/${trailer.key}?autoplay=1`
        : null;

    const openModal = (
        media: Media
    ) => {
        setSelectedMedia(media);
        setIsTrailerModalOpen(true);
    };

    const closeMedia = () => {
        setIsTrailerModalOpen(false);
        setSelectedMedia(null);
    };

    return (
        <section className="relative min-h-[360px] sm:min-h-[480px] md:min-h-[720px] w-full">

            <Swiper
                modules={[
                    Autoplay,
                    Pagination,
                    EffectFade,
                ]}
                effect="fade"
                autoplay={{
                    delay: 5000,
                    disableOnInteraction: false,
                }}
                loop={movies.length > 1}
                onSlideChange={(swiper) =>
                    setCurrentSlide(
                        swiper.realIndex
                    )
                }
                onSwiper={(swiper) =>
                    setSwiperInstance(swiper)
                }
                className="h-full w-full"
            >
                {movies.map((media) => {
                    return (
                        <SwiperSlide
                            key={media.id}
                        >
                            <div className="relative w-full h-[360px] sm:h-[480px] md:h-[720px]">

                                <div
                                    className="absolute inset-0 bg-cover bg-center"
                                    style={{
                                        backgroundImage: `url(${
                                            media.backdrop_path
                                                ? `https://image.tmdb.org/t/p/w1280${media.backdrop_path}`
                                                : "/placeholder.jpg"
                                        })`,
                                    }}
                                />

                                <div className="absolute inset-0 bg-gradient-to-b from-black/40 to-black/80" />

                                <div className="absolute inset-0 flex items-center sm:items-end p-4 sm:p-8 md:p-20 text-white sm:max-w-xs md:max-w-2xl">

                                    <div>

                                        <Link
                                            href={`/details?id=${media.id}&media_type=${media.media_type}`}
                                        >
                                            <h1 className="text-2xl sm:text-2xl md:text-5xl font-bold leading-tight sm:leading-snug font-outfit">
                                                {getMediaTitle(
                                                    media
                                                )}
                                            </h1>
                                        </Link>

                                        <p className="text-sm sm:text-sm md:text-lg mt-0.5 sm:mt-2 text-yellow-400 font-semibold sm:leading-5">
                                            {getGenres(
                                                media
                                            )}
                                        </p>

                                        <p className="text-sm sm:text-sm md:text-lg mt-5 line-clamp-5 hidden sm:block sm:leading-5">
                                            {media.overview ||
                                                "No Description Available"}
                                        </p>

                                        <p className="text-sm sm:text-sm md:text-lg mt-5 sm:leading-5">

                                            <span className="pr-8 text-yellow-400">
                                                ★{" "}
                                                {media.vote_average.toFixed(
                                                    1
                                                )}
                                            </span>

                                            {media.media_type ===
                                                "movie" && (
                                                <>
                                                    <span className="mr-4">
                                                        |
                                                    </span>

                                                    <span>
                                                        {formatDuration(
                                                            media
                                                        )}
                                                    </span>
                                                </>
                                            )}

                                        </p>

                                        <button
                                            onClick={() =>
                                                openModal(
                                                    media
                                                )
                                            }
                                            disabled={
                                                !media.id
                                            }
                                            className={`mt-5 sm:mt-8 inline-block bg-yellow-400 text-black px-4 py-2 sm:px-4 sm:py-2 md:px-6 md:py-3 rounded-lg font-semibold hover:bg-yellow-500 transition text-sm sm:text-base md:text-base ${
                                                !media.id
                                                    ? "opacity-50 cursor-not-allowed"
                                                    : "cursor-pointer"
                                            }`}
                                        >
                                            Watch Trailer
                                        </button>

                                    </div>
                                </div>
                            </div>
                        </SwiperSlide>
                    );
                })}
            </Swiper>

            {movies.length > 1 && (
                <div className="absolute right-4 sm:right-8 md:right-12 top-1/2 -translate-y-1/2 flex flex-col gap-2 z-1">

                    {movies.map(
                        (_, index) => (
                            <button
                                key={index}
                                className={`w-4 h-4 sm:w-4 sm:h-4 md:w-5 md:h-5 rounded-full border-2 transition-colors ${
                                    currentSlide ===
                                    index
                                        ? "bg-amber-400 border-yellow-400"
                                        : "bg-transparent border-white"
                                }`}
                                onClick={() =>
                                    handleButtonClick(
                                        index
                                    )
                                }
                                aria-label={`slide ${
                                    index + 1
                                }`}
                            />
                        )
                    )}

                </div>
            )}

            {trailerUrl && (
                <TrailerModal
                    onClose={closeMedia}
                    trailerUrl={trailerUrl}
                    isOpen={
                        isTrailerModalOpen
                    }
                    title={
                        selectedMedia
                            ? getMediaTitle(
                                  selectedMedia
                              )
                            : "Trailer"
                    }
                />
            )}

        </section>
    );
}