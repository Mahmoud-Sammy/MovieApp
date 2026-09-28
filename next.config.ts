const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "image.tmdb.org", // Allow images from TMDB
        pathname: "/t/p/**", // All image paths under /t/p/
      },
    ],
  },
};  

export default nextConfig;