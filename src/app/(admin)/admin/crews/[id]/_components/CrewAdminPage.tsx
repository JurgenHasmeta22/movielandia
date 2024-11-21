"use client";

import { Box, Link } from "@mui/material";
import { useRouter, useParams } from "next/navigation";
import { useRef, useState, useEffect } from "react";
import { toast } from "react-toastify";
import HeaderDashboard from "@/components/admin/headerDashboard/HeaderDashboard";
import { getCrewMemberById, updateCrewMemberById, deleteCrewMemberById } from "@/actions/crew.actions";
import { Crew } from "@prisma/client";
import SaveAsIcon from "@mui/icons-material/SaveAs";
import ClearAllIcon from "@mui/icons-material/ClearAll";
import ClearOutlinedIcon from "@mui/icons-material/ClearOutlined";
import { WarningOutlined, CheckOutlined } from "@mui/icons-material";
import Breadcrumb from "@/components/admin/breadcrumb/Breadcrumb";
import FormAdvanced from "@/components/admin/form/Form";
import { useModal } from "@/providers/ModalProvider";
import * as CONSTANTS from "@/constants/Constants";
import { z } from "zod";
import LoadingSpinner from "@/components/root/loadingSpinner/LoadingSpinner";

const crewSchema = z.object({
    photoSrc: z.string().min(1, { message: "required" }),
    photoSrcProd: z.string().min(1, { message: "required" }),
    role: z.coerce.number().min(1, { message: "required" }),
    description: z.string().min(1, { message: "required" }),
    debut: z.coerce.number().min(1, { message: "required" }),
    fullname: z.string().min(1, { message: "required" }),
});

const CrewAdminPage = () => {
    const [crew, setCrew] = useState<Crew | null>(null);
    const [formData, setFormData] = useState<any>({});
    const [loading, setLoading] = useState(true);
    const [open, setOpen] = useState(false);

    const router = useRouter();
    const params = useParams();
    const { openModal } = useModal();

    const formRef = useRef<any>(null);

    const breadcrumbs = [
        <Link key="1" href="/admin/crews" style={{ textDecoration: "none" }}>
            Crews
        </Link>,
        <Link key="2" href={`/admin/crews/${params?.id}`} style={{ textDecoration: "none" }}>
            {crew?.fullname || `Crew ${params?.id}`}
        </Link>,
    ];

    useEffect(() => {
        getCrew();
    }, []);

    const handleFormSubmit = async (data: any) => {
        const response = await updateCrewMemberById(data, String(crew?.id));

        if (response) {
            toast.success(CONSTANTS.UPDATE__SUCCESS);
            router.push("/admin/crews");
        } else {
            toast.error(CONSTANTS.UPDATE__FAILURE);
        }
    };

    const handleResetFromParent = () => {
        if (formRef.current) {
            formRef.current.reset();
        }
    };

    async function getCrew(): Promise<void> {
        setLoading(true);
        const response: Crew | null = await getCrewMemberById(Number(params.id), {});

        if (response) {
            setCrew(response);
            setLoading(false);
        }
    }

    if (loading) {
        return <LoadingSpinner />;
    }

    return (
        <Box m="20px">
            <Breadcrumb breadcrumbs={breadcrumbs} navigateTo={"/admin/crews"} />
            <HeaderDashboard title={"Crew"} subtitle={"Edit crew member"} />
            <FormAdvanced
                defaultValues={{
                    id: crew?.id,
                    fullname: crew?.fullname,
                    photoSrc: crew?.photoSrc,
                    photoSrcProd: crew?.photoSrcProd,
                    role: crew?.role,
                    description: crew?.description,
                    debut: crew?.debut,
                }}
                onSubmit={handleFormSubmit}
                formRef={formRef}
                fields={[
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
                        name: "role",
                        label: "Role",
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
                schema={crewSchema}
                actions={[
                    {
                        label: CONSTANTS.FORM__DELETE__BUTTON,
                        onClick: async () => {
                            openModal({
                                onClose: () => setOpen(false),
                                title: `Delete selected crew member ${crew?.fullname}`,
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
                                            const response = await deleteCrewMemberById(crew?.id!);

                                            if (response) {
                                                toast.success(CONSTANTS.DELETE__SUCCESS);
                                                router.push("/admin/crews");
                                            } else {
                                                toast.error(CONSTANTS.DELETE__FAILURE);
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

export default CrewAdminPage;
