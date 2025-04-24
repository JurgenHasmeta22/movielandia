import React, { ReactNode } from "react";
import { ThemeProvider } from "@mui/material/styles";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v14-appRouter";
import CssBaseline from "@mui/material/CssBaseline";
import { theme } from "@/utils/theme/theme";

interface IMUIThemeProviderProps {
	children: ReactNode;
}

export function MUIThemeProvider({ children }: IMUIThemeProviderProps) {
	return (
		<AppRouterCacheProvider>
			<ThemeProvider
				theme={theme}
				disableTransitionOnChange
				defaultMode="dark"
			>
				<CssBaseline />
				{children}
			</ThemeProvider>
		</AppRouterCacheProvider>
	);
}
