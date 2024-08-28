"use client";

import { useEffect, useState } from "react";
import {
    List,
    Typography,
    Avatar,
    Drawer,
    IconButton,
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
import { useTheme } from "@mui/material-pigment-css";
import Box from "@mui/material-pigment-css/Box";

const Sidebar = ({ sidebarItems }: any) => {
    const { data: session } = useSession();

    const [selectedLabel, setSelectedLabel] = useState("");
    const [height, setHeight] = useState(0);
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

    useEffect(() => {
        if (IS_BROWSER) {
            setHeight(window.innerHeight);
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
                sx: { backgroundColor: theme.vars.palette.greyAccent.main, paddingLeft: 2, paddingRight: 2 },
            }}
        >
            <Box
                sx={{
                    marginTop: 2,
                }}
            >
                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "end",
                        alignItems: "center",
                        marginBottom: 2,
                    }}
                >
                    <IconButton onClick={onClose}>
                        <CloseIcon color="action" />
                    </IconButton>
                </Box>
                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        marginBottom: 2,
                        marginLeft: 2,
                    }}
                >
                    <Avatar>
                        <AccountCircleIcon />
                    </Avatar>
                    <Box
                        sx={{
                            marginLeft: 2,
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
                                    backgroundColor: theme.vars.palette.primary.dark,
                                    "& .MuiListItemIcon-root": {
                                        color: theme.vars.palette.greyAccent.main,
                                    },
                                    "& .MuiListItemText-primary": {
                                        color: theme.vars.palette.greyAccent.main,
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
