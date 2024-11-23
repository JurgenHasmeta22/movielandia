import AboutUsContent from "./_components/AboutUsContent";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "About Us | MovieLandia",
    description: "Learn more about MovieLandia - your premier destination for movies and TV series.",
};

export default function AboutUsPage() {
    return <AboutUsContent />;
}
