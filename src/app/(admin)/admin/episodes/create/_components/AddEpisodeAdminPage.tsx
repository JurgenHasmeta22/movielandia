"use client";

import { Box } from "@mui/material";
import { useRef } from "react";
import SaveAsIcon from "@mui/icons-material/SaveAs";
import ClearAllIcon from "@mui/icons-material/ClearAll";
import { toast } from "react-toastify";
import * as CONSTANTS from "@/constants/Constants";
import { CheckOutlined } from "@mui/icons-material";
import HeaderDashboard from "@/components/admin/headerDashboard/HeaderDashboard";
import Breadcrumb from "@/components/admin/breadcrumb/Breadcrumb";
import FormAdvanced from "@/components/admin/form/Form";
import { useModal } from "@/providers/ModalProvider";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { z } from "zod";
import { Episode } from "@prisma/client";
import { addEpisode } from "@/actions/episode.actions";

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

const episodeSchema = z.object({
    title: z.string().min(1, { message: "required" }),
    photoSrc: z.string().min(1, { message: "required" }),
    photoSrcProd: z.string().min(1, { message: "required" }),
    trailerSrc: z.string().min(1, { message: "required" }),
    description: z.string().min(1, { message: "required" }),
    duration: z.coerce.number().min(1, { message: "required" }),
    dateAired: z.string().min(1, { message: "required" }),
    ratingImdb: z.coerce.number().min(0).max(10),
    seasonId: z.coerce.number().min(1, { message: "required" }),
});

const AddEpisodeAdminPage = () => {
    const formRef = useRef<any>(null);
    const router = useRouter();
    const { openModal } = useModal();

    const breadcrumbs = [
        <Link key="1" href="/admin/episodes" style={{ textDecoration: "none" }}>
            Episodes
        </Link>,
        <Link key="2" href="/admin/episodes/create" style={{ textDecoration: "none" }}>
            Create Episode
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

    const handleReset = () => {
        openModal({
            title: "Reset Form",
            description: "Are you sure you want to reset the form?",
            handleConfirm: () => {
                handleResetFromParent();
            },
            icon: <CheckOutlined sx={{ color: "info.main" }} />,
            confirmText: "Reset",
            confirmButtonProps: {
                color: "info",
                variant: "contained",
                startIcon: <ClearAllIcon />,
            },
        });
    };

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
                        name: "duration",
                        label: "Duration (minutes)",
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
                        name: "seasonId",
                        label: "Season ID",
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

export default AddEpisodeAdminPage;
