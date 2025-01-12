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
import { Person, Prisma } from "@prisma/client";
import HeaderDashboard from "@/components/admin/headerDashboard/HeaderDashboard";
import FormAdvanced from "@/components/admin/form/Form";
import Breadcrumb from "@/components/admin/breadcrumb/Breadcrumb";
import { useParams, useRouter } from "next/navigation";
import { deletePersonById, getPersonById, updatePersonById } from "@/actions/person.actions";
import Link from "next/link";
import LoadingSpinner from "@/components/root/loadingSpinner/LoadingSpinner";
import { personSchema } from "@/schemas/person.schema";

const PersonAdminPage = () => {
    const [person, setPerson] = useState<Person | null>(null);
    const [formData, setFormData] = useState<any>({});
    const [loading, setLoading] = useState(true);
    const [open, setOpen] = useState(false);

    const router = useRouter();
    const params = useParams();
    const { openModal } = useModal();
    const formRef = useRef<any>(null);

    const breadcrumbs = [
        <Link key="1" href="/admin/persons" style={{ textDecoration: "none" }}>
            Persons
        </Link>,
        <Link key="2" href={`/admin/persons/${params?.id}`} style={{ textDecoration: "none" }}>
            {person?.fullname || `Person ${params?.id}`}
        </Link>,
    ];

    // const handleDataChange = (values: any) => {
    //     setFormData(values);
    // };

    const handleResetFromParent = () => {
        formRef.current?.reset();
    };

    const handleFormSubmit = async (values: any) => {
        const payload: Prisma.PersonUpdateInput = {
            fullname: values.fullname,
            photoSrc: values.photoSrc,
            photoSrcProd: values.photoSrcProd,
            description: values.description,
            debut: values.debut,
        };

        const response: Person | null = await updatePersonById(payload, String(person?.id));

        if (response) {
            toast.success(CONSTANTS.UPDATE__SUCCESS);
            getPerson();
        } else {
            toast.error(CONSTANTS.UPDATE__FAILURE);
        }
    };

    async function getPerson(): Promise<void> {
        setLoading(true);
        const response: Person | null = await getPersonById(Number(params.id), {});

        if (response) {
            setPerson(response);
            setLoading(false);
        }
    }

    useEffect(() => {
        getPerson();
    }, []);

    if (loading) {
        return <LoadingSpinner />;
    }

    return (
        <Box m="20px">
            <Breadcrumb breadcrumbs={breadcrumbs} navigateTo={"/admin/persons"} />
            <HeaderDashboard title={"Person"} subtitle={"Edit person"} />
            <FormAdvanced
                defaultValues={{
                    id: person?.id,
                    fullname: person?.fullname,
                    photoSrc: person?.photoSrc,
                    photoSrcProd: person?.photoSrcProd,
                    description: person?.description,
                    debut: person?.debut,
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
                schema={personSchema}
                onSubmit={handleFormSubmit}
                formRef={formRef}
                actions={[
                    {
                        label: CONSTANTS.FORM__DELETE__BUTTON,
                        onClick: async () => {
                            openModal({
                                onClose: () => setOpen(false),
                                title: `Delete selected person ${formData.name}`,
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
                                            const response = await deletePersonById(person?.id!);

                                            if (response) {
                                                toast.success(CONSTANTS.DELETE__SUCCESS);
                                                router.push("/admin/persons");
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

export default PersonAdminPage;
