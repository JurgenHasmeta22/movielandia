import { getFollowers } from "@/actions/user/userFollow.actions";
import { getUserById } from "@/actions/user/user.actions";
import FollowersContent from "./_components/FollowersContent";
import { redirect } from "next/navigation";

export default async function FollowersPage({
    params,
    searchParams,
}: {
    params: { userId: string; userName: string };
    searchParams: { page?: string };
}) {
    const page = Number(searchParams?.page) || 1;
    const userInPage = await getUserById(Number(params.userId));

    if (!userInPage) {
        redirect("/");
    }

    const followers = await getFollowers(Number(params.userId), page);

    return <FollowersContent userInPage={userInPage} followers={followers} />;
}
