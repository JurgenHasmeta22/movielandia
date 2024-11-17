"use client";

import { Box } from "@mui/material";
import { useState, useEffect, useRef } from "react";
import ClearOutlinedIcon from "@mui/icons-material/ClearOutlined";
import SaveAsIcon from "@mui/icons-material/SaveAs";
import ClearAllIcon from "@mui/icons-material/ClearAll";
import { toast } from "react-toastify";
import * as CONSTANTS from "@/constants/Constants";
import { WarningOutlined, CheckOutlined } from "@mui/icons-material";
import { Prisma, Serie } from "@prisma/client";
import HeaderDashboard from "@/components/admin/headerDashboard/HeaderDashboard";
import Breadcrumb from "@/components/admin/breadcrumb/Breadcrumb";
import FormAdvanced from "@/components/admin/form/Form";
import { useModal } from "@/providers/ModalProvider";
import { updateSerieById, getSerieById, deleteSerieById } from "@/actions/serie.actions";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { z } from "zod";

const serieSchema = z.object({
    title: z.string().min(1, { message: "required" }),
    photoSrc: z.string().min(1, { message: "required" }),
    ratingImdb: z.string().min(1, { message: "required" }),
    dateAired: z.string().min(1, { message: "required" }),
});

const SerieAdminPage = () => {
    const [serie, setSerie] = useState<Serie | null>(null);
    const [formData, setFormData] = useState<any>({});
    const [open, setOpen] = useState(false);

    const router = useRouter();
    const params = useParams();

    const formRef = useRef<any>(null);
    const { openModal } = useModal();

    const breadcrumbs = [
        <Link key="2" href={`/admin/series/${params?.id}`} style={{ textDecoration: "none" }}>
            Serie {`${Number(params?.id)}`}
        </Link>,
    ];

    // if (location?.state?.from) {
    breadcrumbs.push(
        <Link key="1" href={"/admin/series"} style={{ textDecoration: "none" }}>
            {/* {location.state.from} */}
        </Link>,
    );
    // }

    const handleDataChange = (values: any) => {
        setFormData(values);
    };

    const handleResetFromParent = () => {
        formRef.current?.reset();
    };

    const handleFormSubmit = async (values: any) => {
        const payload: Prisma.SerieUpdateInput = {
            title: values.title,
            photoSrc: values.photoSrc,
            ratingImdb: Number(values.ratingImdb),
            dateAired: values.dateAired,
        };

        const response: Serie | null = await updateSerieById(payload, String(serie?.id));

        if (response) {
            toast.success(CONSTANTS.UPDATE__SUCCESS);
            getSerie();
        } else {
            toast.error(CONSTANTS.UPDATE__FAILURE);
        }
    };

    async function getSerie(): Promise<void> {
        const response: Serie | null = await getSerieById(Number(params.id), {});

        if (response) {
            setSerie(response);
        }
    }

    useEffect(() => {
        async function fetchData() {
            await getSerie();
        }

        fetchData();
    }, []);

    return (
        <Box m="20px">
            <Breadcrumb breadcrumbs={breadcrumbs} navigateTo={"/admin/series"} />
            <HeaderDashboard title={CONSTANTS.USER__EDIT__TITLE} subtitle={CONSTANTS.USER__EDIT__SUBTITLE} />
            <FormAdvanced
                defaultValues={{
                    id: serie?.id,
                    title: serie?.title,
                    photoSrc: serie?.photoSrc,
                    dateAired: serie?.dateAired,
                    ratingImdb: serie?.ratingImdb,
                }}
                fields={[
                    {
                        name: "id",
                        label: "Serie id",
                        disabled: true,
                        variant: "filled",
                        type: "text",
                    },
                    {
                        name: "title",
                        label: "Title",
                        variant: "filled",
                        type: "text",
                    },
                    {
                        name: "photoSrc",
                        label: "Photo src",
                        variant: "filled",
                        type: "text",
                    },
                    {
                        name: "dateAired",
                        label: "Date aired",
                        variant: "filled",
                        type: "text",
                    },
                    {
                        name: "ratingImdb",
                        label: "RatingImdb",
                        variant: "filled",
                        type: "text",
                    },
                ]}
                onDataChange={(values: any) => {
                    handleDataChange(values);
                }}
                onSubmit={handleFormSubmit}
                schema={serieSchema}
                formRef={formRef}
                actions={[
                    {
                        label: CONSTANTS.FORM__DELETE__BUTTON,
                        onClick: async () => {
                            openModal({
                                onClose: () => setOpen(false),
                                title: `Delete selected serie ${formData.title}`,
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
                                            const response = await deleteSerieById(serie?.id!);

                                            if (response) {
                                                toast.success(CONSTANTS.DELETE__SUCCESS);
                                                router.push("/admin/series");
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

export default SerieAdminPage;
