"use client";

import { Card, useTheme } from "@mui/material";
import { Genre } from "@prisma/client";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { tokens } from "@/utils/theme/theme";

interface IGenreItemProps {
    genre: Genre;
}

export default function GenreItem({ genre }: IGenreItemProps) {
    const router = useRouter();
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);

    return (
        <motion.div whileHover={{ scale: 1.03 }} transition={{ duration: 0.2, ease: "easeInOut" }}>
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
                onClick={() => {
                    router.push(`/genres/${genre.name}`);
                }}
            >
                <Link href={`/genres/${genre.name}`} style={{ textDecoration: "none", color: colors.primary[100] }}>
                    {genre.name}
                </Link>
            </Card>
        </motion.div>
    );
}
