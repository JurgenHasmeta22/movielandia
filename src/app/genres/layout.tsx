import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Watch the Latest Genres | High-Quality and Always Updated",
    description:
        "Discover and watch the latest and most amazing genres in high quality. Our collection is always updated with the newest episodes and releases.",
};

interface GenresLayoutProps {
    children: React.ReactNode;
}

export default function GenresLayout({ children }: GenresLayoutProps) {
    return <>{children}</>;
}
