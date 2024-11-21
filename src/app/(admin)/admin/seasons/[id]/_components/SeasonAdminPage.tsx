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
import { Season, Prisma } from "@prisma/client";
import { deleteSeasonById, getSeasonById, updateSeasonById } from "@/actions/season.actions";

const seasonSchema = z.object({
    title: z.string().min(1, { message: "required" }),
    seasonNumber: z.coerce.number().min(1, { message: "required" }),
    description: z.string().min(1, { message: "required" }),
    dateAired: z.string().min(1, { message: "required" }),
    serieId: z.coerce.number().min(1, { message: "required" }),
});

const SeasonAdminPage = () => {
    const [season, setSeason] = useState<Season | null>(null);
    const [formData, setFormData] = useState<any>({});
    const [loading, setLoading] = useState(true);
    const [open, setOpen] = useState(false);

    const formRef = useRef<any>(null);

    const router = useRouter();
    const params = useParams();
    const { openModal } = useModal();

    const breadcrumbs = [
        <Link key="1" href="/admin/seasons" style={{ textDecoration: "none" }}>
            Seasons
        </Link>,
        <Link key="2" href={`/admin/seasons/${params?.id}`} style={{ textDecoration: "none" }}>
            {season?.title || `Season ${params?.id}`}
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
        const payload: Prisma.SeasonUpdateInput = {
            title: values.title,
            seasonNumber: values.seasonNumber,
            description: values.description,
            dateAired: values.dateAired,
            serie: {
                connect: {
                    id: values.serieId,
                },
            },
        };

        const response: Season | null = await updateSeasonById(payload, String(season?.id));

        if (response) {
            toast.success(CONSTANTS.UPDATE__SUCCESS);
            getSeason();
        } else {
            toast.error(CONSTANTS.UPDATE__FAILURE);
        }
    };

    const handleDelete = () => {
        openModal({
            title: "Delete Season",
            description: "Are you sure you want to delete this season?",
            handleConfirm: async () => {
                const response = await deleteSeasonById(Number(params?.id));

                if (response) {
                    toast.success(CONSTANTS.DELETE__SUCCESS);
                    router.push("/admin/seasons");
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

    async function getSeason(): Promise<void> {
        setLoading(true);

        const response: Season | null = await getSeasonById(Number(params?.id));

        if (response) {
            setSeason(response);
            setLoading(false);
        } else {
            toast.error("Failed to fetch season");
        }
    }

    useEffect(() => {
        getSeason();
    }, []);

    if (loading) {
        return <LoadingSpinner />;
    }

    return (
        <Box m="20px">
            <Breadcrumb breadcrumbs={breadcrumbs} navigateTo="/admin/seasons" />
            <HeaderDashboard title={`Season ${params?.id}`} subtitle="Managing season" />
            <FormAdvanced
                defaultValues={{
                    title: season?.title,
                    seasonNumber: season?.seasonNumber,
                    description: season?.description,
                    dateAired: season?.dateAired,
                    serieId: season?.serieId,
                }}
                schema={seasonSchema}
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
                        name: "seasonNumber",
                        label: "Season Number",
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
                        name: "serieId",
                        label: "Series ID",
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

export default SeasonAdminPage;
