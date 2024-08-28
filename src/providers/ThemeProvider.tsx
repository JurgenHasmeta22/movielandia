import React, { ReactNode } from "react";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v14-appRouter";
import CssBaseline from "@mui/material/CssBaseline";
import DefaultPropsProvider from "@mui/material/DefaultPropsProvider";

export function MUIThemeProvider({ children }: { children: ReactNode }) {
    return (
        <AppRouterCacheProvider>
            <DefaultPropsProvider
                value={{
                    MuiButton: {
                        disableRipple: true,
                        disableFocusRipple: true,
                        disableTouchRipple: true,
                    },
                    MuiListItemButton: {
                        disableRipple: true,
                        disableTouchRipple: true,
                    },
                    MuiIconButton: {
                        disableRipple: true,
                        disableFocusRipple: true,
                        disableTouchRipple: true,
                    },
                    MuiTab: {
                        disableRipple: true,
                        disableFocusRipple: true,
                        disableTouchRipple: true,
                    },
                }}
            >
                <CssBaseline />
                {children}
            </DefaultPropsProvider>
        </AppRouterCacheProvider>
    );
}
