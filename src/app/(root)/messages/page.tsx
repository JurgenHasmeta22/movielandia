import { Suspense } from "react";
import MessagesPageContent from "./_components/MessagesPageContent";
import LoadingSpinner from "@/components/root/loadingSpinner/LoadingSpinner";
import { getUserInbox, getSentMessages, getAllUsers, searchUsers } from "@/actions/user/userMessages.actions";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

interface IMessagesPageProps {
    searchParams?: {
        section?: string;
        page?: string;
        search?: string;
    };
}

export default async function MessagesPage({ searchParams }: IMessagesPageProps) {
    const session = await getServerSession(authOptions);

    const section = searchParams?.section || "inbox";
    const page = Number(searchParams?.page) || 1;
    const searchQuery = searchParams?.search || "";
    const searchParamsKey = JSON.stringify(searchParams);

    const messages =
        section === "inbox"
            ? await getUserInbox(page, session?.user.id)
            : await getSentMessages(page, session?.user.id);

    const searchResults = searchQuery ? await searchUsers(searchQuery, Number(session?.user.id)) : [];

    const users = await getAllUsers(session?.user.id);

    return (
        <Suspense key={searchParamsKey} fallback={<LoadingSpinner />}>
            <MessagesPageContent
                initialMessages={messages}
                users={users}
                searchResults={searchResults}
                currentSection={section as "inbox" | "sent"}
                currentPage={page}
                initialSearchQuery={searchQuery}
            />
        </Suspense>
    );
}
