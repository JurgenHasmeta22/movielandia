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
    fullname: z.string().min(1, { message: "required" }),
    photoSrc: z.string().min(1, { message: "required" }),
    description: z.string().min(1, { message: "required" }),
    debut: z.string().min(1, { message: "required" }),
});

const AddActorAdminPage = () => {
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
            fullname: values.fullname,
            photoSrc: values.photoSrc,
            description: values.description,
            debut: values.debut,
        };

        const response: Actor | null = await addActor(payload);

        if (response) {
            toast.success(CONSTANTS.ADD__SUCCESS);
            router.push("/admin/actors");
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
            <Breadcrumb breadcrumbs={breadcrumbs} navigateTo="/admin/actors" />
            <HeaderDashboard title="Actor" subtitle="Add an actor" />
            <FormAdvanced
                schema={actorSchema}
                defaultValues={{
                    fullname: "",
                    photoSrc: "",
                    description: "",
                    debut: "",
                }}
                onSubmit={handleFormSubmit}
                formRef={formRef}
                fields={[
                    {
                        name: "fullname",
                        label: "Fullname",
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
                        name: "description",
                        label: "Description",
                        type: "text",
                        variant: "filled",
                    },
                    {
                        name: "debut",
                        label: "Debut",
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

export default AddActorAdminPage;
