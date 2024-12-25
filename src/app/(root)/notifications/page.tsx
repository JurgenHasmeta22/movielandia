import { getAllNotifications } from "@/actions/user/userFollow.actions";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import NotificationsPageContent from "./_components/NotificationsPageContent";
import LoadingSpinner from "@/components/root/loadingSpinner/LoadingSpinner";
import { Suspense } from "react";

interface INotificationsPageProps {
    searchParams?: Promise<{ page?: string }>;
}

export default async function NotificationsPage(props: INotificationsPageProps) {
    const session = await getServerSession(authOptions);

    const searchParams = await props.searchParams;
    const searchParamsKey = JSON.stringify(searchParams);
    const page = Number(searchParams?.page) || 1;

    const notifications = await getAllNotifications(Number(session?.user.id), page);

    return (
        <Suspense key={searchParamsKey} fallback={<LoadingSpinner />}>
            <NotificationsPageContent notifications={notifications} />
        </Suspense>
    );
}
