"use client";

import { Box, useTheme } from "@mui/material";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import { tokens } from "@/utils/theme/theme";
import HeaderDashboard from "@/components/admin/layout/headerDashboard/HeaderDashboard";
import EventNoteIcon from "@mui/icons-material/EventNote";
import AccountTreeIcon from "@mui/icons-material/AccountTree";
import { DashboardStatBox } from "@/components/admin/layout/dashboard/DashboardStatBox";

const Dashboard = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);

    return (
        <Box m="20px" component={"main"}>
            <Box display="flex" justifyContent="space-between" alignItems="center">
                <HeaderDashboard title="Dashboard" subtitle="Miresevini ne dashboardin tuaj" />
            </Box>
            <Box display="grid" gridTemplateColumns="repeat(9, 1fr)" gridAutoRows="250px" gap="30px">
                <Box
                    sx={{ backgroundColor: colors.primary[400] }}
                    gridColumn="span 3"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                >
                    <DashboardStatBox
                        title={"321"}
                        subtitle="Nr of Movies"
                        progress="0.75"
                        increase="+14%"
                        icon={
                            <AccountTreeIcon
                                sx={{
                                    color: colors.greenAccent[600],
                                    fontSize: "26px",
                                }}
                            />
                        }
                    />
                </Box>
                <Box
                    gridColumn="span 3"
                    sx={{ backgroundColor: colors.primary[400] }}
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                >
                    <DashboardStatBox
                        title={"53"}
                        subtitle="Nr of Users"
                        progress="0.50"
                        increase="+21%"
                        icon={
                            <PersonAddIcon
                                sx={{
                                    color: colors.greenAccent[600],
                                    fontSize: "26px",
                                }}
                            />
                        }
                    />
                </Box>
                <Box
                    gridColumn="span 3"
                    sx={{ backgroundColor: colors.primary[400] }}
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                >
                    <DashboardStatBox
                        title={"4"}
                        subtitle="Nr of Genres"
                        progress="0.30"
                        increase="+5%"
                        icon={
                            <EventNoteIcon
                                sx={{
                                    color: colors.greenAccent[600],
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

export default Dashboard;
