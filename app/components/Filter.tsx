"use client"
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Filter({ genres = [], languages = [], placeholder }: any) {
    const [filters, setFilters] = useState({
    genre: "",
    year: "",
    rating: "",
    language: "",
    sortBy: "",
    query: "",
});


useEffect(() => {
    const params = new URLSearchParams(window.location.search);
        setFilters((prev) => ({
        ...prev,
        genre: params.get("genre") || "",
        year: params.get("year") || "",
        rating: params.get("rating") || "",
        language: params.get("language") || "",
        sortBy: params.get("sortBy") || "",
        query: params.get("query") || "",
    }));
    }, []);




    const handleChange = (e : any) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value })); 
    };

    const handleSearch = () => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
        if (value) params.set(key, value); 
    });
    params.set("page", "1"); 
    window.history.pushState({}, "", `?${params}`);
    };


const filterOptions = {
    years: ["2025", "2024", "2020-now", "2010-2019", "2000-2009", "1990-1999"],
    ratings: ["9", "8", "7", "6", "5", "4", "3", "2", "1"],
    sortBy: [
        { label: "Most Popular", value: "popularity.desc" },
        { label: "Newest", value: "release_date.desc" },
        { label: "Oldest", value: "release_date.asc" },
        { label: "Top Rated", value: "vote_average.desc" },
    ],
    };


function Dropdown({ label, name, value, onChange, options } : any) {
    return (
        <div>
        <label className="block mb-2 ml-1 text-sm">{label}</label>
        <select
            name={name}
            value={value}
            onChange={onChange}
            className="bg-[#252525] rounded-md px-3 py-2 text-white w-full"
        >
            <option value="">All</option>
            {options.map((opt : any) => (
            <option key={opt.value} value={opt.value}>
                {opt.label}
            </option>
            ))}
        </select>
        </div>
    );
    }

// render filter UI with search input and dropdowns
return (
<section className="bg-black text-white py-6 mt-20">
    <div className="px-4 md:px-10 xl:px-36">
            <div className="mb-6">
                    <label className="block mb-2 ml-1 text-sm font-semibold">
                    Search
                    </label>
                    <input
                    type="text"
                    name="query"
                    placeholder={placeholder}
                    autoComplete="off"
                    value={filters.query}
                    onChange={handleChange}
                    className="w-full px-4 py-2 bg-[#252525] text-sm text-white placeholder-white rounded-xl focus:outline-none"
                    />
            </div>

        <div className="grid grid-cols-2 md:grid-cols-6 gap-4">

        <Dropdown
        label="Genre"
        name="genre"
        value={filters.genre}
        onChange={handleChange}
        options={genres.map((g : any) => ({ label: g.name, value: g.id }))}
        />


            <Dropdown
            label="Year"
            name="year"
            value={filters.year}
            onChange={handleChange}
            options={filterOptions.years.map((y) => ({ label: y, value: y }))}
            />



        <Dropdown
        label="Rating"
        name="rating"
        value={filters.rating}
        onChange={handleChange}
        options={filterOptions.ratings.map((r) => ({
            label: `${r}+`,
            value: r,
        }))}
        />


        <Dropdown
        label="Language"
        name="language"
        value={filters.language}
        onChange={handleChange}
        options={languages.map((l : any) => ({
            label: l.english_name,
            value: l.iso_639_1,
        }))}
        />


        <Dropdown
        label="Sort By"
        name="sortBy"
        value={filters.sortBy}
        onChange={handleChange}
        options={filterOptions.sortBy}
        />

        <div className="flex items-end">
        <button
            onClick={handleSearch}
            className="bg-yellow-400 text-black font-semibold w-full px-5 py-2 rounded-md hover:bg-yellow-500 transition"
        >
            Search
        </button>
        </div>


        </div>
    </div>
</section>
);
}