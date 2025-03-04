"use client";

import { IconButton, useTheme } from "@mui/material";
import type {} from "@mui/material/themeCssVarsAugmentation";

interface SocialButtonProps {
    href: string;
    icon: React.ElementType;
}

export const SocialButton = ({ href, icon: Icon }: SocialButtonProps) => {
    const theme = useTheme();

    return (
        <IconButton
            href={href}
            target="_blank"
            rel="noopener"
            sx={{
                color: theme.vars.palette.primary.main,
                transition: "all 0.2s ease-in-out",
                padding: "8px",
                "&:hover": {
                    color: theme.vars.palette.red.main,
                    backgroundColor: "rgba(255, 255, 255, 0.1)",
                },
            }}
        >
            <Icon />
        </IconButton>
    );
};
