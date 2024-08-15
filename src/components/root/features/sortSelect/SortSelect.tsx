"use client";

import React, { useEffect, useState } from "react";
import { Box, Select, SvgIcon, Typography } from "@mui/material";
import SwapVertIcon from "@mui/icons-material/SwapVert";
import { toFirstWordUpperCase } from "@/utils/helpers/utils";
import { useSorting } from "@/hooks/useSorting";
import { getSortOptions } from "@/utils/componentHelpers/getSortingOptions";

const valueToLabelList: Record<string, string> = {
    none: "None",
    ratingImdbAsc: "Imdb rating (Asc)",
    ratingImdbDesc: "Imdb rating (Desc)",
    titleAsc: "Title (Asc)",
    titleDesc: "Title (Desc)",
    durationAsc: "Duration (Asc)",
    durationDesc: "Duration (Desc)",
    fullnameAsc: "Fullname (Asc)",
    fullnameDesc: "Fullname (Desc)",
    userNameAsc: "Username (Asc)",
    userNameDesc: "Username (Desc)",
};

const valueToLabelDetails: Record<string, string> = {
    createdAtAsc: "Created At (Asc)",
    createdAtDesc: "Created At (Desc)",
    ratingAsc: "Rating (Asc)",
    ratingDesc: "Rating (Desc)",
};

interface ISortSelectProps {
    sortBy: string;
    ascOrDesc: string;
    type: string;
    dataType: string;
}

export default function SortSelect({ sortBy, ascOrDesc, type, dataType }: ISortSelectProps) {
    const handleChangeSorting = useSorting(dataType);

    const getDefaultValue = () => {
        if (type === "list") {
            return "none";
        }

        return "createdAtDesc";
    };

    const getValue = () => {
        if (sortBy && ascOrDesc) {
            return sortBy + toFirstWordUpperCase(ascOrDesc);
        }

        return getDefaultValue();
    };

    const [value, setValue] = useState(getValue());

    useEffect(() => {
        setValue(getValue());
    }, [sortBy, ascOrDesc]);

    const handleChange = (event: any) => {
        const newValue = event.target.value as string;
        setValue(newValue);
        handleChangeSorting(event);
    };

    const getLabel = (value: string) => {
        return type === "list" ? valueToLabelList[value] : valueToLabelDetails[value];
    };

    return (
        <Select
            value={value}
            onChange={handleChange}
            autoWidth
            sx={{
                border: "1px solid",
            }}
            renderValue={(value: string) => (
                <Box
                    sx={{
                        display: "flex",
                        gap: 0.5,
                        alignItems: "center",
                        justifyContent: "center",
                    }}
                >
                    <SvgIcon fontSize="small">
                        <SwapVertIcon />
                    </SvgIcon>
                    <Typography fontSize={"15px"}>{getLabel(value)}</Typography>
                </Box>
            )}
        >
            {getSortOptions(type, dataType)}
        </Select>
    );
}
