import { Suspense } from "react";
import MessagesPageContent from "./_components/MessagesPageContent";
import LoadingSpinner from "@/components/root/loadingSpinner/LoadingSpinner";
import {
    getUserInbox,
    getSentMessages,
    getAllUsers,
    searchUsers,
    getUserById,
} from "@/actions/user/userMessages.actions";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

interface IMessagesPageProps {
    searchParams?: {
        section?: string;
        page?: string;
        search?: string;
        selectedUser?: string;
    };
}

export default async function MessagesPage({ searchParams }: IMessagesPageProps) {
    const session = await getServerSession(authOptions);

    const section = searchParams?.section || "inbox";
    const page = Number(searchParams?.page) || 1;
    const searchQuery = searchParams?.search || "";
    const searchParamsKey = JSON.stringify(searchParams);
    const selectedUserId = searchParams?.selectedUser;

    const [messages, users, searchResults, selectedUser] = await Promise.all([
        section === "inbox" ? getUserInbox(page, session?.user.id) : getSentMessages(page, session?.user.id),
        getAllUsers(session?.user.id),
        searchQuery ? searchUsers(searchQuery, Number(session?.user.id)) : Promise.resolve([]),
        selectedUserId ? getUserById(Number(selectedUserId)) : Promise.resolve(null),
    ]);

    return (
        <Suspense key={searchParamsKey} fallback={<LoadingSpinner />}>
            <MessagesPageContent
                initialMessages={messages}
                users={users}
                searchResults={searchResults}
                currentSection={section as "inbox" | "sent"}
                currentPage={page}
                userLoggedIn={session?.user}
                initialSelectedUser={selectedUser}
            />
        </Suspense>
    );
}