"use client";

import { IconButton } from "@mui/material";
import { Close } from "@mui/icons-material";
import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { showToast } from "@/utils/helpers/toast";
import { 
    removeMovieFromList,
    removeSerieFromList,
    removeSeasonFromList,
    removeEpisodeFromList,
    removeActorFromList,
    removeCrewFromList 
} from "@/actions/list/listItems.actions";

interface DeleteListItemButtonProps {
    itemId: number;
    listId: number;
    userId: number;
    contentType: string;
}

export const DeleteListItemButton = ({ itemId, listId, userId, contentType }: DeleteListItemButtonProps) => {
    const [isPending, startTransition] = useTransition();
    const router = useRouter();

    const handleDelete = () => {
        startTransition(async () => {
            try {
                switch (contentType.toUpperCase()) {
                    case "MOVIE":
                        await removeMovieFromList(itemId, listId, userId);
                        break;
                    case "SERIE":
                        await removeSerieFromList(itemId, listId, userId);
                        break;
                    case "SEASON":
                        await removeSeasonFromList(itemId, listId, userId);
                        break;
                    case "EPISODE":
                        await removeEpisodeFromList(itemId, listId, userId);
                        break;
                    case "ACTOR":
                        await removeActorFromList(itemId, listId, userId);
                        break;
                    case "CREW":
                        await removeCrewFromList(itemId, listId, userId);
                        break;
                    default:
                        throw new Error("Invalid content type");
                }
                showToast("success", "Item removed from list");
                router.refresh();
            } catch (error) {
                showToast("error", error instanceof Error ? error.message : "Failed to remove item");
            }
        });
    };

    return (
        <IconButton
            onClick={handleDelete}
            disabled={isPending}
            size="small"
            sx={{
                position: "absolute",
                top: 8,
                right: 8,
                bgcolor: "background.paper",
                "&:hover": {
                    bgcolor: "error.main",
                    "& .MuiSvgIcon-root": {
                        color: "common.white"
                    }
                }
            }}
        >
            <Close fontSize="small" />
        </IconButton>
    );
};