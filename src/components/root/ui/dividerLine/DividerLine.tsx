"use client";

import { Divider } from "@mui/material";
import type {} from "@mui/material/themeCssVarsAugmentation";
import { useTheme } from "@mui/material-pigment-css";

export default function DividerLine() {
    const theme = useTheme();

    return <Divider sx={{ borderBottomWidth: 3, mt: 1, background: theme.vars.palette.primary.main }} />;
}
