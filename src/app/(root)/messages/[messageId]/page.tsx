import { getMessageById } from "@/actions/user/userMessages.actions";
import { notFound } from "next/navigation";
import MessagePageContent from "./_components/MessagePageContent";

interface MessageDetailsPageProps {
	params: {
		messageId: string;
	};
}

async function MessagePage(props: MessageDetailsPageProps) {
	const params = await props.params;
	const messageId = Number(params.messageId);
	let message;

	try {
		message = await getMessageById(messageId);
	} catch (error) {
		return notFound();
	}

	return <MessagePageContent message={message} />;
}

export default MessagePage;
