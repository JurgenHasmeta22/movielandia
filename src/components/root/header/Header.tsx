import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth/next";
import { HeaderContent } from "./HeaderContent";
import { getGenres } from "@/actions/genre.actions";
import { getUsernameByUserId } from "@/actions/user/user.actions";

const Header = async () => {
    const session = await getServerSession(authOptions);

    let userName: string = "";

    if (session && session.user && session.user.id) {
        userName = await getUsernameByUserId(Number(session.user.id));
    }

    const genres = await getGenres();

    return <HeaderContent session={session} genres={genres || []} userName={userName} />;
};

export default Header;
