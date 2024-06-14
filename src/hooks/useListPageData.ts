import { useSearchParams } from "react-router-dom";
import { useSorting } from "./useSorting";

export function useListPageData() {
    const [searchParams, setSearchParams] = useSearchParams();
    const handleChangeSorting = useSorting();

    const page = searchParams.get("page") || 1;

    return {
        searchParams,
        setSearchParams,
        handleChangeSorting,
        page,
    };
}
