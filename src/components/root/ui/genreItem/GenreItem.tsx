"use client";

import { Card } from "@mui/material";
import { Genre } from "@prisma/client";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";

interface IGenreItemProps {
    genre: Genre;
}

export default function GenreItem({ genre }: IGenreItemProps) {
    const router = useRouter();

    return (
        <motion.div whileHover={{ scale: 1.05 }} transition={{ duration: 0.2, ease: "easeInOut" }}>
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
                <Link href={`/genres/${genre.name}`} style={{ textDecoration: "none" }}>
                    {genre.name}
                </Link>
            </Card>
        </motion.div>
    );
}
