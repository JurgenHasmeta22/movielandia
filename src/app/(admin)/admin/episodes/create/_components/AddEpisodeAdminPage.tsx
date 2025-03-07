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
import { Episode } from "@prisma/client";
import { addEpisode } from "@/actions/episode.actions";
import { episodeSchema } from "@/schemas/episode.schema";

interface IAddEpisode {
    title: string;
    photoSrc: string;
    photoSrcProd: string;
    trailerSrc: string;
    description: string;
    duration: string | number;
    dateAired: string;
    ratingImdb: string | number;
    seasonId: string | number;
}

const AddEpisodeAdminPage = () => {
    const formRef = useRef<any>(null);
    const router = useRouter();

    const breadcrumbs = [
        <Link key="1" href="/admin/episodes" style={{ textDecoration: "none" }}>
            Episodes
        </Link>,
        <Link key="2" href="/admin/episodes/create" style={{ textDecoration: "none" }}>
            New Episode
        </Link>,
    ];

    const handleResetFromParent = () => {
        if (formRef.current) {
            formRef.current.reset();
        }
    };

    const handleFormSubmit = async (values: IAddEpisode) => {
        const payload = {
            title: values.title,
            photoSrc: values.photoSrc,
            photoSrcProd: values.photoSrcProd,
            trailerSrc: values.trailerSrc,
            description: values.description,
            duration: Number(values.duration),
            dateAired: values.dateAired,
            ratingImdb: Number(values.ratingImdb),
            seasonId: Number(values.seasonId),
        };

        const response: Episode | null = await addEpisode(payload);

        if (response) {
            toast.success(CONSTANTS.ADD__SUCCESS);
            router.push("/admin/episodes");
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
            key: "duration",
            name: "duration",
            label: "Duration (minutes)",
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
            key: "seasonId",
            name: "seasonId",
            label: "Season ID",
            variant: "filled",
            type: "text",
        },
    ];

    return (
        <Box m="20px">
            <Breadcrumb breadcrumbs={breadcrumbs} navigateTo="/admin/episodes" />
            <HeaderDashboard title="Episode" subtitle="Add a new episode" />
            <FormAdvanced
                schema={episodeSchema}
                onSubmit={handleFormSubmit}
                formRef={formRef}
                defaultValues={{
                    title: "",
                    photoSrc: "",
                    photoSrcProd: "",
                    trailerSrc: "",
                    description: "",
                    duration: "",
                    dateAired: "",
                    ratingImdb: "",
                    seasonId: "",
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
            />
        </Box>
    );
};

export default AddEpisodeAdminPage;
