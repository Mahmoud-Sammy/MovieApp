"use client"
import  useSWR from "swr";
import MediaDisplay from "../components/MediaDisplay";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useEffect, useState, useMemo } from "react";
import Pagination from "../components/Pagination";
import Filter from "../components/Filter";

interface MediaItem {
    id: number;
    title?: string;
    name?: string;
    poster_path: string | null;
    vote_average?: number;
    media_type?: string;
    first_air_date?: string;
    release_date?: string;
    genre_ids?: number[];
    original_language?: string;
}

interface MediaDisplayProps {
    items: MediaItem[];
}

const fetcher = (url : any) => {
    return fetch(url).then((res) => {
        if(!res.ok) throw new Error("Failed To Fetch Data");
        return res.json();
    })
}


const yearRanges = {
    2025: { gte: "2025-01-01", lte: "2025-12-31" },
    2024: { gte: "2024-01-01", lte: "2024-12-31" },
    "2020-now": { gte: "2020-01-01" },
    "2010-2019": { gte: "2010-01-01", lte: "2019-12-31" },
    "2000-2009": { gte: "2000-01-01", lte: "2009-12-31" },
    "1990-1999": { gte: "1990-01-01", lte: "1999-12-31" },
};



export default function MoviePage(){

    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const [page, setPage] = useState(1);


    useEffect(() => {
        const pageParam = parseInt(searchParams.get("page") || "1", 10);
        setPage(isNaN(pageParam) || pageParam < 1 ? 1 : pageParam)
    }, [searchParams])



    const genre = searchParams.get("genre") || "all"
    const year = searchParams.get("year") || "all"
    const rating = searchParams.get("rating") || "all"
    const language = searchParams.get("language") || "all"
    const sortBy = searchParams.get("sortBy") || "popularity.desc"
    const query = searchParams.get("query") || ""

    const yearRange = yearRanges[year as keyof typeof yearRanges] || {};


const baseUrl = query
        ? `https://api.themoviedb.org/3/search/tv?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}&query=${encodeURIComponent(query)}`
        : `https://api.themoviedb.org/3/discover/tv?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}`;

    const apiUrl = new URL(baseUrl);
    apiUrl.searchParams.set("page", page.toString());

    if (!query) {
        if (genre !== "all") apiUrl.searchParams.set("with_genres", genre);
        if (language !== "all") apiUrl.searchParams.set("with_original_language", language);
        if (rating !== "all") apiUrl.searchParams.set("vote_average.gte", rating);
        if (sortBy) apiUrl.searchParams.set("sort_by", sortBy);
        if (yearRange.gte) apiUrl.searchParams.set("first_air_date.gte", yearRange.gte);
        if ("lte" in yearRange && yearRange.lte) apiUrl.searchParams.set("first_air_date.lte", yearRange.lte);
    }

    const { data: seriesData } = useSWR(apiUrl.toString(), fetcher);


    const { data: languagesData } = useSWR(
    `https://api.themoviedb.org/3/configuration/languages?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}`,
    fetcher
);

const { data: genresData } = useSWR(
    `https://api.themoviedb.org/3/genre/tv/list?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}&language=en-US`,
    fetcher
);


function filterSeries(series: MediaItem[], {genre, yearRange, rating, language} : any) {
    return series.filter((serie) => {
        const date = new Date(serie.first_air_date || "")
        return (
        (genre === "all" || (serie.genre_ids?.includes(Number(genre)) ?? false)) &&
        (language === "all" || serie.original_language === language) &&
        (rating === "all" || (serie.vote_average ?? 0) >= Number(rating)) &&
        (!yearRange.gte || date >= new Date(yearRange.gte)) &&
        (!yearRange.lte || date <= new Date(yearRange.lte))
        )
    })
}


    const filteredMovies = useMemo(() => {
    if (!seriesData?.results) return []
    return query
        ? filterSeries(seriesData.results, {genre, yearRange, rating, language})
        : seriesData.results
    }, [seriesData, query, genre, yearRange, rating, language])

    const handlePageChange = (newPage : number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", newPage.toString());
    router.push(`${pathname}?${params.toString()}`);
};



    if(!seriesData || !genresData || !languagesData){
        return <div>Loading....</div>
    }

    const totalPages = seriesData?.total_pages || 1
    const movies = filteredMovies

    const genres = genresData?.genres || []
    const languages = languagesData || []


    return(
        <div className="container mx-auto px-4">
            <Filter genres = {genres} languages = {languages} placeholder = "Search Movies..." />
            <MediaDisplay items = {movies} />


            {movies.length >= 15 && totalPages > 1 && (
                <Pagination currentPage = {page} totalPages = {totalPages} onPageChange = {handlePageChange} />
            )}
        </div>
    )
}