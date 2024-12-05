import { MenuItem, ListItemIcon, Typography } from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";
import { useRouter } from "next/navigation";

interface RenderRowActionMenuItemsProps {
    closeMenu: () => void;
    row: any;
    page: string;
    handleDelete: (id: number) => void;
}

export const renderRowActionMenuItems = ({ closeMenu, row, page, handleDelete }: RenderRowActionMenuItemsProps) => [
    <MenuItem
        key={0}
        onClick={() => {
            useRouter().push(`/admin/${page}/${row.original.id}`);
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
];
