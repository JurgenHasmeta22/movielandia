import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Watch the Latest Series | High-Quality and Always Updated",
    description:
        "Discover and watch the latest and most amazing series in high quality. Our collection is always updated with the newest episodes and releases.",
};

interface SeriesLayoutProps {
    children: React.ReactNode;
}

export default function SeriesLayout({ children }: SeriesLayoutProps) {
    return <>{children}</>;
}
