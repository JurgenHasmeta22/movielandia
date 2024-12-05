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
import { IS_BROWSER } from "@/utils/helpers/utils";
import type {} from "@mui/material/themeCssVarsAugmentation";

interface ISidebarItem {
    label: string;
    to: string;
    icon: JSX.Element;
    index: number;
}

interface ISidebarProps {
    sidebarItems: ISidebarItem[];
}

const Sidebar = ({ sidebarItems }: ISidebarProps) => {
    const [selectedLabel, setSelectedLabel] = useState("");
    const [height, setHeight] = useState(0);

    const { data: session } = useSession();
    const { isOpenSidebarAdmin, setIsOpenSidebarAdmin } = useStore();
    const router = useRouter();
    const theme = useTheme();

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

    async function onLogout() {
        await signOut();
        router.push("/login");
    }

    useEffect(() => {
        if (IS_BROWSER) {
            setHeight(window.innerWidth);
        }
    }, []);

    return (
        <Drawer
            variant={"persistent"}
            anchor={"left"}
            open={isOpenSidebarAdmin}
            component={"aside"}
            onClose={onClose}
            PaperProps={{
                sx: { backgroundColor: theme.vars.palette.primary.dark, paddingLeft: 1, paddingRight: 1 },
            }}
        >
            <Box
                sx={{
                    mt: 1,
                }}
            >
                <Box
                    display="flex"
                    justifyContent="end"
                    alignItems="center"
                    sx={{
                        mb: 1,
                    }}
                >
                    <IconButton onClick={onClose}>
                        <CloseIcon color="action" />
                    </IconButton>
                </Box>
                <Box
                    display="flex"
                    alignItems="center"
                    sx={{
                        mb: 1,
                        ml: 1,
                    }}
                >
                    <Avatar>
                        <AccountCircleIcon />
                    </Avatar>
                    <Box
                        sx={{
                            ml: 2,
                        }}
                    >
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
                                color: theme.vars.palette.greyAccent.main,
                                "&:hover": {
                                    backgroundColor: theme.vars.palette.secondary.light,
                                    "& .MuiListItemIcon-root": {
                                        color: theme.vars.palette.greyAccent.light,
                                    },
                                    "& .MuiListItemText-primary": {
                                        color: theme.vars.palette.greyAccent.light,
                                    },
                                },
                            }}
                            onClick={onLogout}
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
