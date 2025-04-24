import { Suspense } from "react";
import MessagesPageContent from "./_components/MessagesPageContent";
import LoadingSpinner from "@/components/root/loadingSpinner/LoadingSpinner";
import {
	getUserInbox,
	getSentMessages,
	searchUsers,
	getUserById,
	getMessageById,
} from "@/actions/user/userMessages.actions";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

interface IMessagesPageProps {
	searchParams?: {
		section?: string;
		page?: string;
		search?: string;
		selectedUser?: string;
		editMessageId?: string;
	};
}

export default async function MessagesPage(props: IMessagesPageProps) {
	const session = await getServerSession(authOptions);

	const searchParams = await props.searchParams;
	const section = searchParams?.section || "inbox";
	const page = Number(searchParams?.page) || 1;
	const searchQuery = searchParams?.search || "";
	const selectedUserId = searchParams?.selectedUser;
	const editMessageId = searchParams?.editMessageId;
	const searchParamsKey = JSON.stringify(searchParams);

	let messages: any = {
		items: [],
		total: 0,
	};

	if (section === "inbox") {
		messages = await getUserInbox(page, Number(session?.user.id));
	} else if (section === "sent") {
		messages = await getSentMessages(page, Number(session?.user.id));
	} else {
		messages = await getUserInbox(page, Number(session?.user.id));
	}

	const searchResults = searchQuery
		? await searchUsers(searchQuery, Number(session?.user.id))
		: [];
	const selectedUser = selectedUserId
		? await getUserById(Number(selectedUserId))
		: null;
	const messageToEdit = editMessageId
		? await getMessageById(Number(editMessageId))
		: null;
	const messagesPageCount = Math.ceil(messages.total / 10);

	return (
		<Suspense key={searchParamsKey} fallback={<LoadingSpinner />}>
			<MessagesPageContent
				initialMessages={messages}
				searchResults={searchResults}
				currentSection={section as "inbox" | "sent"}
				currentPage={page}
				userLoggedIn={session?.user}
				initialSelectedUser={selectedUser}
				messagesPageCount={messagesPageCount}
				initialMessageToEdit={messageToEdit}
			/>
		</Suspense>
	);
}
