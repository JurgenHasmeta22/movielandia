import { getFollowing } from "@/actions/user/userFollow.actions";
import { getUserById } from "@/actions/user/user.actions";
import FollowingContent from "./_components/FollowingContent";
import { redirect } from "next/navigation";

export default async function FollowingPage({
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

    const following = await getFollowing(Number(params.userId), page);

    return <FollowingContent userInPage={userInPage} following={following} />;
}
