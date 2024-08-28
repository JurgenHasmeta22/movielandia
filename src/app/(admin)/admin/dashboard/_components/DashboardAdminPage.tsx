"use client";

import PersonAddIcon from "@mui/icons-material/PersonAdd";
import type {} from "@mui/material/themeCssVarsAugmentation";
import HeaderDashboard from "@/components/admin/layout/headerDashboard/HeaderDashboard";
import EventNoteIcon from "@mui/icons-material/EventNote";
import AccountTreeIcon from "@mui/icons-material/AccountTree";
import { DashboardStatBox } from "@/components/admin/layout/dashboard/DashboardStatBox";
import { useTheme } from "@mui/material-pigment-css";
import Box from "@mui/material-pigment-css/Box";

const DashboardAdminPage = () => {
    const theme = useTheme();

    return (
        <Box
            component={"main"}
            sx={{
                margin: "20px",
            }}
        >
            <Box
                sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                }}
            >
                <HeaderDashboard title="Dashboard" subtitle="Miresevini ne dashboardin tuaj" />
            </Box>
            <Box
                sx={{
                    display: "grid",
                    gridTemplateColumns: "repeat(9, 1fr)",
                    gridAutoRows: "250px",
                    gap: "30px",
                }}
            >
                <Box
                    sx={{
                        display: "flex",
                        gridColumn: "span 3",
                        alignItems: "center",
                        justifyContent: "center",
                        backgroundColor: theme.vars.palette.background.default,
                    }}
                >
                    <DashboardStatBox
                        title={"321"}
                        subtitle="Nr of Movies"
                        progress="0.75"
                        increase="+14%"
                        icon={
                            <AccountTreeIcon
                                sx={{
                                    color: theme.vars.palette.green.light,
                                    fontSize: "26px",
                                }}
                            />
                        }
                    />
                </Box>
                <Box
                    sx={{
                        display: "flex",
                        gridColumn: "span 3",
                        alignItems: "center",
                        justifyContent: "center",
                        backgroundColor: theme.vars.palette.background.default,
                    }}
                >
                    <DashboardStatBox
                        title={"53"}
                        subtitle="Nr of Users"
                        progress="0.50"
                        increase="+21%"
                        icon={
                            <PersonAddIcon
                                sx={{
                                    color: theme.vars.palette.green.light,
                                    fontSize: "26px",
                                }}
                            />
                        }
                    />
                </Box>
                <Box
                    sx={{
                        display: "flex",
                        gridColumn: "span 3",
                        alignItems: "center",
                        justifyContent: "center",
                        backgroundColor: theme.vars.palette.background.default,
                    }}
                >
                    <DashboardStatBox
                        title={"4"}
                        subtitle="Nr of Genres"
                        progress="0.30"
                        increase="+5%"
                        icon={
                            <EventNoteIcon
                                sx={{
                                    color: theme.vars.palette.green.light,
                                    fontSize: "26px",
                                }}
                            />
                        }
                    />
                </Box>
            </Box>
        </Box>
    );
};

export default DashboardAdminPage;
