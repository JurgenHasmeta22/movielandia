"use client";

import React from "react";
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

    if (dataType === "actors") {
        delete valueToLabelList.ratingImdbAsc;
        delete valueToLabelList.ratingImdbDesc;
        delete valueToLabelList.durationAsc;
        delete valueToLabelList.durationDesc;
        delete valueToLabelList.titleAsc;
        delete valueToLabelList.titleDesc;
        valueToLabelList.fullnameAsc = "Fullname (Asc)";
        valueToLabelList.fullnameDesc = "Fullname (Desc)";
    }

    if (dataType === "seasons") {
        delete valueToLabelList.durationAsc;
        delete valueToLabelList.durationDesc;
    }

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

    return (
        <Select
            defaultValue={getDefaultValue()}
            value={getValue()}
            onChange={handleChangeSorting}
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
                    <Typography fontSize={"15px"}>
                        {type === "list" ? valueToLabelList[value] : valueToLabelDetails[value]}
                    </Typography>
                </Box>
            )}
        >
            {getSortOptions(type, dataType)}
        </Select>
    );
}
