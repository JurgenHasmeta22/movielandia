"use client";

import { Button, Breadcrumbs } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import { useRouter } from "next/navigation";
import Box from "@mui/material-pigment-css/Box";

type BreadcrumbProps = {
    breadcrumbs: JSX.Element[];
    navigateTo: string;
};

const Breadcrumb = ({ breadcrumbs, navigateTo }: BreadcrumbProps) => {
    const router = useRouter();

    return (
        <Box
            component={"nav"}
            sx={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                gap: "20px",
                marginBottom: "30px",
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
