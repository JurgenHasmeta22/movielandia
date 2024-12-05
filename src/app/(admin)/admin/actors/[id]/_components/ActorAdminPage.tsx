"use client";

import { Box } from "@mui/material";
import { useState, useEffect, useRef } from "react";
import ClearOutlinedIcon from "@mui/icons-material/ClearOutlined";
import SaveAsIcon from "@mui/icons-material/SaveAs";
import ClearAllIcon from "@mui/icons-material/ClearAll";
import { toast } from "react-toastify";
import * as CONSTANTS from "@/constants/Constants";
import { useModal } from "@/providers/ModalProvider";
import { WarningOutlined, CheckOutlined } from "@mui/icons-material";
import { Actor, Prisma } from "@prisma/client";
import HeaderDashboard from "@/components/admin/headerDashboard/HeaderDashboard";
import FormAdvanced from "@/components/admin/form/Form";
import Breadcrumb from "@/components/admin/breadcrumb/Breadcrumb";
import { useParams, useRouter } from "next/navigation";
import { deleteActorById, getActorById, updateActorById } from "@/actions/actor.actions";
import Link from "next/link";
import LoadingSpinner from "@/components/root/loadingSpinner/LoadingSpinner";
import { actorSchema } from "@/schemas/actor.schema";

const ActorAdminPage = () => {
    const [actor, setActor] = useState<Actor | null>(null);
    const [formData, setFormData] = useState<any>({});
    const [loading, setLoading] = useState(true);
    const [open, setOpen] = useState(false);

    const router = useRouter();
    const params = useParams();
    const { openModal } = useModal();
    const formRef = useRef<any>(null);

    const breadcrumbs = [
        <Link key="1" href="/admin/actors" style={{ textDecoration: "none" }}>
            Actors
        </Link>,
        <Link key="2" href={`/admin/actors/${params?.id}`} style={{ textDecoration: "none" }}>
            {actor?.fullname || `Actor ${params?.id}`}
        </Link>,
    ];

    const handleDataChange = (values: any) => {
        setFormData(values);
    };

    const handleResetFromParent = () => {
        formRef.current?.reset();
    };

    const handleFormSubmit = async (values: any) => {
        const payload: Prisma.ActorUpdateInput = {
            fullname: values.fullname,
            photoSrc: values.photoSrc,
            photoSrcProd: values.photoSrcProd,
            description: values.description,
            debut: values.debut,
        };

        const response: Actor | null = await updateActorById(payload, String(actor?.id));

        if (response) {
            toast.success(CONSTANTS.UPDATE__SUCCESS);
            getActor();
        } else {
            toast.error(CONSTANTS.UPDATE__FAILURE);
        }
    };

    async function getActor(): Promise<void> {
        setLoading(true);
        const response: Actor | null = await getActorById(Number(params.id), {});

        if (response) {
            setActor(response);
            setLoading(false);
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
            <Breadcrumb breadcrumbs={breadcrumbs} navigateTo={"/admin/actors"} />
            <HeaderDashboard title={"Actor"} subtitle={"Edit actor"} />
            <FormAdvanced
                defaultValues={{
                    id: actor?.id,
                    fullname: actor?.fullname,
                    photoSrc: actor?.photoSrc,
                    photoSrcProd: actor?.photoSrcProd,
                    description: actor?.description,
                    debut: actor?.debut,
                }}
                fields={[
                    {
                        name: "id",
                        label: "Id",
                        disabled: true,
                        variant: "filled",
                        type: "text",
                    },
                    {
                        name: "fullname",
                        label: "Full Name",
                        variant: "filled",
                        type: "text",
                    },
                    {
                        name: "photoSrc",
                        label: "Photo Src",
                        variant: "filled",
                        type: "text",
                    },
                    {
                        name: "photoSrcProd",
                        label: "Photo Src Prod",
                        variant: "filled",
                        type: "text",
                    },
                    {
                        name: "description",
                        label: "Description",
                        variant: "filled",
                        type: "text",
                    },
                    {
                        name: "debut",
                        label: "Debut",
                        variant: "filled",
                        type: "text",
                    },
                ]}
                schema={actorSchema}
                onSubmit={handleFormSubmit}
                formRef={formRef}
                actions={[
                    {
                        label: CONSTANTS.FORM__DELETE__BUTTON,
                        onClick: async () => {
                            openModal({
                                onClose: () => setOpen(false),
                                title: `Delete selected actor ${formData.name}`,
                                actions: [
                                    {
                                        label: CONSTANTS.MODAL__DELETE__NO,
                                        onClick: () => setOpen(false),
                                        color: "secondary",
                                        variant: "contained",
                                        sx: {
                                            bgcolor: "#ff5252",
                                        },
                                        icon: <WarningOutlined />,
                                    },
                                    {
                                        label: CONSTANTS.MODAL__DELETE__YES,
                                        onClick: async () => {
                                            const response = await deleteActorById(actor?.id!);

                                            if (response) {
                                                toast.success(CONSTANTS.DELETE__SUCCESS);
                                                router.push("/admin/actors");
                                            } else {
                                                toast.success(CONSTANTS.DELETE__FAILURE);
                                            }
                                        },
                                        type: "submit",
                                        color: "secondary",
                                        variant: "contained",
                                        sx: {
                                            bgcolor: "#30969f",
                                        },
                                        icon: <CheckOutlined />,
                                    },
                                ],
                                subTitle: "Do you want to delete selected record ?",
                            });
                        },
                        color: "secondary",
                        variant: "contained",
                        sx: {
                            bgcolor: "#ff5252",
                        },
                        icon: <ClearOutlinedIcon color="action" sx={{ ml: "10px" }} />,
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
                            bgcolor: "#00bfff",
                        },
                        icon: <ClearAllIcon color="action" sx={{ ml: "10px" }} />,
                    },
                    {
                        label: CONSTANTS.FORM__UPDATE__BUTTON,
                        type: "submit",
                        color: "secondary",
                        variant: "contained",
                        sx: {
                            bgcolor: "#30969f",
                        },
                        icon: <SaveAsIcon sx={{ ml: "10px" }} color="action" />,
                    },
                ]}
            />
        </Box>
    );
};

export default ActorAdminPage;
