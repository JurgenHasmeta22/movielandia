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
import { z } from "zod";
import { Season, Prisma } from "@prisma/client";
import { addSeason } from "@/actions/season.actions";

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

const seasonSchema = z.object({
    title: z.string().min(1, { message: "required" }),
    photoSrc: z.string().min(1, { message: "required" }),
    photoSrcProd: z.string().min(1, { message: "required" }),
    trailerSrc: z.string().min(1, { message: "required" }),
    description: z.string().min(1, { message: "required" }),
    dateAired: z.string().min(1, { message: "required" }),
    ratingImdb: z.coerce.number().min(0).max(10),
    serieId: z.coerce.number().min(1, { message: "required" }),
});

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
                fields={[
                    {
                        name: "title",
                        label: "Title",
                        type: "text",
                        variant: "filled",
                    },
                    {
                        name: "photoSrc",
                        label: "Photo Src",
                        type: "text",
                        variant: "filled",
                    },
                    {
                        name: "photoSrcProd",
                        label: "Photo Src Prod",
                        type: "text",
                        variant: "filled",
                    },
                    {
                        name: "trailerSrc",
                        label: "Trailer Src",
                        type: "text",
                        variant: "filled",
                    },
                    {
                        name: "description",
                        label: "Description",
                        type: "text",
                        variant: "filled",
                    },
                    {
                        name: "dateAired",
                        label: "Date Aired",
                        type: "date",
                        variant: "filled",
                    },
                    {
                        name: "ratingImdb",
                        label: "Rating IMDB",
                        type: "text",
                        variant: "filled",
                    },
                    {
                        name: "serieId",
                        label: "Series ID",
                        type: "text",
                        variant: "filled",
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
            />
        </Box>
    );
};

export default AddSeasonAdminPage;
