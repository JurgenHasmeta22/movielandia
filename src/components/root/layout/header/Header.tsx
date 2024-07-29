import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth/next";
import React from "react";
import { HeaderContent } from "./HeaderContent";

const Header = async () => {
    const session = await getServerSession(authOptions);

    return <HeaderContent session={session} />;
};

export default Header;
