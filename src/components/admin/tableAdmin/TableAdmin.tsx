"use client";

// #region "Imports"
import { useState, useEffect, useMemo } from "react";
import { MRT_ColumnFiltersState, MRT_SortingState, useMaterialReactTable } from "material-react-table";
import { ListItemIcon, MenuItem, Typography } from "@mui/material";
import { Edit, Delete, CheckOutlined, WarningOutlined } from "@mui/icons-material";
import { useModal } from "@/providers/ModalProvider";
import * as CONSTANTS from "@/constants/Constants";
import { useRouter } from "next/navigation";
import { getGenresWithFilters } from "@/actions/genre.actions";
import { getUsersWithFilters } from "@/actions/user.actions";
import { getMoviesWithFilters } from "@/actions/movie.actions";
import { getSeriesWithFilters } from "@/actions/serie.actions";
import { getActorsWithFilters } from "@/actions/actor.actions";
import { getEpisodesWithFilters } from "@/actions/episode.actions";
import { getSeasonsWithFilters } from "@/actions/season.actions";
import { getCrewMembersWithFilters } from "@/actions/crew.actions";
import { getColumns } from "./utils/tableColumns";
import { handleDeleteById, handleMassiveDelete } from "./utils/tableDelete";
import { TableToolbar } from "./components/TableToolbar";
// #endregion

// #region "Interfaces"
interface ITableAdminProps {
    page: string;
    handleAddItem: () => void;
}

type FilterOperator = "equals" | ">" | "=" | "<" | "gt" | "lt";

const mapFilterOperator = (operator: string): FilterOperator => {
    switch (operator) {
        case "contains":
            return "equals";
        case "greaterThan":
            return "gt";
        case "lessThan":
            return "lt";
        case "equals":
            return "equals";
        default:
            return "equals";
    }
};
// #endregion

const TableAdmin = ({ page, handleAddItem }: ITableAdminProps) => {
    // #region "State Management, Hooks"
    const [rows, setRows] = useState<any[]>([]);
    const [rowsCount, setRowsCount] = useState<number>(0);
    const [rowSelection, setRowSelection] = useState<any>({});
    const [isError, setIsError] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isRefetching, setIsRefetching] = useState(false);

    const [columnFilters, setColumnFilters] = useState<MRT_ColumnFiltersState>([]);
    const [columnFiltersFns, setColumnFiltersFns] = useState<any>([]);
    const [globalFilter, setGlobalFilter] = useState("");
    const [sorting, setSorting] = useState<MRT_SortingState>([]);
    const [pagination, setPagination] = useState({
        pageIndex: 0,
        pageSize: 10,
    });
    const [open, setOpen] = useState(false);

    const router = useRouter();
    const { openModal } = useModal();
    // #endregion

    // #region "Delete methods"
    function handleDelete(id: number) {
        openModal({
            onClose: () => setOpen(false),
            title: `Delete selected ${page}`,
            actions: [
                {
                    label: CONSTANTS.MODAL__DELETE__NO,
                    onClick: () => setOpen(false),
                    color: "secondary",
                    variant: "contained",
                    sx: {
                        bgcolor: "#ff5252",
                    },
                    icon: <WarningOutlined />,
                },
                {
                    label: CONSTANTS.MODAL__DELETE__YES,
                    onClick: async () => {
                        const response = await handleDeleteById({ page, id });

                        if (response) {
                            await fetchData();
                            setRowSelection([]);
                        }
                    },
                    type: "submit",
                    color: "secondary",
                    variant: "contained",
                    sx: {
                        bgcolor: "#30969f",
                    },
                    icon: <CheckOutlined />,
                },
            ],
            subTitle: "Do you want to delete selected rows ?",
        });
    }

    function handleBulkDelete() {
        const selectedIds = Object.keys(rowSelection);

        openModal({
            onClose: () => setOpen(false),
            title: `Delete selected ${page}`,
            actions: [
                {
                    label: CONSTANTS.MODAL__DELETE__NO,
                    onClick: () => setOpen(false),
                    color: "secondary",
                    variant: "contained",
                    sx: {
                        bgcolor: "#ff5252",
                    },
                    icon: <WarningOutlined />,
                },
                {
                    label: CONSTANTS.MODAL__DELETE__YES,
                    onClick: async () => {
                        const results = await handleMassiveDelete({ page, selectedIds });

                        if (results.some((result) => result !== null)) {
                            await fetchData();
                            setRowSelection([]);
                        }
                    },
                    type: "submit",
                    color: "secondary",
                    variant: "contained",
                    sx: {
                        bgcolor: "#30969f",
                    },
                    icon: <CheckOutlined />,
                },
            ],
            subTitle: "Do you want to delete selected rows ?",
        });
    }
    // #endregion

    // #region "Data fetching"
    const fetchData = async () => {
        if (!rows?.length) {
            setIsLoading(true);
        } else {
            setIsRefetching(true);
        }

        try {
            let response: any;

            const queryParams = {
                page: Number(pagination?.pageIndex + 1),
                perPage: Number(pagination?.pageSize),
                ...(sorting?.length > 0 && {
                    ascOrDesc: sorting[0].desc ? "desc" : "asc",
                    sortBy: sorting[0].id as string,
                }),
                ...(globalFilter?.length > 0 && {
                    filterNameString:
                        page === "users"
                            ? "userName"
                            : page === "genres"
                              ? "name"
                              : page === "actors"
                                ? "name"
                                : page === "crew"
                                  ? "fullname"
                                  : "title",
                    filterValue: globalFilter as string,
                    filterOperatorString: "equals" as FilterOperator,
                }),
                ...(columnFilters?.length > 0 && {
                    filterNameString: columnFilters[0].id as string,
                    filterValue: String(columnFilters[0].value),
                    filterOperatorString: mapFilterOperator(columnFiltersFns[0] || "contains"),
                }),
            };

            switch (page) {
                case "series":
                    response = await getSeriesWithFilters(queryParams);
                    setRows(response.rows);
                    setRowsCount(response.count);
                    break;
                case "movies":
                    response = await getMoviesWithFilters(queryParams);
                    setRows(response.movies);
                    setRowsCount(response.count);
                    break;
                case "genres":
                    // @ts-ignore
                    response = await getGenresWithFilters(queryParams);
                    setRows(response.rows);
                    setRowsCount(response.count);
                    break;
                case "users":
                    response = await getUsersWithFilters(queryParams);
                    setRows(response.rows);
                    setRowsCount(response.count);
                    break;
                case "actors":
                    response = await getActorsWithFilters(queryParams);
                    setRows(response.actors);
                    setRowsCount(response.count);
                    break;
                case "episodes":
                    response = await getEpisodesWithFilters(queryParams);
                    setRows(response.episodes);
                    setRowsCount(response.count);
                    break;
                case "seasons":
                    response = await getSeasonsWithFilters(queryParams);
                    setRows(response.seasons);
                    setRowsCount(response.count);
                    break;
                case "crews":
                    response = await getCrewMembersWithFilters(queryParams);
                    setRows(response.crewMembers);
                    setRowsCount(response.count);
                    break;
                default:
                    response = { rows: [], count: 0 };
            }
        } catch (error) {
            setIsError(true);
            console.error(error);
        }

        setIsError(false);
        setIsLoading(false);
        setIsRefetching(false);
    };

    useEffect(() => {
        fetchData();
    }, [columnFilters, globalFilter, pagination.pageIndex, pagination.pageSize, sorting]);
    // #endregion

    // #region "Table, Columns configuration"
    const columns = useMemo(() => getColumns(page), [page]);

    const table = useMaterialReactTable({
        columns,
        data: rows,
        rowCount: rowsCount,
        getRowId: (row) => String(row.id),
        enableColumnOrdering: true,
        enableRowSelection: true,
        enableFullScreenToggle: true,
        enablePagination: true,
        enableRowActions: true,
        enablePinning: true,
        enableSortingRemoval: true,
        enableColumnFilterModes: true,
        enableGlobalFilter: true,
        enableColumnActions: true,
        enableColumnFilters: true,
        enableClickToCopy: true,
        enableStickyHeader: true,
        enableStickyFooter: true,
        manualFiltering: true,
        manualPagination: true,
        manualSorting: true,
        muiToolbarAlertBannerProps: isError
            ? {
                  color: "error",
                  children: "Error loading data",
              }
            : undefined,
        onColumnFiltersChange: setColumnFilters,
        onColumnFilterFnsChange: setColumnFiltersFns,
        onGlobalFilterChange: setGlobalFilter,
        onPaginationChange: setPagination,
        onSortingChange: setSorting,
        initialState: {
            columnVisibility: { id: false },
            showColumnFilters: false,
            showGlobalFilter: true,
            showLoadingOverlay: false,
            isFullScreen: false,
            density: "compact",
            columnPinning: {
                left: ["mrt-row-expand", "mrt-row-select"],
                right: ["mrt-row-actions"],
            },
            columnFilters,
            globalFilter,
            isLoading,
            pagination,
            showAlertBanner: isError,
            showProgressBars: isRefetching,
            sorting,
        },
        onRowSelectionChange: (updatedSelection) => {
            if (typeof updatedSelection === "function") {
                setRowSelection((prev: any) => {
                    const newSelection = updatedSelection(prev);
                    const allSelected = rows.every((row) => newSelection[row.id]);
                    const someSelected = rows.some((row) => newSelection[row.id]);

                    if (allSelected) {
                        // When select all is clicked, select all rows on the current page
                        return rows.reduce((acc, row) => {
                            acc[row.id] = true;
                            return acc;
                        }, {} as Record<string, boolean>);
                    } else if (!someSelected) {
                        return {};
                    }

                    return newSelection;
                });
            } else {
                setRowSelection(updatedSelection);
            }
        },
        state: {
            rowSelection,
            columnFilters,
            globalFilter,
            isLoading,
            pagination,
            showAlertBanner: isError,
            showProgressBars: isRefetching,
            sorting,
        },
        paginationDisplayMode: "pages",
        positionToolbarAlertBanner: "bottom",
        muiSearchTextFieldProps: {
            size: "small",
            variant: "outlined",
        },
        muiTablePaperProps: {
            style: {
                padding: 18,
            },
        },
        muiPaginationProps: {
            color: "secondary",
            rowsPerPageOptions: [5, 10, 15, 20],
            shape: "rounded",
            size: "small",
            variant: "outlined",
            style: {
                paddingTop: 6,
            },
            sx: {
                ".MuiPaginationItem-root": {
                    "&:hover": {
                        backgroundColor: "#30969f33",
                    },
                    "&.Mui-selected": {
                        backgroundColor: "#30969f",
                        color: "white",
                        "&:hover": {
                            backgroundColor: "#30969fcc",
                        },
                    },
                },
            },
        },
        renderRowActionMenuItems: ({ closeMenu, row }) => [
            <MenuItem
                key={0}
                onClick={() => {
                    router.push(`/admin/${page}/${row.original.id}`);
                    closeMenu();
                }}
                sx={{ m: 0 }}
            >
                <ListItemIcon>
                    <Edit />
                </ListItemIcon>
                <Typography>Edit</Typography>
            </MenuItem>,
            <MenuItem
                key={1}
                onClick={async () => {
                    handleDelete(Number(row.id));
                    closeMenu();
                }}
                sx={{ m: 0 }}
            >
                <ListItemIcon>
                    <Delete />
                </ListItemIcon>
                <Typography>Delete</Typography>
            </MenuItem>,
        ],
        renderTopToolbar: ({ table }) => {
            return (
                <TableToolbar
                    table={table}
                    handleMassiveDelete={handleBulkDelete}
                    handleFetchData={fetchData}
                    handleAddItem={handleAddItem}
                />
            );
        },
    });
    // #endregion

    return {
        table,
    };
};

export default TableAdmin;
