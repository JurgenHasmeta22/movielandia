import { Card, Typography } from "@mui/material";
import { Genre } from "@prisma/client";

interface IGenreItemProps {
    genre: Genre;
}

export default function GenreItem({ genre }: IGenreItemProps) {
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
        >
            <Typography component={"span"}>{genre.name}</Typography>
        </Card>
    );
}
