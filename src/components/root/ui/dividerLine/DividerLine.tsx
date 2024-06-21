"use client";

import { Divider, useTheme } from "@mui/material";
import { tokens } from "@/utils/theme";

export default function DividerLine() {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);

    return <Divider sx={{ borderBottomWidth: 3, mt: 1, background: colors.primary[100] }} />;
}
