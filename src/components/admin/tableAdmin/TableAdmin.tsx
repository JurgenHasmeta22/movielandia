// #region "Imports"
"use client";

import { useState, useEffect, useMemo } from "react";
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
import { deleteGenreById, getGenresWithFilters } from "@/actions/genre.actions";
import { deleteUserById, getUsersWithFilters } from "@/actions/user.actions";
import { deleteMovieById, getMoviesWithFilters } from "@/actions/movie.actions";
import { deleteSerieById, getSeriesWithFilters } from "@/actions/serie.actions";
import { deleteActorById, getActorsWithFilters } from "@/actions/actor.actions";
import { deleteEpisodeById, getEpisodesWithFilters } from "@/actions/episode.actions";
import { deleteSeasonById, getSeasonsWithFilters } from "@/actions/season.actions";
import { deleteCrewMemberById, getCrewMembersWithFilters } from "@/actions/crew.actions";
// #endregion

// #region "Interfaces"
interface ITableAdminProps {
    page: string;
    handleAddItem: () => void;
}
// #endregion

const TableAdmin = ({ page, handleAddItem }: ITableAdminProps) => {
    // #region "State Management, calling other Hooks"
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

    // #region "Delete individually and massive on methods"
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
                            case "actors":
                                response = await deleteActorById(Number(id));

                                if (response) {
                                    toast.success(`Item with id ${id} deleted succesfully`);
                                    await fetchData();
                                }

                                break;
                            case "episodes":
                                response = await deleteEpisodeById(Number(id));

                                if (response) {
                                    toast.success(`Item with id ${id} deleted succesfully`);
                                    await fetchData();
                                }

                                break;
                            case "seasons":
                                response = await deleteSeasonById(Number(id));

                                if (response) {
                                    toast.success(`Item with id ${id} deleted succesfully`);
                                    await fetchData();
                                }

                                break;
                            case "crews":
                                response = await deleteCrewMemberById(Number(id));

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
                                case "actors":
                                    response = await deleteActorById(Number(id));

                                    if (response) {
                                        toast.success(`Item with id ${id} deleted succesfully`);
                                        await fetchData();
                                    }

                                    break;
                                case "episodes":
                                    response = await deleteEpisodeById(Number(id));

                                    if (response) {
                                        toast.success(`Item with id ${id} deleted succesfully`);
                                        await fetchData();
                                    }

                                    break;
                                case "seasons":
                                    response = await deleteSeasonById(Number(id));

                                    if (response) {
                                        toast.success(`Item with id ${id} deleted succesfully`);
                                        await fetchData();
                                    }

                                    break;
                                case "crews":
                                    response = await deleteCrewMemberById(Number(id));

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
    // #endregion

    // #region "Doing all the fetching also with error handling"
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
                    filterValue: globalFilter,
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

    // #region "Table configuration"
    const columns = useMemo<MRT_ColumnDef<any>[]>(() => {
        switch (page) {
            case "crews":
                return [
                    {
                        accessorKey: "fullname",
                        header: "Full Name",
                    },
                    {
                        accessorKey: "photoSrc",
                        header: "Photo URL",
                    },
                    {
                        accessorKey: "role",
                        header: "Role",
                    },
                    {
                        accessorKey: "description",
                        header: "Description",
                    },
                    {
                        accessorKey: "debut",
                        header: "Debut",
                    },
                ];
            case "actors":
                return [
                    {
                        accessorKey: "fullname",
                        header: "Full Name",
                    },
                    {
                        accessorKey: "photoSrc",
                        header: "Photo URL",
                    },
                    {
                        accessorKey: "description",
                        header: "Description",
                    },
                    {
                        accessorKey: "debut",
                        header: "Debut",
                    },
                ];
            case "seasons":
                return [
                    {
                        accessorKey: "title",
                        header: "Title",
                    },
                    {
                        accessorKey: "photoSrc",
                        header: "Photo URL",
                    },
                    {
                        accessorKey: "trailerSrc",
                        header: "Trailer URL",
                    },
                    {
                        accessorKey: "description",
                        header: "Description",
                    },
                    {
                        accessorKey: "dateAired",
                        header: "Date Aired",
                    },
                    {
                        accessorKey: "ratingImdb",
                        header: "IMDB Rating",
                    },
                    {
                        accessorKey: "serieId",
                        header: "Serie ID",
                    },
                ];
            case "episodes":
                return [
                    {
                        accessorKey: "title",
                        header: "Title",
                    },
                    {
                        accessorKey: "photoSrc",
                        header: "Photo URL",
                    },
                    {
                        accessorKey: "trailerSrc",
                        header: "Trailer URL",
                    },
                    {
                        accessorKey: "description",
                        header: "Description",
                    },
                    {
                        accessorKey: "duration",
                        header: "Duration (minutes)",
                    },
                    {
                        accessorKey: "dateAired",
                        header: "Date Aired",
                    },
                    {
                        accessorKey: "ratingImdb",
                        header: "IMDB Rating",
                    },
                    {
                        accessorKey: "seasonId",
                        header: "Season ID",
                    },
                ];
            case "series":
                return [
                    {
                        accessorKey: "title",
                        header: "Title",
                    },
                    {
                        accessorKey: "photoSrc",
                        header: "Photo URL",
                    },
                    {
                        accessorKey: "trailerSrc",
                        header: "Trailer URL",
                    },
                    {
                        accessorKey: "description",
                        header: "Description",
                    },
                    {
                        accessorKey: "dateAired",
                        header: "Date Aired",
                    },
                    {
                        accessorKey: "ratingImdb",
                        header: "IMDB Rating",
                    },
                    {
                        accessorKey: "genreId",
                        header: "Genre ID",
                    },
                ];
            case "movies":
                return [
                    {
                        accessorKey: "title",
                        header: "Title",
                    },
                    {
                        accessorKey: "photoSrc",
                        header: "Photo URL",
                    },
                    {
                        accessorKey: "trailerSrc",
                        header: "Trailer URL",
                    },
                    {
                        accessorKey: "description",
                        header: "Description",
                    },
                    {
                        accessorKey: "dateAired",
                        header: "Date Aired",
                    },
                    {
                        accessorKey: "ratingImdb",
                        header: "IMDB Rating",
                    },
                    {
                        accessorKey: "genreId",
                        header: "Genre ID",
                    },
                ];
            case "genres":
                return [
                    {
                        accessorKey: "name",
                        header: "Name",
                    },
                    {
                        accessorKey: "description",
                        header: "Description",
                    },
                ];
            case "users":
                return [
                    {
                        accessorKey: "userName",
                        header: "User Name",
                    },
                    {
                        accessorKey: "email",
                        header: "Email",
                    },
                    {
                        accessorKey: "password",
                        header: "Password",
                    },
                ];
            default:
                return [];
        }
    }, [page]);

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
    // #endregion

    return {
        table,
    };
};

export default TableAdmin;
