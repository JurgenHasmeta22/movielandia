"use client";

import { Box } from "@mui/material";
import Header from "@/components/admin/headerDashboard/HeaderDashboard";
import { toast } from "react-toastify";
import FormAdvanced from "@/components/admin/form/Form";
import { useRef } from "react";
import SaveAsIcon from "@mui/icons-material/SaveAs";
import ClearAllIcon from "@mui/icons-material/ClearAll";
import * as CONSTANTS from "@/constants/Constants";
import { useRouter } from "next/navigation";
import { addGenre } from "@/actions/genre.actions";
import { Genre } from "@prisma/client";
import Link from "next/link";
import Breadcrumb from "@/components/admin/breadcrumb/Breadcrumb";
import { genreSchema } from "@/schemas/genre.schema";

interface IGenreAdd {
    name: string;
}

const AddGenreAdminPage = () => {
    const router = useRouter();
    const formRef = useRef<any>(null);

    const breadcrumbs = [
        <Link key="1" href="/admin/genres" style={{ textDecoration: "none" }}>
            Genres
        </Link>,
        <Link key="2" href={`/admin/genres/create`} style={{ textDecoration: "none" }}>
            New Genre
        </Link>,
    ];

    const handleResetFromParent = () => {
        formRef.current?.reset();
    };

    const handleFormSubmit = async (values: IGenreAdd) => {
        const payload: IGenreAdd = {
            name: values.name,
        };

        const response: Genre | null = await addGenre(payload);

        if (response) {
            toast.success(CONSTANTS.UPDATE__SUCCESS);
            router.push(`/admin/genres/${response.id}`);
        } else {
            toast.error(CONSTANTS.UPDATE__FAILURE);
        }
    };

    return (
        <Box m="20px">
            <Breadcrumb breadcrumbs={breadcrumbs} navigateTo={"/admin/genres"} />
            <Header title={CONSTANTS.GENRE__ADD__TITLE} subtitle={CONSTANTS.GENRE__ADD__SUBTITLE} />
            <FormAdvanced
                defaultValues={{
                    name: "",
                }}
                fields={[
                    {
                        name: "name",
                        label: "Name",
                        variant: "filled",
                        type: "text",
                    },
                ]}
                actions={[
                    {
                        label: CONSTANTS.FORM__UPDATE__BUTTON,
                        type: "submit",
                        color: "secondary",
                        variant: "contained",
                        sx: {
                            border: "1px solid #000",
                            bgcolor: "#30969f",
                            fontSize: "15px",
                            fontWeight: "700",
                        },
                        icon: <SaveAsIcon sx={{ ml: "10px" }} color="action" />,
                    },
                    {
                        label: CONSTANTS.FORM__RESET__BUTTON,
                        type: "reset",
                        onClick: () => {
                            handleResetFromParent();
                        },
                        color: "secondary",
                        variant: "contained",
                        sx: {
                            border: "1px solid #000",
                            bgcolor: "#ff5252",
                            fontSize: "15px",
                            fontWeight: "700",
                        },
                        icon: <ClearAllIcon color="action" sx={{ ml: "10px" }} />,
                    },
                ]}
                onSubmit={handleFormSubmit}
                schema={genreSchema}
                formRef={formRef}
            />
        </Box>
    );
};

export default AddGenreAdminPage;
