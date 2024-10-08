"use client";

import { SessionProvider } from "next-auth/react";

interface IAuthProviderProps {
    children?: React.ReactNode;
}

export const AuthProvider = ({ children }: IAuthProviderProps) => {
    return <SessionProvider>{children}</SessionProvider>;
};
