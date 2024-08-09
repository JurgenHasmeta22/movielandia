"use client";

import { useEffect, useState } from "react";
import {
    Box,
    List,
    Typography,
    Avatar,
    Drawer,
    IconButton,
    useTheme,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
} from "@mui/material";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import CloseIcon from "@mui/icons-material/Close";
import { useStore } from "@/store/store";

import { SidebarItem } from "./components/SidebarItem";
import LogoutIcon from "@mui/icons-material/Logout";
import { useRouter } from "next/navigation";
import { signOut, useSession } from "next-auth/react";

const Sidebar = ({ sidebarItems }: any) => {
    const { data: session } = useSession();

    const [selectedLabel, setSelectedLabel] = useState("");
    const [height, setHeight] = useState(0);
    const { isOpenSidebarAdmin, setIsOpenSidebarAdmin } = useStore();

    const router = useRouter();

    const theme: CssVarsTheme = useTheme();

    const handleItemClick = (title: string, to: string) => {
        setSelectedLabel(title);
        router.push(to);

        if (height < 768) {
            setIsOpenSidebarAdmin(false);
        }
    };

    const onClose = () => {
        setIsOpenSidebarAdmin(false);
    };

    useEffect(() => {
        setHeight(window.innerHeight);
    }, []);

    return (
        <Drawer
            variant={"persistent"}
            anchor={"left"}
            open={isOpenSidebarAdmin}
            component={"aside"}
            onClose={onClose}
            PaperProps={{
                sx: { backgroundColor: colors.grey[1000], paddingLeft: 2, paddingRight: 2 },
            }}
        >
            <Box mt={2}>
                <Box display="flex" justifyContent="end" alignItems="center" mb={2}>
                    <IconButton onClick={onClose}>
                        <CloseIcon color="action" />
                    </IconButton>
                </Box>
                <Box display="flex" alignItems="center" mb={2} ml={2}>
                    <Avatar>
                        <AccountCircleIcon />
                    </Avatar>
                    <Box ml={2}>
                        <Typography variant="body2" sx={{ color: theme.vars.palette.primary.main }}>
                            {session?.user && `@${session?.user?.userName}`}
                        </Typography>
                    </Box>
                </Box>
                <List disablePadding>
                    {sidebarItems?.map((item: any, index: number) => (
                        <SidebarItem
                            key={index}
                            item={item}
                            index={index}
                            selectedLabel={selectedLabel}
                            handleItemClick={handleItemClick}
                        />
                    ))}
                    <ListItem
                        value={"logout"}
                        sx={{
                            py: 3,
                            px: 3,
                        }}
                    >
                        <ListItemButton
                            sx={{
                                color: colors.grey[1500],
                                "&:hover": {
                                    backgroundColor: colors.primary[1000],
                                    "& .MuiListItemIcon-root": {
                                        color: colors.grey[1400],
                                    },
                                    "& .MuiListItemText-primary": {
                                        color: colors.grey[1400],
                                    },
                                },
                            }}
                            onClick={async () => {
                                await signOut();
                                router.push("/login");
                            }}
                        >
                            <ListItemIcon>
                                <LogoutIcon />
                            </ListItemIcon>
                            <ListItemText primary={"Logout"} />
                        </ListItemButton>
                    </ListItem>
                </List>
            </Box>
        </Drawer>
    );
};

export default Sidebar;
