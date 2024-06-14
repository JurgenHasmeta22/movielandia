import { SelectChangeEvent } from "@mui/material";
import { useSearchParams } from "react-router-dom";

export function useSorting() {
    const [searchParams, setSearchParams] = useSearchParams();

    function handleChangeSorting(type: string, event: SelectChangeEvent) {
        const selectedValue = event.target.value as string;

        if (selectedValue === "none") {
            if (type !== "details") {
                searchParams.delete(`${type}SortBy`);
                searchParams.delete(`${type}AscOrDesc`);
            } else {
                searchParams.delete("sortBy");
                searchParams.delete("ascOrDesc");
            }
        } else {
            const [, sortByValue, ascOrDesc] = selectedValue.match(/(\w+)(Asc|Desc)/) || [];

            if (type !== "details") {
                searchParams.set(`${type}SortBy`, sortByValue);
                searchParams.set(`${type}AscOrDesc`, ascOrDesc.toLowerCase());
            } else {
                searchParams.set("sortBy", sortByValue);
                searchParams.set("ascOrDesc", ascOrDesc.toLowerCase());
            }
        }

        setSearchParams(searchParams);
    }

    return handleChangeSorting;
}
