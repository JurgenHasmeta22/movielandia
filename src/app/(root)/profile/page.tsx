import { Metadata } from "next";
import ProfilePage from "./_components/ProfilePage";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getUserById } from "@/lib/actions/user.actions";

interface IProfileProps {
    searchParams?: { tab?: string };
}

export const metadata: Metadata = {
    title: "Profile - User Profile Page",
    description: "User profile page",
    robots: {
        index: false,
        follow: false,
    },
};

export default async function Profile({ searchParams }: IProfileProps) {
    const tabValue = searchParams?.tab ? searchParams?.tab : "";

    const session = await getServerSession(authOptions);
    const userSession = (session && session.user) || null;
    const user = await getUserById(Number(userSession?.id));

    return <ProfilePage user={user} tabValue={tabValue} />;
}
