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
import { Episode, Prisma } from "@prisma/client";
import { addEpisode } from "@/actions/episode.actions";

const episodeSchema = z.object({
    title: z.string().min(1, { message: "required" }),
    episodeNumber: z.coerce.number().min(1, { message: "required" }),
    duration: z.coerce.number().min(1, { message: "required" }),
    description: z.string().min(1, { message: "required" }),
    dateAired: z.string().min(1, { message: "required" }),
    seasonId: z.coerce.number().min(1, { message: "required" }),
});

const CreateEpisodeForm = () => {
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

    const handleFormSubmit = async (values: any) => {
        const payload: Prisma.EpisodeCreateInput = {
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

        const response: Episode | null = await addEpisode(payload);

        if (response) {
            toast.success(CONSTANTS.CREATE__SUCCESS);
            router.push("/admin/episodes");
        } else {
            toast.error(CONSTANTS.CREATE__FAILURE);
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
            <HeaderDashboard title="Create Episode" subtitle="Add a new episode" />
            <FormAdvanced
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
                        label: "Create",
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
                ]}
            />
        </Box>
    );
};

export default CreateEpisodeForm;
