"use client";

import { Box, Button, Breadcrumbs } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import { useRouter } from "next/navigation";

type BreadcrumbProps = {
    breadcrumbs: JSX.Element[];
    navigateTo: string;
};

const Breadcrumb = ({ breadcrumbs, navigateTo }: BreadcrumbProps) => {
    const router = useRouter();

    return (
        <Box mb={"30px"} display={"flex"} component={"nav"} flexDirection={"row"} alignItems={"center"} gap={"20px"}>
            <Button
                color="secondary"
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
