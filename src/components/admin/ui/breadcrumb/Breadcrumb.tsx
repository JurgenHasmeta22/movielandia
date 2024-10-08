"use client";

import { Box, Button, Breadcrumbs } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import { useRouter } from "next/navigation";

interface IBreadcrumbProps {
    breadcrumbs: JSX.Element[];
    navigateTo: string;
}

const Breadcrumb = ({ breadcrumbs, navigateTo }: IBreadcrumbProps) => {
    const router = useRouter();

    return (
        <Box
            display={"flex"}
            component={"nav"}
            flexDirection={"row"}
            alignItems={"center"}
            gap={"20px"}
            sx={{
                mb: "30px",
            }}
        >
            <Button
                variant="contained"
                onClick={() => {
                    router.push(navigateTo);
                }}
            >
                <ArrowBackIcon color="action" />
            </Button>
            <Breadcrumbs separator={<NavigateNextIcon fontSize="small" />} aria-label="breadcrumb">
                {breadcrumbs}
            </Breadcrumbs>
        </Box>
    );
};

export default Breadcrumb;
