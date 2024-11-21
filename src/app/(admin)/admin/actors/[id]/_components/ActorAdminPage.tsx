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
import { Actor, Prisma } from "@prisma/client";
import { deleteActorById, getActorById, updateActorById } from "@/actions/actor.actions";

const actorSchema = z.object({
    name: z.string().min(1, { message: "required" }),
    biography: z.string().min(1, { message: "required" }),
    birthDate: z.string().min(1, { message: "required" }),
    birthPlace: z.string().min(1, { message: "required" }),
    imageUrl: z.string().min(1, { message: "required" }),
});

const ActorAdminPage = () => {
    const [actor, setActor] = useState<Actor | null>(null);
    const [formData, setFormData] = useState<any>({});
    const [loading, setLoading] = useState(true);
    const [open, setOpen] = useState(false);

    const formRef = useRef<any>(null);

    const router = useRouter();
    const params = useParams();
    const { openModal } = useModal();

    const breadcrumbs = [
        <Link key="1" href="/admin/actors" style={{ textDecoration: "none" }}>
            Actors
        </Link>,
        <Link key="2" href={`/admin/actors/${params?.id}`} style={{ textDecoration: "none" }}>
            {actor?.name || `Actor ${params?.id}`}
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
        const payload: Prisma.ActorUpdateInput = {
            name: values.name,
            biography: values.biography,
            birthDate: values.birthDate,
            birthPlace: values.birthPlace,
            imageUrl: values.imageUrl,
        };

        const response: Actor | null = await updateActorById(payload, String(actor?.id));

        if (response) {
            toast.success(CONSTANTS.UPDATE__SUCCESS);
            getActor();
        } else {
            toast.error(CONSTANTS.UPDATE__FAILURE);
        }
    };

    const handleDelete = () => {
        openModal({
            title: "Delete Actor",
            description: "Are you sure you want to delete this actor?",
            handleConfirm: async () => {
                const response = await deleteActorById(Number(params?.id));

                if (response) {
                    toast.success(CONSTANTS.DELETE__SUCCESS);
                    router.push("/admin/actors");
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

    async function getActor(): Promise<void> {
        setLoading(true);

        const response: Actor | null = await getActorById(Number(params?.id));

        if (response) {
            setActor(response);
            setLoading(false);
        } else {
            toast.error("Failed to fetch actor");
        }
    }

    useEffect(() => {
        getActor();
    }, []);

    if (loading) {
        return <LoadingSpinner />;
    }

    return (
        <Box m="20px">
            <Breadcrumb breadcrumbs={breadcrumbs} navigateTo="/admin/actors" />
            <HeaderDashboard title={`Actor ${params?.id}`} subtitle="Managing actor" />
            <FormAdvanced
                defaultValues={{
                    name: actor?.name,
                    biography: actor?.biography,
                    birthDate: actor?.birthDate,
                    birthPlace: actor?.birthPlace,
                    imageUrl: actor?.imageUrl,
                }}
                schema={actorSchema}
                onSubmit={handleFormSubmit}
                formRef={formRef}
                fields={[
                    {
                        name: "name",
                        label: "Name",
                        type: "text",
                        variant: "outlined",
                    },
                    {
                        name: "biography",
                        label: "Biography",
                        type: "text",
                        variant: "outlined",
                        multiline: true,
                        rows: 4,
                    },
                    {
                        name: "birthDate",
                        label: "Birth Date",
                        type: "date",
                        variant: "outlined",
                    },
                    {
                        name: "birthPlace",
                        label: "Birth Place",
                        type: "text",
                        variant: "outlined",
                    },
                    {
                        name: "imageUrl",
                        label: "Image URL",
                        type: "text",
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

export default ActorAdminPage;
