"use client";

import React from "react";
import { Box, MenuItem, Select, SvgIcon, Typography } from "@mui/material";
import SwapVertIcon from "@mui/icons-material/SwapVert";
import { toFirstWordUpperCase } from "@/utils/functions/utils";
import { useSorting } from "@/hooks/useSorting";

const valueToLabelList: Record<string, string> = {
    none: "None",
    ratingImdbAsc: "Imdb rating (Asc)",
    ratingImdbDesc: "Imdb rating (Desc)",
    titleAsc: "Title (Asc)",
    titleDesc: "Title (Desc)",
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

    return (
        <Select
            defaultValue={getDefaultValue()}
            value={getValue()}
            onChange={handleChangeSorting}
            renderValue={(value: string) => (
                <Box sx={{ display: "flex", gap: 0.5 }}>
                    <SvgIcon fontSize="medium">
                        <SwapVertIcon />
                    </SvgIcon>
                    <Typography>{type === "list" ? valueToLabelList[value] : valueToLabelDetails[value]}</Typography>
                </Box>
            )}
        >
            {type === "list"
                ? [
                      <MenuItem key="none" value="none">
                          None
                      </MenuItem>,
                      <MenuItem key="ratingImdbAsc" value="ratingImdbAsc">
                          Imdb rating (Asc)
                      </MenuItem>,
                      <MenuItem key="ratingImdbDesc" value="ratingImdbDesc">
                          Imdb rating (Desc)
                      </MenuItem>,
                      <MenuItem key="titleAsc" value="titleAsc">
                          Title (Asc)
                      </MenuItem>,
                      <MenuItem key="titleDesc" value="titleDesc">
                          Title (Desc)
                      </MenuItem>,
                  ]
                : [
                      <MenuItem key="createdAtAsc" value="createdAtAsc">
                          Created At (Asc)
                      </MenuItem>,
                      <MenuItem key="createdAtDesc" value="createdAtDesc">
                          Created At (Desc)
                      </MenuItem>,
                      <MenuItem key="ratingAsc" value="ratingAsc">
                          Rating (Asc)
                      </MenuItem>,
                      <MenuItem key="ratingDesc" value="ratingDesc">
                          Rating (Desc)
                      </MenuItem>,
                  ]}
        </Select>
    );
}
