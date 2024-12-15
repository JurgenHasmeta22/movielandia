import { Box, Typography, useTheme } from "@mui/material";
import CardItem, { CardItemType, PathType } from "../cardItem/CardItem";
import type {} from "@mui/material/themeCssVarsAugmentation";

interface IListDetailProps {
    data: any;
    type: CardItemType;
    roleData: string;
}

export function ListDetail({ data, type, roleData }: IListDetailProps) {
    const theme = useTheme();

    if (!data || data.length === 0) return null;

    const getTitle = () => {
        if (type === "actor") {
            return roleData === "cast" ? "Cast" : `Starred ${roleData}`;
        }

        if (type === "crew") {
            return roleData === "production" ? "Crew" : `Worked on ${roleData}`;
        }

        return `${roleData === "related" ? "Related" : ""} ${
            type === "movie"
                ? "Movies"
                : type === "serie"
                  ? "Series"
                  : type === "season"
                    ? "Seasons"
                    : type === "episode"
                      ? "Episodes"
                      : ""
        }`;
    };

    const getItemData = (item: any) => {
        if (type === "actor") {
            if (roleData === "Movies") return item.movie;
            if (roleData === "Series") return item.serie;
            if (roleData === "cast") return item.actor;
        }

        if (type === "crew") {
            if (roleData === "production") return item.crew;
            if (roleData === "Movies") return item.movie;
            if (roleData === "Series") return item.serie;
        }

        return item;
    };

    const getItemPath = () => {
        if (type === "actor") {
            if (roleData === "Movies") return "movies";
            if (roleData === "Series") return "series";
            if (roleData === "cast") return "actors";
        }

        if (type === "crew") {
            if (roleData === "Movies") return "movies";
            if (roleData === "Series") return "series";
            if (roleData === "production") return "crew";
        }

        return null;
    };

    return (
        <Box
            component="section"
            sx={{
                display: "flex",
                flexDirection: "column",
                gap: 4,
                width: "100%",
                maxWidth: "1200px",
                margin: "0 auto",
                px: { xs: 2, sm: 3, md: 4 },
            }}
        >
            <Box
                sx={{
                    mb: { xs: 1, md: 2 },
                    display: "flex",
                    justifyContent: { xs: "center", md: "flex-start" },
                }}
            >
                <Typography
                    variant="h2"
                    sx={{
                        fontSize: { xs: 24, sm: 28, md: 32 },
                        fontWeight: 800,
                        color: theme.vars.palette.text.primary,
                        position: "relative",
                        display: "inline-block",
                        "&::after": {
                            content: '""',
                            position: "absolute",
                            bottom: -8,
                            left: 0,
                            width: "100%",
                            height: 3,
                            bgcolor: theme.vars.palette.primary.main,
                            borderRadius: 1,
                        },
                    }}
                >
                    {getTitle()}
                </Typography>
            </Box>
            <Box
                sx={{
                    display: "grid",
                    gridTemplateColumns: {
                        xs: "repeat(auto-fill, minmax(120px, 1fr))",
                        sm: "repeat(auto-fill, minmax(140px, 1fr))",
                        md: "repeat(auto-fill, minmax(150px, 1fr))",
                        lg: "repeat(auto-fill, minmax(160px, 1fr))",
                    },
                    gap: { xs: 1, sm: 2, md: 3 },
                    width: "100%",
                    justifyItems: { xs: "center", md: "start" },
                }}
            >
                {data.map((item: any, index: number) => (
                    <CardItem key={index} data={getItemData(item)} type={type} path={getItemPath()!} />
                ))}
            </Box>
        </Box>
    );
}

export default ListDetail;
