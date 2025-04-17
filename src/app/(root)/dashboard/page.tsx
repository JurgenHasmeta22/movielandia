import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import DashboardContent from "./_components/DashboardContent";
import { Suspense } from "react";
import LoadingSpinner from "@/components/root/loadingSpinner/LoadingSpinner";

export default async function DashboardPage() {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
        redirect("/auth/signin");
    }

    const userId = Number(session.user.id);
    const userName = session.user.userName;

    return (
        <Suspense fallback={<LoadingSpinner />}>
            <DashboardContent userId={userId} userName={userName} />
        </Suspense>
    );
}
