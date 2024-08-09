"use client";

import React, { ReactNode } from "react";
import {
    experimental_extendTheme as extendTheme,
    responsiveFontSizes,
    Experimental_CssVarsProvider as CssVarsProvider,
} from "@mui/material/styles";

const colorTokens = {
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
        1000: "#212529",
        1100: "#a3acb4",
        1200: "#e7e7e8",
        1300: "#90979f",
        1400: "#eef0ef",
        1500: "#9ba2a9",
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
};

export const theme = responsiveFontSizes(
    extendTheme({
        colorSchemes: {
            light: {
                palette: {
                    primary: {
                        main: colorTokens.primary[100],
                    },
                    secondary: {
                        main: colorTokens.greenAccent[500],
                    },
                    background: {
                        default: "#fcfcfc",
                    },
                },
            },
            dark: {
                palette: {
                    primary: {
                        main: colorTokens.primary[500],
                    },
                    secondary: {
                        main: colorTokens.greenAccent[500],
                    },
                    background: {
                        default: colorTokens.primary[500],
                    },
                },
            },
        },
        transitions: {
            easing: {
                sharp: "cubic-bezier(0.4, 0, 0.6, 1)",
            },
            duration: {
                enteringScreen: 350,
                leavingScreen: 350,
            },
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
    }),
);

export function ThemeProvider({ children }: { children: ReactNode }) {
    return <CssVarsProvider theme={theme}>{children}</CssVarsProvider>;
}
