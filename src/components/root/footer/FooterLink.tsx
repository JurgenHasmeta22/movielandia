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
                minWidth: "auto",
                padding: "6px 8px",
                borderRadius: "8px",
                justifyContent: "flex-start",
                opacity: 0.85,
                "&:hover": {
                    backgroundColor: "rgba(255, 255, 255, 0.03)",
                    transform: "translateX(5px)",
                    color: theme.vars.palette.red.main,
                    opacity: 1,
                },
            }}
        >
            <Stack direction="row" alignItems="center" spacing={1.5} sx={{ width: "100%" }}>
                {icon && (
                    <Icon
                        component={() => icon}
                        sx={{
                            fontSize: 18,
                            minWidth: "20px",
                            color: "inherit",
                            opacity: 0.9,
                        }}
                    />
                )}
                <Typography
                    variant="body2"
                    sx={{
                        fontWeight: 500,
                        fontSize: { xs: "0.875rem", md: "0.9rem" },
                    }}
                >
                    {text}
                </Typography>
            </Stack>
        </Button>
    );
};
