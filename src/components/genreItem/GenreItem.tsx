"use client";

import { Card, Typography } from "@mui/material";
import { Genre } from "@prisma/client";
import { useRouter } from "next/navigation";

interface IGenreItemProps {
    genre: Genre;
}

export default function GenreItem({ genre }: IGenreItemProps) {
    const router = useRouter();

    return (
        <Card
            key={genre.id}
            sx={{
                display: "flex",
                placeItems: "center",
                placeContent: "center",
                cursor: "pointer",
                height: "200px",
                width: "200px",
                backgroundColor: `colors.secondary`,
            }}
            elevation={4}
            onClick={() => {
                router.push(`/genres/${genre.name}`);
            }}
        >
            <Typography component={"span"}>{genre.name}</Typography>
        </Card>
    );
}
