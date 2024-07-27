import { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
    return {
        name: "Movielandia24 App",
        short_name: "Movielandia24",
        description: "Movielandia24 – Find information",
        start_url: "/",
        display: "standalone",
        background_color: "#ffffff",
        theme_color: "#ffffff",
        // icons: [
        //     {
        //         src: "/android-chrome-192x192.png",
        //         sizes: "192x192",
        //         type: "image/png",
        //         purpose: "maskable",
        //     },
        //     {
        //         src: "/android-chrome-512x512.png",
        //         sizes: "512x512",
        //         type: "image/png",
        //         purpose: "maskable",
        //     },
        // ],
    };
}
