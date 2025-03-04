"use client";

import { Button, Icon, Stack, Typography, useTheme } from "@mui/material";
import type {} from "@mui/material/themeCssVarsAugmentation";

interface FooterLinkProps {
    href: string;
    text: string;
    icon?: React.ReactElement;
}

export const FooterLink = ({ href, text, icon }: FooterLinkProps) => {
    const theme = useTheme();

    return (
        <Button
            href={href}
            sx={{
                textDecoration: "none",
                textTransform: "capitalize",
                color: theme.vars.palette.primary.main,
                transition: "all 0.2s ease-in-out",
                minWidth: "160px",
                justifyContent: "flex-start",
                "&:hover": {
                    transform: "translateX(8px)",
                    color: theme.vars.palette.red.main,
                },
            }}
        >
            <Stack direction="row" alignItems="center" spacing={1.5} sx={{ width: "100%" }}>
                {icon && <Icon component={() => icon} sx={{ fontSize: 20, minWidth: "24px" }} />}
                <Typography variant="body1">{text}</Typography>
            </Stack>
        </Button>
    );
};
