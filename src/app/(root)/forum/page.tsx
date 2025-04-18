import { Suspense } from "react";
import type { Metadata } from "next";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import ForumPageContent from "./_components/ForumPageContent";
import LoadingSpinner from "@/components/root/loadingSpinner/LoadingSpinner";

interface IForumProps {
  searchParams?: Promise<{ page?: string }>;
}

export const metadata: Metadata = {
  title: "Forum | MovieLandia24",
  description: "Join discussions about your favorite movies and series in our community forum.",
  openGraph: {
    title: "Forum | MovieLandia24",
    description: "Join discussions about your favorite movies and series in our community forum.",
    url: "/forum",
    siteName: "MovieLandia24",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    site: "@movieLandia24",
    creator: "movieLandia24",
    title: "Forum | MovieLandia24",
    description: "Join discussions about your favorite movies and series in our community forum.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default async function Forum(props: IForumProps) {
  const session = await getServerSession(authOptions);
  
  const searchParams = await props.searchParams;
  const searchParamsKey = JSON.stringify(searchParams);

  return (
    <Suspense key={searchParamsKey} fallback={<LoadingSpinner />}>
      <ForumPageContent searchParams={searchParams} session={session} />
    </Suspense>
  );
}
