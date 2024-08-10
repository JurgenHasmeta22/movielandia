import React, { ReactNode } from "react";
import { Experimental_CssVarsProvider as CssVarsProvider } from "@mui/material/styles";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v13-appRouter";
import CssBaseline from "@mui/material/CssBaseline";
import { theme } from "@/utils/theme/theme";

export function ThemeProvider({ children }: { children: ReactNode }) {
    return (
        <AppRouterCacheProvider>
            <CssVarsProvider defaultMode="dark" theme={theme}>
                <CssBaseline />
                {children}
            </CssVarsProvider>
        </AppRouterCacheProvider>
    );
}
