"use client";

import { Divider, useTheme } from "@mui/material";
import type {} from "@mui/material/themeCssVarsAugmentation";

export default function DividerLine() {
    const theme = useTheme();

    return <Divider sx={{ borderBottomWidth: 3, mt: 1, background: theme.vars.palette.primary.main }} />;
}
