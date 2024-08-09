"use client";

import { CssVarsTheme, Divider, useTheme } from "@mui/material";

export default function DividerLine() {
    const theme: CssVarsTheme = useTheme();

    return <Divider sx={{ borderBottomWidth: 3, mt: 1, background: theme.vars.palette.primary.main }} />;
}
