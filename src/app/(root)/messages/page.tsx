import { Suspense } from "react";
import { redirect } from "next/navigation";
import MessagesPageContent from "./_components/MessagesPageContent";
import LoadingSpinner from "@/components/root/loadingSpinner/LoadingSpinner";
import { getUserInbox, getSentMessages, getAllUsers } from "@/actions/user/userMessages.actions";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth";

interface IMessagesPageProps {
    searchParams?: {
        section?: string;
        page?: string;
    };
}

export default async function MessagesPage({ searchParams }: IMessagesPageProps) {
    const session = await getServerSession(authOptions);

    const section = searchParams?.section || "inbox";
    const page = Number(searchParams?.page) || 1;
    const searchParamsKey = JSON.stringify(searchParams);

    const messages =
        section === "inbox"
            ? await getUserInbox(page, session?.user.id)
            : await getSentMessages(page, session?.user.id);
    const users = await getAllUsers(session?.user.id);

    return (
        <Suspense key={searchParamsKey} fallback={<LoadingSpinner />}>
            <MessagesPageContent
                initialMessages={messages}
                users={users}
                currentSection={section as "inbox" | "sent"}
                currentPage={page}
            />
        </Suspense>
    );
}
