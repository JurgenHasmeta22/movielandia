import { Metadata } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import ListsPageContent from "./_components/ListsPageContent";

export const metadata: Metadata = {
    title: "Lists | MovieLandia24",
    description: "Browse and manage your movie and TV show lists",
};

interface PageProps {
    params: {
        id: string;
        username: string;
    };
    searchParams?: {
        listsAscOrDesc?: string;
        pageLists?: string;
        listsSortBy?: string;
        listsType?: string;
    };
}

export default async function ListsPage({ params, searchParams }: PageProps) {
    const session = await getServerSession(authOptions);

    return (
        <ListsPageContent
            searchParams={searchParams}
            session={session}
            userId={parseInt(params.id)}
            username={params.username}
        />
    );
}
