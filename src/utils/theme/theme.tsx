"use client";

import React, { createContext, useContext, useState, ReactNode, useEffect, useMemo } from "react";
import { createTheme, ThemeProvider as MuiThemeProvider, responsiveFontSizes } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";

interface ThemeContextType {
    mode: string;
    toggleMode: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const tokens = (mode: any) => ({
    ...(mode === "dark"
        ? {
              grey: {
                  100: "#e0e0e0",
                  200: "#c2c2c2",
                  300: "#a3a3a3",
                  400: "#858585",
                  500: "#666666",
                  600: "#525252",
                  700: "#3d3d3d",
                  800: "#292929",
                  900: "#141414",
                  1000: "#212529",
                  1100: "#a3acb4",
                  1200: "#e7e7e8",
                  1300: "#90979f",
                  1400: "#eef0ef",
                  1500: "#9ba2a9",
              },
              primary: {
                  100: "#d0d1d5",
                  200: "#a1a4ab",
                  300: "#727681",
                  400: "#1F2A40",
                  500: "#141b2d",
                  600: "#101624",
                  700: "#868dfb",
                  800: "#080b12",
                  900: "#040509",
                  1000: "#2c3033",
                  1100: "#2a2a2a",
              },
              greenAccent: {
                  100: "#dbf5ee",
                  200: "#b7ebde",
                  300: "#94e2cd",
                  400: "#70d8bd",
                  500: "#4cceac",
                  600: "#3da58a",
                  700: "#2e7c67",
                  800: "#1e5245",
                  900: "#0f2922",
              },
              redAccent: {
                  100: "#f8dcdb",
                  200: "#f1b9b7",
                  300: "#e99592",
                  400: "#e2726e",
                  500: "#db4f4a",
                  600: "#af3f3b",
                  700: "#832f2c",
                  800: "#58201e",
                  900: "#2c100f",
              },
              blueAccent: {
                  100: "#e1e2fe",
                  200: "#c3c6fd",
                  300: "#a4a9fc",
                  400: "#868dfb",
                  500: "#6870fa",
                  600: "#535ac8",
                  700: "#3e4396",
                  800: "#2a2d64",
                  900: "#151632",
              },
          }
        : {
              grey: {
                  100: "#141414",
                  200: "#292929",
                  300: "#3d3d3d",
                  400: "#525252",
                  500: "#666666",
                  600: "#858585",
                  700: "#a3a3a3",
                  800: "#c2c2c2",
                  900: "#e0e0e0",
              },
              primary: {
                  100: "#040509",
                  200: "#080b12",
                  300: "#0c101b",
                  400: "#f2f0f0",
                  500: "#141b2d",
                  600: "#1F2A40",
                  700: "#FFF",
                  800: "#a1a4ab",
                  900: "#F5F5F5",
              },
              greenAccent: {
                  100: "#0f2922",
                  200: "#1e5245",
                  300: "#2e7c67",
                  400: "#3da58a",
                  500: "#4cceac",
                  600: "#70d8bd",
                  700: "#94e2cd",
                  800: "#b7ebde",
                  900: "#dbf5ee",
              },
              redAccent: {
                  100: "#2c100f",
                  200: "#58201e",
                  300: "#832f2c",
                  400: "#af3f3b",
                  500: "#db4f4a",
                  600: "#e2726e",
                  700: "#e99592",
                  800: "#f1b9b7",
                  900: "#f8dcdb",
              },
              blueAccent: {
                  100: "#151632",
                  200: "#2a2d64",
                  300: "#3e4396",
                  400: "#535ac8",
                  500: "#6870fa",
                  600: "#868dfb",
                  700: "#a4a9fc",
                  800: "#c3c6fd",
                  900: "#e1e2fe",
              },
          }),
});

const themeSettings = (mode: any) => {
    const colors = tokens(mode);

    return {
        transitions: {
            easing: {
                sharp: "cubic-bezier(0.4, 0, 0.6, 1)",
            },
            duration: {
                enteringScreen: 350,
                leavingScreen: 350,
            },
        },
        palette: {
            mode: mode,
            ...(mode === "dark"
                ? {
                      primary: {
                          main: colors.primary[500],
                      },
                      secondary: {
                          main: colors.greenAccent[500],
                      },
                      neutral: {
                          dark: colors.grey[700],
                          main: colors.grey[500],
                          light: colors.grey[100],
                      },
                      background: {
                          default: colors.primary[500],
                      },
                  }
                : {
                      primary: {
                          main: colors.primary[100],
                      },
                      secondary: {
                          main: colors.greenAccent[500],
                      },
                      neutral: {
                          dark: colors.grey[700],
                          main: colors.grey[500],
                          light: colors.grey[100],
                      },
                      background: {
                          default: "#fcfcfc",
                      },
                  }),
        },
        typography: {
            fontFamily: ["Montserrat", "sans-serif"].join(","),
            fontSize: 12,
            h1: {
                fontFamily: ["Montserrat", "sans-serif"].join(","),
                fontSize: 45,
                "@media (max-width:600px)": {
                    fontSize: "42px",
                },
            },
            h2: {
                fontFamily: ["Montserrat", "sans-serif"].join(","),
                fontSize: 35,
                "@media (max-width:600px)": {
                    fontSize: "32px",
                },
            },
            h3: {
                fontFamily: ["Montserrat", "sans-serif"].join(","),
                fontSize: 24,
                "@media (max-width:600px)": {
                    fontSize: "20px",
                },
            },
            h4: {
                fontFamily: ["Montserrat", "sans-serif"].join(","),
                fontSize: 20,
                "@media (max-width:600px)": {
                    fontSize: "18px",
                },
            },
            h5: {
                fontFamily: ["Montserrat", "sans-serif"].join(","),
                fontSize: 16,
                "@media (max-width:600px)": {
                    fontSize: "14px",
                },
            },
            h6: {
                fontFamily: ["Montserrat", "sans-serif"].join(","),
                fontSize: 14,
                "@media (max-width:600px)": {
                    fontSize: "12px",
                },
            },
            body1: {
                fontFamily: ["Montserrat", "sans-serif"].join(","),
                fontSize: 16,
                "@media (max-width:600px)": {
                    fontSize: "14px",
                },
            },
            body2: {
                fontFamily: ["Montserrat", "sans-serif"].join(","),
                fontSize: 14,
                "@media (max-width:600px)": {
                    fontSize: "12px",
                },
            },
        },
        components: {
            MuiButton: {
                styleOverrides: {
                    root: {
                        borderRadius: 8,
                        cursor: "pointer",
                        boxShadow: "none",
                        transition: "background-color 0.5s ease",
                    },
                },
                defaultProps: {
                    disableRipple: true,
                    disableFocusRipple: true,
                    disableTouchRipple: true,
                },
            },
            MuiListItemButton: {
                defaultProps: {
                    disableRipple: true,
                    disableTouchRipple: true,
                },
            },
            MuiIconButton: {
                styleOverrides: {
                    root: {
                        borderRadius: 20,
                        cursor: "pointer",
                        transition: "background-color 0.5s ease",
                        boxShadow: "none",
                    },
                },
                defaultProps: {
                    disableRipple: true,
                    disableFocusRipple: true,
                    disableTouchRipple: true,
                },
            },
            MuiTextField: {
                styleOverrides: {
                    root: {
                        transition: "background-color 0.5s ease",
                    },
                },
            },
            MuiTab: {
                defaultProps: {
                    disableRipple: true,
                    disableFocusRipple: true,
                    disableTouchRipple: true,
                },
            },
            MuiTypography: {
                styleOverrides: {
                    root: {
                        span: {
                            fontSize: "12px",
                            "@media (max-width:600px)": {
                                fontSize: "10px",
                            },
                        },
                    },
                },
            },
        },
    };
};

export function CustomThemeProvider({ children }: { children: ReactNode }) {
    const [mode, setMode] = useState<"light" | "dark">("light");

    useEffect(() => {
        const savedTheme = localStorage.getItem("theme") as "light" | "dark" | null;

        if (savedTheme) {
            setMode(savedTheme);
        } else if (typeof window !== "undefined") {
            const systemPrefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
            setMode(systemPrefersDark ? "dark" : "light");
        }
    }, []);

    const toggleMode = () => {
        setMode((prevMode) => {
            const newMode = prevMode === "light" ? "dark" : "light";
            localStorage.setItem("theme", newMode);

            return newMode;
        });
    };

    const theme = useMemo(() => responsiveFontSizes(createTheme(themeSettings(mode))), [mode]);

    return (
        <ThemeContext.Provider value={{ mode, toggleMode }}>
            <MuiThemeProvider theme={theme}>
                <CssBaseline />
                {children}
            </MuiThemeProvider>
        </ThemeContext.Provider>
    );
}

export function useTheme() {
    const context = useContext(ThemeContext);

    if (context === undefined) {
        throw new Error("useTheme must be used within a CustomThemeProvider");
    }

    return context;
}
