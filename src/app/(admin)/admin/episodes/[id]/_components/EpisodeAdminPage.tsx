"use client";

import { Box } from "@mui/material";
import { useState, useEffect, useRef } from "react";
import ClearOutlinedIcon from "@mui/icons-material/ClearOutlined";
import SaveAsIcon from "@mui/icons-material/SaveAs";
import ClearAllIcon from "@mui/icons-material/ClearAll";
import { toast } from "react-toastify";
import * as CONSTANTS from "@/constants/Constants";
import { WarningOutlined, CheckOutlined } from "@mui/icons-material";
import HeaderDashboard from "@/components/admin/headerDashboard/HeaderDashboard";
import Breadcrumb from "@/components/admin/breadcrumb/Breadcrumb";
import FormAdvanced from "@/components/admin/form/Form";
import { useModal } from "@/providers/ModalProvider";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { z } from "zod";
import LoadingSpinner from "@/components/root/loadingSpinner/LoadingSpinner";
import { Episode, Prisma } from "@prisma/client";
import { deleteEpisodeById, getEpisodeById, updateEpisodeById } from "@/actions/episode.actions";

const episodeSchema = z.object({
    title: z.string().min(1, { message: "required" }),
    episodeNumber: z.coerce.number().min(1, { message: "required" }),
    duration: z.coerce.number().min(1, { message: "required" }),
    description: z.string().min(1, { message: "required" }),
    dateAired: z.string().min(1, { message: "required" }),
    seasonId: z.coerce.number().min(1, { message: "required" }),
});

const EpisodeAdminPage = () => {
    const [episode, setEpisode] = useState<Episode | null>(null);
    const [formData, setFormData] = useState<any>({});
    const [loading, setLoading] = useState(true);
    const [open, setOpen] = useState(false);

    const formRef = useRef<any>(null);

    const router = useRouter();
    const params = useParams();
    const { openModal } = useModal();

    const breadcrumbs = [
        <Link key="1" href="/admin/episodes" style={{ textDecoration: "none" }}>
            Episodes
        </Link>,
        <Link key="2" href={`/admin/episodes/${params?.id}`} style={{ textDecoration: "none" }}>
            {episode?.title || `Episode ${params?.id}`}
        </Link>,
    ];

    const handleDataChange = (values: any) => {
        setFormData(values);
    };

    const handleResetFromParent = () => {
        if (formRef.current) {
            formRef.current.reset();
        }
    };

    const handleFormSubmit = async (values: any) => {
        const payload: Prisma.EpisodeUpdateInput = {
            title: values.title,
            episodeNumber: values.episodeNumber,
            duration: values.duration,
            description: values.description,
            dateAired: values.dateAired,
            season: {
                connect: {
                    id: values.seasonId,
                },
            },
        };

        const response: Episode | null = await updateEpisodeById(payload, String(episode?.id));

        if (response) {
            toast.success(CONSTANTS.UPDATE__SUCCESS);
            getEpisode();
        } else {
            toast.error(CONSTANTS.UPDATE__FAILURE);
        }
    };

    const handleDelete = () => {
        openModal({
            title: "Delete Episode",
            description: "Are you sure you want to delete this episode?",
            handleConfirm: async () => {
                const response = await deleteEpisodeById(Number(params?.id));

                if (response) {
                    toast.success(CONSTANTS.DELETE__SUCCESS);
                    router.push("/admin/episodes");
                } else {
                    toast.error(CONSTANTS.DELETE__FAILURE);
                }
            },
            icon: <WarningOutlined sx={{ color: "warning.main" }} />,
            confirmText: "Delete",
            confirmButtonProps: {
                color: "warning",
                variant: "contained",
                startIcon: <ClearOutlinedIcon />,
            },
        });
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

    async function getEpisode(): Promise<void> {
        setLoading(true);

        const response: Episode | null = await getEpisodeById(Number(params?.id));

        if (response) {
            setEpisode(response);
            setLoading(false);
        } else {
            toast.error("Failed to fetch episode");
        }
    }

    useEffect(() => {
        getEpisode();
    }, []);

    if (loading) {
        return <LoadingSpinner />;
    }

    return (
        <Box m="20px">
            <Breadcrumb breadcrumbs={breadcrumbs} navigateTo="/admin/episodes" />
            <HeaderDashboard title={`Episode ${params?.id}`} subtitle="Managing episode" />
            <FormAdvanced
                defaultValues={{
                    title: episode?.title,
                    episodeNumber: episode?.episodeNumber,
                    duration: episode?.duration,
                    description: episode?.description,
                    dateAired: episode?.dateAired,
                    seasonId: episode?.seasonId,
                }}
                schema={episodeSchema}
                onSubmit={handleFormSubmit}
                formRef={formRef}
                fields={[
                    {
                        name: "title",
                        label: "Title",
                        type: "text",
                        variant: "outlined",
                    },
                    {
                        name: "episodeNumber",
                        label: "Episode Number",
                        type: "number",
                        variant: "outlined",
                    },
                    {
                        name: "duration",
                        label: "Duration (minutes)",
                        type: "number",
                        variant: "outlined",
                    },
                    {
                        name: "description",
                        label: "Description",
                        type: "text",
                        variant: "outlined",
                        multiline: true,
                        rows: 4,
                    },
                    {
                        name: "dateAired",
                        label: "Date Aired",
                        type: "date",
                        variant: "outlined",
                    },
                    {
                        name: "seasonId",
                        label: "Season ID",
                        type: "number",
                        variant: "outlined",
                    },
                ]}
                actions={[
                    {
                        label: "Save",
                        type: "submit",
                        variant: "contained",
                        color: "primary",
                        startIcon: <SaveAsIcon />,
                    },
                    {
                        label: "Reset",
                        type: "button",
                        variant: "contained",
                        color: "info",
                        startIcon: <ClearAllIcon />,
                        onClick: handleReset,
                    },
                    {
                        label: "Delete",
                        type: "button",
                        variant: "contained",
                        color: "warning",
                        startIcon: <ClearOutlinedIcon />,
                        onClick: handleDelete,
                    },
                ]}
            />
        </Box>
    );
};

export default EpisodeAdminPage;
