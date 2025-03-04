"use client";

import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import { PlaylistType } from "@prisma/client";
import { useRouter, useSearchParams } from "next/navigation";

interface ListTypeSelectProps {
    type?: string;
}

export default function ListTypeSelect({ type }: ListTypeSelectProps) {
    const router = useRouter();
    const searchParams = useSearchParams();

    const handleTypeChange = (value: string) => {
        const params = new URLSearchParams(searchParams.toString());

        if (value) {
            params.set("listsType", value);
        } else {
            params.delete("listsType");
        }

        router.push(`?${params.toString()}`);
    };

    return (
        <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel>Type</InputLabel>
            <Select value={type || ""} label="Type" onChange={(e) => handleTypeChange(e.target.value)}>
                <MenuItem value="">All</MenuItem>
                <MenuItem value={PlaylistType.Custom}>Custom</MenuItem>
                <MenuItem value={PlaylistType.Watchlist}>Watchlist</MenuItem>
                <MenuItem value={PlaylistType.Favorites}>Favorites</MenuItem>
                <MenuItem value={PlaylistType.Watched}>Watched</MenuItem>
            </Select>
        </FormControl>
    );
}
