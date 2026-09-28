"use client"
import { usePathname } from "next/navigation";
import {AnimatePresence, motion} from "framer-motion"
import Link from "next/link";
import { IoIosSearch } from "react-icons/io";
import { useState } from "react";
import { GiHamburgerMenu } from "react-icons/gi";
import { FaXmark } from "react-icons/fa6";
import Image from "next/image";

export default function Header(){
    const pathname = usePathname();
    const [openMenu, setOpenMenu] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [searchTerm ,setSeachTerm] = useState("");
    const [suggestions, setSuggestions] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const NavLinks = [
        {name : "Home", href : "/"},
        {name : "Movies", href : "/movies"},
        {name : "TV Series", href : "/tv-series"},
    ];



    const fetchSuggestion = async (query : string) => {
        if(!query.trim()){
            setSuggestions([]);
            return
        }

        
    try{
        setIsLoading(true);
        const apiKey = process.env.NEXT_PUBLIC_TMDB_API_KEY;
        const url = `https://api.themoviedb.org/3/search/multi?api_key=${apiKey}&query=${encodeURIComponent(query)}`
        const res = await fetch(url, {cache : "no-store"})
        if(res.ok){
            const data = await res.json();
            const filterdResults = data.results?.filter((item : any) => item.media_type === "movie" || item.media_type === "tv").slice(0, 5) || []
            setSuggestions(filterdResults);
        }else{
            setSuggestions([])
        }
    }catch(error){
        console.log(error);
        setSuggestions([])
    }finally{
        setIsLoading(false);
    }

    }


  const handleSearchClick = () => {
    setIsSearchOpen(false);
    setSeachTerm("");
    setSuggestions([]);
}

    return(
        <motion.header className="bg-transparent text-white w-full py-2 z-50 px-4 md:px-10 xl:px-36 absolute top-0 left-0"
        initial = {{opacity :0}}
        animate = {{opacity : 1}}
        transition={{duration : 0.5}}
        >


        {/* DeskTop Links */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

            {/* Logo */}
                <div className="flex items-center justify-between w-full md:w-auto">

                    <Link href = "/" className="flex flex-col items-center">
                        <span className="text-2xl md:text-xl lg:text-3xl font-bold text-yellow-400">
                            Rise Of Coding
                        </span>

                        <span className="text-xs lg:text-base text-white">Movies and TV Series</span>
                    </Link>





            {/* Burger */}
                <motion.button className="md:hidden text-white hover:text-white/80 cursor-pointer" 
                onClick={() => {setOpenMenu(!openMenu)}}
                whileTap={{scale : 0.9}}
                >
                    {openMenu ? <FaXmark className="w-6 h-6" /> : <GiHamburgerMenu className="w-6 h-6" />  }
                </motion.button>
            {/* Burger */}


                </div>
            {/* Logo */}




            {/* Search */}
                <motion.div className="relative w-full md:w-1/3 md:mx-8 hidden md:block">
                <input value={searchTerm}
                    onChange={(e) => {
                        setSeachTerm(e.target.value);
                        fetchSuggestion(e.target.value);
                        if(e.target.value.trim()){
                            setIsSearchOpen(true);
                        }else{
                            setIsSearchOpen(false);
                        }
                    }}
                    type="text" placeholder="Quick Search..." 
                    className="w-full px-4 py-1.5 lg:py-3 bg-white text-sm text-gray-500 focus:outline-none placeholder-gray-500
                    rounded-xl border border-gray-500 focus:border-white pr-10
                    " />

                    <button onClick={searchTerm ? handleSearchClick : undefined} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-lg cursor-pointer">
                    {
                        isLoading ? (
                            <div className="w-5 h-5 border-2 border-yellow-400 border-t-transparent rounded-full animate-spin" />
                        ) : (
                            <IoIosSearch className="w-5 h-5 text-gray-500" />
                        )
                    }
                    </button>



                    <AnimatePresence>
                        {isSearchOpen && (
                            <motion.div 
                                className="absolute top-full mt-1 w-full bg-[#18181b] border border-gray-500 rounded-lg shadow-lg z-50"
                                initial={{opacity: 0, y: -10}}
                                animate={{opacity: 1, y: 0}}
                                exit={{opacity: 0, y: -10}}
                                transition={{duration: 0.3}}
                            >
                                {suggestions.length > 0 ? (
                                    suggestions.map((item: any) => (
                                        <Link key={item.id} href={`/${item.media_type}/${item.id}`}>
                                            <div className="flex items-center gap-3 px-4 py-2 hover:bg-white/10 text-white text-sm">
                                                <Image 
                                                    alt="img" 
                                                    src={item.poster_path ? `https://image.tmdb.org/t/p/w500${item.poster_path}` : "/defau_poster.jpg"} 
                                                    width={32} 
                                                    height={48}
                                                    className="w-8 aspect-[2/3] object-cover rounded"
                                                />
                                                <div className="flex-1">
                                                    <h3 className="text-sm text-white line-clamp-2 h-10">{item.title || item.name || "UnNamed"}</h3>
                                                    <p>
                                                        {(item.release_date || item.first_air_date || "")?.split("-")[0] || "N/A"}
                                                    </p>
                                                </div>
                                            </div>
                                        </Link>
                                    ))
                                ) : (
                                    <div className="px-4 py-3 text-gray-400 text-sm">
                                        No results found
                                    </div>
                                )}
                            </motion.div>
                        )}
                    </AnimatePresence>

                </motion.div>
            {/* Search */}




            {/* DeskTop NavLinks */}
                <nav className="hidden md:flex md:items-center md:space-x-6">
                    {
                        NavLinks.map((link) => {
                            return <Link key={link.name} href={link.href}
                            className={`text-xs sm:text-base font-medium relative text-white ${pathname === link.href ? "text-white" : "hover:text-white/80"}`}
                            >
                            {link.name}

                            {/* UnderLine Animation */}
                                {pathname === link.href && (
                                    <motion.span className=" absolute left-0 right-0 bottom-0 h-0.5 bg-yellow-400" 
                                    layoutId = "underline"
                                    transition={{duration : 0.3}}
                                    />
                                )}
                            {/* UnderLine Animation */}
                            </Link>
                        })
                    }
                </nav>
            {/* DeskTop NavLinks */}


            </div>
        {/* DeskTop Links */}


        {/* Mobile Menu */}
            <motion.div className={`md:hidden backdrop-blur-xs bg-[rgba(24,24,27,0.6)] z-50 absolute left-0 w-full px-4 py-4 ${openMenu ? "block" : "hidden"}`}
            initial = {{y : -20, opacity : 0}}
            animate = {openMenu ? {y : 0, opacity : 1} : {y : -20, opacity : 0}}
            transition={{duration : 0.3}}
            >

            {/* Search Bar */}
            <motion.div className="relative w-full mb-4">
                <input
                value={searchTerm}
                onChange={(e) => {
                    setSeachTerm(e.target.value);
                    fetchSuggestion(e.target.value);
                    if(e.target.value.trim()){
                        setIsSearchOpen(true);
                    }else{
                        setIsSearchOpen(false);
                    }
                }}
                type="text" placeholder="Quick Search..." className="w-full px-4 py-2 bg-white text-gray-500 placeholder-gray-500
                rounded-xl border border-gray-500 focus:outline-none focus:border-white pr-10
                " />

                <motion.button className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer ">
                    <IoIosSearch className="w-5 h-5 text-gray-500" />
                </motion.button>

                <AnimatePresence>
                    {isSearchOpen && (
                        <motion.div 
                            className="absolute top-full mt-1 w-full bg-[#18181b] border border-gray-500 rounded-lg shadow-lg z-50"
                            initial={{opacity: 0, y: -10}}
                            animate={{opacity: 1, y: 0}}
                            exit={{opacity: 0, y: -10}}
                            transition={{duration: 0.3}}
                        >
                            {suggestions.length > 0 ? (
                                suggestions.map((item: any) => (
                                    <Link key={item.id} href={`/${item.media_type}/${item.id}`}>
                                        <div className="flex items-center gap-3 px-4 py-2 hover:bg-white/10 text-white text-sm">
                                            <Image 
                                                alt="img" 
                                                src={item.poster_path ? `https://image.tmdb.org/t/p/w500${item.poster_path}` : "/defau_poster.jpg"} 
                                                width={32} 
                                                height={48}
                                                className="w-8 aspect-[2/3] object-cover rounded"
                                            />
                                            <div className="flex-1">
                                                <h3 className="text-sm text-white line-clamp-2 h-10">{item.title || item.name || "UnNamed"}</h3>
                                                <p>
                                                    {(item.release_date || item.first_air_date || "")?.split("-")[0] || "N/A"}
                                                </p>
                                            </div>
                                        </div>
                                    </Link>
                                ))
                            ) : (
                                <div className="px-4 py-3 text-gray-400 text-sm">
                                    No results found
                                </div>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>

            </motion.div>
        {/* Search Bar */}


            {/* Mobile Nav */}
                <nav className="flex flex-col items-center gap-2">
                    {
                        NavLinks.map((link) => {
                            return <Link key={link.name} href={link.href} className="block text-white text-base font-medium hover:text-white/80">
                                {link.name}
                            </Link>
                        })
                    }
                </nav>
            {/* Mobile Nav */}

            </motion.div>
        {/* Mobile Menu */}

        </motion.header>
    );
}