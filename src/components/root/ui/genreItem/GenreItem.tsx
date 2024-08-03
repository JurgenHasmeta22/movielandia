"use client";

import { Card, Typography, useTheme } from "@mui/material";
import { Genre } from "@prisma/client";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { tokens } from "@/utils/theme/theme";
import Link from "next/link";

interface IGenreItemProps {
    genre: Genre;
}

export default function GenreItem({ genre }: IGenreItemProps) {
    const router = useRouter();

    const theme = useTheme();
    const colors = tokens(theme.palette.mode);

    return (
        <motion.div whileHover={{ scale: 1.03 }} transition={{ duration: 0.2, ease: "easeInOut" }}>
            <Link href={`/genres/${genre.id}/${genre.name}`}>
                <Card
                    key={genre.id}
                    sx={{
                        display: "flex",
                        placeItems: "center",
                        placeContent: "center",
                        cursor: "pointer",
                        height: "250px",
                        width: "180px",
                        backgroundColor: `colors.secondary`,
                    }}
                    elevation={4}
                >
                    <Typography sx={{ textDecoration: "none", color: colors.primary[100] }}>{genre.name}</Typography>
                </Card>
            </Link>
        </motion.div>
    );
}
