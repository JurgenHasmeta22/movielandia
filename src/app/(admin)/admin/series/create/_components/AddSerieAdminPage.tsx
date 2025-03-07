"use client";

import { Box } from "@mui/material";
import { toast } from "react-toastify";
import { useRef } from "react";
import SaveAsIcon from "@mui/icons-material/SaveAs";
import ClearAllIcon from "@mui/icons-material/ClearAll";
import * as CONSTANTS from "@/constants/Constants";
import HeaderDashboard from "@/components/admin/headerDashboard/HeaderDashboard";
import { useRouter } from "next/navigation";
import FormAdvanced from "@/components/admin/form/Form";
import { addSerie } from "@/actions/serie.actions";
import { Serie } from "@prisma/client";
import Link from "next/link";
import Breadcrumb from "@/components/admin/breadcrumb/Breadcrumb";
import { serieSchema } from "@/schemas/serie.schema";

interface IAddSerie {
    title: string;
    photoSrc: string;
    photoSrcProd: string;
    trailerSrc: string;
    description: string;
    dateAired: string;
    ratingImdb: string | number;
}

const AddSerieAdminPage = () => {
    const formRef = useRef<any>(null);
    const router = useRouter();

    const breadcrumbs = [
        <Link key="1" href="/admin/series" style={{ textDecoration: "none" }}>
            Series
        </Link>,
        <Link key="2" href={`/admin/series/create`} style={{ textDecoration: "none" }}>
            New Serie
        </Link>,
    ];

    const handleResetFromParent = () => {
        formRef.current?.reset();
    };

    const handleFormSubmit = async (values: IAddSerie) => {
        const payload = {
            title: values.title,
            photoSrc: values.photoSrc,
            photoSrcProd: values.photoSrcProd,
            trailerSrc: values.trailerSrc,
            description: values.description,
            ratingImdb: Number(values.ratingImdb),
            dateAired: values.dateAired,
        };

        const response: Serie | null = await addSerie(payload);

        if (response) {
            toast.success(CONSTANTS.UPDATE__SUCCESS);
            router.push(`/admin/series/${response.id}`);
        } else {
            toast.error(CONSTANTS.UPDATE__FAILURE);
        }
    };

    const formFields = [
        {
            name: "title",
            label: "Title",
            variant: "filled",
            type: "text" as const,
        },
        {
            name: "photoSrc",
            label: "Photo src",
            variant: "filled",
            type: "text" as const,
        },
        {
            name: "photoSrcProd",
            label: "Photo src prod",
            variant: "filled",
            type: "text" as const,
        },
        {
            name: "trailerSrc",
            label: "Trailer src",
            variant: "filled",
            type: "text" as const,
        },
        {
            name: "description",
            label: "Description",
            variant: "filled",
            type: "textarea" as const,
        },
        {
            name: "dateAired",
            label: "Date aired",
            variant: "filled",
            type: "date" as const,
        },
        {
            name: "ratingImdb",
            label: "Rating imdb",
            variant: "filled",
            type: "number" as const,
        },
    ];

    return (
        <Box m="20px">
            <Breadcrumb breadcrumbs={breadcrumbs} navigateTo={"/admin/series"} />
            <HeaderDashboard title={CONSTANTS.SERIE__ADD__TITLE} subtitle={CONSTANTS.SERIE__ADD__SUBTITLE} />
            <FormAdvanced
                defaultValues={{
                    title: "",
                    photoSrc: "",
                    photoSrcProd: "",
                    description: "",
                    trailerSrc: "",
                    dateAired: "",
                    ratingImdb: "",
                }}
                fields={formFields}
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
                schema={serieSchema}
                formRef={formRef}
            />
        </Box>
    );
};

export default AddSerieAdminPage;
