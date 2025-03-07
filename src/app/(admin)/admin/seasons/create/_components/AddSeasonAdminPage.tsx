"use client";

import { Box } from "@mui/material";
import { useRef } from "react";
import SaveAsIcon from "@mui/icons-material/SaveAs";
import ClearAllIcon from "@mui/icons-material/ClearAll";
import { toast } from "react-toastify";
import * as CONSTANTS from "@/constants/Constants";
import HeaderDashboard from "@/components/admin/headerDashboard/HeaderDashboard";
import Breadcrumb from "@/components/admin/breadcrumb/Breadcrumb";
import FormAdvanced from "@/components/admin/form/Form";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Season } from "@prisma/client";
import { addSeason } from "@/actions/season.actions";
import { seasonSchema } from "@/schemas/season.schema";

interface IAddSeason {
    title: string;
    photoSrc: string;
    photoSrcProd: string;
    trailerSrc: string;
    description: string;
    dateAired: string;
    ratingImdb: number;
    serieId: number;
}

const AddSeasonAdminPage = () => {
    const formRef = useRef<any>(null);
    const router = useRouter();

    const breadcrumbs = [
        <Link key="1" href="/admin/seasons" style={{ textDecoration: "none" }}>
            Seasons
        </Link>,
        <Link key="2" href="/admin/seasons/create" style={{ textDecoration: "none" }}>
            New Season
        </Link>,
    ];

    const handleResetFromParent = () => {
        if (formRef.current) {
            formRef.current.reset();
        }
    };

    const handleFormSubmit = async (values: any) => {
        const payload: IAddSeason = {
            title: values.title,
            photoSrc: values.photoSrc,
            photoSrcProd: values.photoSrcProd,
            trailerSrc: values.trailerSrc,
            description: values.description,
            dateAired: values.dateAired,
            ratingImdb: values.ratingImdb,
            serieId: values.serieId,
        };

        const response: Season | null = await addSeason(payload);

        if (response) {
            toast.success(CONSTANTS.ADD__SUCCESS);
            router.push("/admin/seasons");
        } else {
            toast.error(CONSTANTS.ADD__FAILURE);
        }
    };

    const formFields = [
        {
            key: "title",
            name: "title",
            label: "Title",
            variant: "filled",
            type: "text",
        },
        {
            key: "photoSrc",
            name: "photoSrc",
            label: "Photo Src",
            variant: "filled",
            type: "text",
        },
        {
            key: "photoSrcProd",
            name: "photoSrcProd",
            label: "Photo Src Prod",
            variant: "filled",
            type: "text",
        },
        {
            key: "trailerSrc",
            name: "trailerSrc",
            label: "Trailer Src",
            variant: "filled",
            type: "text",
        },
        {
            key: "description",
            name: "description",
            label: "Description",
            variant: "filled",
            type: "text",
        },
        {
            key: "dateAired",
            name: "dateAired",
            label: "Date Aired",
            variant: "filled",
            type: "date",
        },
        {
            key: "ratingImdb",
            name: "ratingImdb",
            label: "Rating IMDB",
            variant: "filled",
            type: "text",
        },
        {
            key: "serieId",
            name: "serieId",
            label: "Series ID",
            variant: "filled",
            type: "text",
        },
    ];

    return (
        <Box m="20px">
            <Breadcrumb breadcrumbs={breadcrumbs} navigateTo="/admin/seasons" />
            <HeaderDashboard title="Season" subtitle="Add a new season" />
            <FormAdvanced
                schema={seasonSchema}
                defaultValues={{
                    title: "",
                    photoSrc: "",
                    photoSrcProd: "",
                    trailerSrc: "",
                    description: "",
                    dateAired: "",
                    ratingImdb: "",
                    serieId: "",
                }}
                onSubmit={handleFormSubmit}
                formRef={formRef}
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
            />
        </Box>
    );
};

export default AddSeasonAdminPage;
