import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth/next";
import React from "react";
import { HeaderContent } from "./HeaderContent";
import { getGenresAll } from "@/actions/genre.actions";

const Header = async () => {
    const session = await getServerSession(authOptions);
    const genres = await getGenresAll();

    return <HeaderContent session={session} genres={genres} />;
};

export default Header;
