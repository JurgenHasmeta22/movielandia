"use client";

import { Chip, ChipProps } from "@mui/material";
import { ContentType } from "@prisma/client";
import MovieIcon from "@mui/icons-material/Movie";
import TvIcon from "@mui/icons-material/Tv";
import VideoLibraryIcon from "@mui/icons-material/VideoLibrary";
import OndemandVideoIcon from "@mui/icons-material/OndemandVideo";
import PersonIcon from "@mui/icons-material/Person";
import WorkIcon from "@mui/icons-material/Work";
import PeopleIcon from "@mui/icons-material/People";
import { JSX } from "react";

interface ContentTypeLabelProps {
    contentType: ContentType | null;
    size?: "small" | "medium";
    variant?: "filled" | "outlined";
}

export default function ContentTypeLabel({ contentType, size = "medium", variant = "filled" }: ContentTypeLabelProps) {
    if (!contentType) {
        return null;
    }

    const getChipProps = (): {
        label: string;
        color: ChipProps["color"];
        icon: JSX.Element;
    } => {
        switch (contentType) {
            case "movie":
                return {
                    label: "Movies",
                    color: "primary",
                    icon: <MovieIcon fontSize={size} />,
                };
            case "serie":
                return {
                    label: "Series",
                    color: "secondary",
                    icon: <TvIcon fontSize={size} />,
                };
            case "season":
                return {
                    label: "Seasons",
                    color: "info",
                    icon: <VideoLibraryIcon fontSize={size} />,
                };
            case "episode":
                return {
                    label: "Episodes",
                    color: "success",
                    icon: <OndemandVideoIcon fontSize={size} />,
                };
            case "actor":
                return {
                    label: "Actors",
                    color: "warning",
                    icon: <PersonIcon fontSize={size} />,
                };
            case "crew":
                return {
                    label: "Crew",
                    color: "error",
                    icon: <WorkIcon fontSize={size} />,
                };
            case "user":
                return {
                    label: "Users",
                    color: "default",
                    icon: <PeopleIcon fontSize={size} />,
                };
            default:
                return {
                    label: "Unknown",
                    color: "default",
                    icon: <MovieIcon fontSize={size} />,
                };
        }
    };

    const { label, color, icon } = getChipProps();

    return (
        <Chip
            label={label}
            color={color}
            icon={icon}
            size={size}
            variant={variant}
            sx={{
                fontWeight: 600,
                fontSize: size === "medium" ? "1rem" : undefined,
                height: size === "medium" ? 36 : undefined,
                borderRadius: size === "medium" ? 18 : undefined,
                "& .MuiChip-icon": {
                    marginLeft: size === "small" ? 0.5 : 0.75,
                    fontSize: size === "medium" ? "1.25rem" : undefined,
                },
                "& .MuiChip-label": {
                    paddingLeft: size === "medium" ? 1 : undefined,
                    paddingRight: size === "medium" ? 2 : undefined,
                },
            }}
        />
    );
}
