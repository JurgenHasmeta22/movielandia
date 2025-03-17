"use client";

import { Box, Checkbox, Typography } from "@mui/material";
import Image from "next/image";

interface SelectableListCardProps {
    item: any;
    type: string;
    isSelected: boolean;
    onToggle: (id: number) => void;
}

export default function SelectableListCard({ item, type, isSelected, onToggle }: SelectableListCardProps) {
    const getItemDetails = () => {
        switch (type) {
            case "movies":
                return {
                    id: item?.movie?.id,
                    title: item?.movie?.title,
                    image: item?.movie?.photoSrcProd,
                    alt: `Movie poster for ${item?.movie?.title}`,
                };
            case "series":
                return {
                    id: item?.serie?.id,
                    title: item?.serie?.title,
                    image: item?.serie?.photoSrcProd,
                    alt: `Series poster for ${item?.serie?.title}`,
                };
            case "actors":
                return {
                    id: item?.actor?.id,
                    title: item?.actor?.fullname,
                    image: item?.actor?.photoSrcProd,
                    alt: `Profile photo of actor ${item?.actor?.fullname}`,
                };
            case "crew":
                return {
                    id: item?.crew?.id,
                    title: item?.crew?.fullname,
                    image: item?.crew?.photoSrcProd,
                    alt: `Profile photo of crew member ${item?.crew?.fullname}`,
                };
            case "seasons":
                return {
                    id: item?.season?.id,
                    title: item?.season?.title,
                    image: item?.season?.photoSrcProd,
                    alt: `Season poster for ${item?.season?.title}`,
                };
            case "episodes":
                return {
                    id: item?.episode?.id,
                    title: item?.episode?.title,
                    image: item?.episode?.photoSrcProd,
                    alt: `Episode still from ${item?.episode?.title}`,
                };
            default:
                return null;
        }
    };

    return (
        <Box
            sx={{
                display: "flex",
                alignItems: "center",
                width: "100%",
                maxWidth: 400,
                bgcolor: "background.paper",
                borderRadius: 1,
                cursor: "pointer",
                "&:hover": {
                    bgcolor: "action.hover",
                },
            }}
            onClick={() => onToggle(getItemDetails()?.id!)}
        >
            <Checkbox checked={isSelected} onChange={() => onToggle(getItemDetails()?.id!)} sx={{ ml: 1 }} />
            <Box sx={{ py: 1 }}>
                <Image
                    src={getItemDetails()?.image || "/images/placeholder.jpg"}
                    alt={getItemDetails()?.alt!}
                    height={40}
                    width={40}
                    style={{ objectFit: "cover" }}
                />
            </Box>
            <Typography
                variant="body1"
                sx={{
                    ml: 2,
                    flex: 1,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                }}
            >
                {getItemDetails()?.title!}
            </Typography>
        </Box>
    );
}
