"use client";

import { useState, useEffect } from "react";
import {
    MRT_ColumnDef,
    MRT_ColumnFiltersState,
    MRT_GlobalFilterTextField,
    MRT_ShowHideColumnsButton,
    MRT_SortingState,
    MRT_ToggleDensePaddingButton,
    MRT_ToggleFiltersButton,
    MRT_ToggleFullScreenButton,
    useMaterialReactTable,
} from "material-react-table";
import { Box, Button, IconButton, ListItemIcon, MenuItem, Tooltip, Typography } from "@mui/material";
import { Edit, Delete, Add, CheckOutlined, WarningOutlined } from "@mui/icons-material";
import RefreshIcon from "@mui/icons-material/Refresh";
import { useModal } from "@/providers/ModalProvider";
import * as CONSTANTS from "@/constants/Constants";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { deleteGenreById, getGenres } from "@/actions/genre.actions";
import { deleteUserById, getUsers } from "@/actions/user.actions";
import { deleteMovieById, getMovies } from "@/actions/movie.actions";
import { deleteSerieById, getSeries } from "@/actions/serie.actions";

type TableAdminProps = {
    columns: MRT_ColumnDef<any>[];
    page: string;
    handleAddItem: () => void;
};

const TableAdmin = ({ columns, page, handleAddItem }: TableAdminProps) => {
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
                        let response: any;

                        switch (page) {
                            case "series":
                                response = await deleteSerieById(Number(id));

                                if (response) {
                                    toast.success(`Item with id ${id} deleted succesfully`);
                                    await fetchData();
                                }

                                break;
                            case "movies":
                                response = await deleteMovieById(Number(id));

                                if (response) {
                                    toast.success(`Item with id ${id} deleted succesfully`);
                                    await fetchData();
                                }

                                break;
                            case "genres":
                                response = await deleteGenreById(Number(id));

                                if (response) {
                                    toast.success(`Item with id ${id} deleted succesfully`);
                                    await fetchData();
                                }

                                break;
                            case "users":
                                response = await deleteUserById(Number(id));

                                if (response) {
                                    toast.success(`Item with id ${id} deleted succesfully`);
                                    await fetchData();
                                }

                                break;
                            default:
                                response = null;
                        }

                        setRowSelection([]);
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

    function handleMassiveDelete() {
        const keysArray = Object.keys(rowSelection);

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
                        let response: any;

                        for (const id of keysArray) {
                            switch (page) {
                                case "series":
                                    response = await deleteSerieById(Number(id));

                                    if (response) {
                                        toast.success(`Item with id ${id} deleted succesfully`);
                                        await fetchData();
                                    }

                                    break;
                                case "movies":
                                    response = await deleteMovieById(Number(id));

                                    if (response) {
                                        toast.success(`Item with id ${id} deleted succesfully`);
                                        await fetchData();
                                    }

                                    break;
                                case "genres":
                                    response = await deleteGenreById(Number(id));

                                    if (response) {
                                        toast.success(`Item with id ${id} deleted succesfully`);
                                        await fetchData();
                                    }

                                    break;
                                case "users":
                                    response = await deleteUserById(Number(id));

                                    if (response) {
                                        toast.success(`Item with id ${id} deleted succesfully`);
                                        await fetchData();
                                    }

                                    break;
                                default:
                                    response = null;
                            }
                        }

                        setRowSelection([]);
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
                pageSize: Number(pagination?.pageSize),
                ...(sorting?.length > 0 && {
                    ascOrDesc: sorting[0].desc ? "desc" : "asc",
                    sortBy: sorting[0].id,
                }),
                ...(globalFilter?.length > 0 && {
                    filterNameString: page === "users" ? "userName" : page === "genres" ? "name" : "title",
                    filterValue: globalFilter,
                }),
            };

            switch (page) {
                case "series":
                    response = await getSeries(queryParams);
                    setRows(response.rows);
                    setRowsCount(response.count);
                    break;
                case "movies":
                    response = await getMovies(queryParams);
                    setRows(response.movies);
                    setRowsCount(response.count);
                    break;
                case "genres":
                    response = await getGenres(queryParams);
                    setRows(response.rows);
                    setRowsCount(response.count);
                    break;
                case "users":
                    // @ts-expect-error typeError
                    response = await getUsers(queryParams);
                    setRows(response.rows);
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
        onColumnFiltersChange: setColumnFilters,
        onColumnFilterFnsChange: setColumnFiltersFns,
        onGlobalFilterChange: setGlobalFilter,
        onPaginationChange: setPagination,
        onSortingChange: setSorting,
        onRowSelectionChange: setRowSelection,
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
                <Box
                    sx={() => ({
                        display: "flex",
                        gap: "1rem",
                        p: "10px",
                        justifyContent: "space-between",
                    })}
                >
                    <Box sx={{ display: "flex", gap: "1rem", alignItems: "center" }}>
                        <Tooltip arrow title="Refresh Data">
                            <IconButton
                                onClick={async () => {
                                    await fetchData();
                                }}
                            >
                                <RefreshIcon />
                            </IconButton>
                        </Tooltip>
                        <MRT_GlobalFilterTextField table={table} />
                        <MRT_ToggleFiltersButton table={table} />
                        <MRT_ShowHideColumnsButton table={table} />
                        <MRT_ToggleDensePaddingButton table={table} />
                        <MRT_ToggleFullScreenButton table={table} />
                    </Box>
                    <Box
                        sx={{
                            display: "flex",
                            placeItems: "center",
                            placeContent: "center",
                            gap: "1rem",
                        }}
                    >
                        <Button color="success" onClick={handleAddItem} variant="contained">
                            <Add />
                            <Typography
                                sx={{
                                    textTransform: "capitalize",
                                }}
                            >
                                Add
                            </Typography>
                        </Button>
                        <Button
                            color="error"
                            disabled={!table.getIsSomeRowsSelected()}
                            onClick={() => {
                                handleMassiveDelete();
                            }}
                            variant="contained"
                        >
                            <Delete />
                            <Typography
                                sx={{
                                    textTransform: "capitalize",
                                }}
                            >
                                Delete
                            </Typography>
                        </Button>
                    </Box>
                </Box>
            );
        },
    });

    return {
        table,
    };
};

export default TableAdmin;
