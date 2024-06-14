import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Watch the Latest Movies | High-Quality and Always Updated",
    description:
        "Discover and watch the latest and most amazing movies in high quality. Our collection is always updated with the newest episodes and releases.",
};

interface MoviesLayoutProps {
    children: React.ReactNode;
}

export default function MoviesLayout({ children }: MoviesLayoutProps) {
    return <>{children}</>;
}
