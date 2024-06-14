"use client";

import { createTheme } from "@mui/material/styles";

const theme = createTheme({
    palette: {
        primary: {
            main: "#fcba03",
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
});

export default theme;
