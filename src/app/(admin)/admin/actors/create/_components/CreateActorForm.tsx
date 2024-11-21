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
import { Actor, Prisma } from "@prisma/client";
import { addActor } from "@/actions/actor.actions";

const actorSchema = z.object({
    name: z.string().min(1, { message: "required" }),
    biography: z.string().min(1, { message: "required" }),
    birthDate: z.string().min(1, { message: "required" }),
    birthPlace: z.string().min(1, { message: "required" }),
    imageUrl: z.string().min(1, { message: "required" }),
});

const CreateActorForm = () => {
    const formRef = useRef<any>(null);
    const router = useRouter();
    const { openModal } = useModal();

    const breadcrumbs = [
        <Link key="1" href="/admin/actors" style={{ textDecoration: "none" }}>
            Actors
        </Link>,
        <Link key="2" href="/admin/actors/create" style={{ textDecoration: "none" }}>
            Create Actor
        </Link>,
    ];

    const handleResetFromParent = () => {
        if (formRef.current) {
            formRef.current.reset();
        }
    };

    const handleFormSubmit = async (values: any) => {
        const payload: Prisma.ActorCreateInput = {
            name: values.name,
            biography: values.biography,
            birthDate: values.birthDate,
            birthPlace: values.birthPlace,
            imageUrl: values.imageUrl,
        };

        const response: Actor | null = await addActor(payload);

        if (response) {
            toast.success(CONSTANTS.CREATE__SUCCESS);
            router.push("/admin/actors");
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
            <Breadcrumb breadcrumbs={breadcrumbs} navigateTo="/admin/actors" />
            <HeaderDashboard title="Create Actor" subtitle="Add a new actor" />
            <FormAdvanced
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

export default CreateActorForm;
