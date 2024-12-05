"use client";

// #region "Imports"
import { useState, useEffect, useMemo } from "react";
import { MRT_ColumnFiltersState, MRT_SortingState, useMaterialReactTable } from "material-react-table";
import { CheckOutlined, WarningOutlined } from "@mui/icons-material";
import { useModal } from "@/providers/ModalProvider";
import * as CONSTANTS from "@/constants/Constants";
import { toast } from "react-toastify";
import { handleDeleteById, handleMassiveDelete as handleMassiveDeleteUtil } from "./utils/tableDelete";
import { getColumns } from "./utils/tableColumns";
import { renderRowActionMenuItems } from "./components/TableActions";
import { renderTopToolbar } from "./components/TableToolbar";
import { fetchData } from "./utils/tableFetch";
// #endregion

// #region "Interfaces"
interface ITableAdminProps {
    page: string;
    handleAddItem: () => void;
}
// #endregion

const TableAdmin = ({ page, handleAddItem }: ITableAdminProps) => {
    // #region "State, Hooks"
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
    const { openModal } = useModal();
    // #endregion

    // #region "Delete individually and massive methods"
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
                        await handleDeleteById({ page, id, handleFetchData });
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
                        await handleMassiveDeleteUtil({ page, selectedIds, handleFetchData });
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

    // #region "Fetching"
    const handleFetchData = async () => {
        if (!rows?.length) {
            setIsLoading(true);
        } else {
            setIsRefetching(true);
        }

        await fetchData({
            page,
            pagination,
            sorting,
            globalFilter,
            setRows,
            setRowsCount,
            setIsError,
            setIsLoading,
            setIsRefetching,
        });
    };

    useEffect(() => {
        handleFetchData();
    }, [columnFilters, globalFilter, pagination.pageIndex, pagination.pageSize, sorting]);
    // #endregion

    // #region "Table, columns configuration"
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
        renderRowActionMenuItems: (props) => renderRowActionMenuItems({ ...props, page, handleDelete }),
        renderTopToolbar: (props) =>
            renderTopToolbar({ ...props, handleFetchData, handleAddItem, handleMassiveDelete }),
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
    });
    // #endregion

    return {
        table,
    };
};

export default TableAdmin;
