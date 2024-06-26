"use client";

import { Box, Link } from "@mui/material";
import HeaderDashboard from "@/components/admin/layout/headerDashboard/HeaderDashboard";
import { useState, useEffect, useRef } from "react";
import { FormikProps } from "formik";
import * as yup from "yup";
import ClearOutlinedIcon from "@mui/icons-material/ClearOutlined";
import SaveAsIcon from "@mui/icons-material/SaveAs";
import ClearAllIcon from "@mui/icons-material/ClearAll";
import FormAdvanced from "@/components/admin/ui/form/Form";
import { toast } from "react-toastify";
import * as CONSTANTS from "@/constants/Constants";
import Breadcrumb from "@/components/admin/ui/breadcrumb/Breadcrumb";
import { useModal } from "@/providers/ModalContext";
import { WarningOutlined, CheckOutlined } from "@mui/icons-material";
import Loading from "@/components/root/ui/loadingSpinner/LoadingSpinner";
import { useParams, useRouter } from "next/navigation";
import { deleteGenreById, getGenreById, updateGenreById } from "@/lib/actions/genre.action";
import { Genre } from "@prisma/client";

const genreSchema = yup.object().shape({
    name: yup.string().required("required"),
});

const GenreAdmin = () => {
    const [genre, setGenre] = useState<Genre | null>(null);
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState<any>({});

    const router = useRouter();
    const params = useParams();
    const formikRef = useRef<FormikProps<any>>(null);
    const { openModal } = useModal();
    const [open, setOpen] = useState(false);

    const breadcrumbs = [
        <Link key="2" to={`/admin/genres/${params?.id}`} style={{ textDecoration: "none" }}>
            Genre {`${params?.id}`}
        </Link>,
    ];

    if (location?.state?.from) {
        breadcrumbs.push(
            <Link key="1" to={"/admin/genres"} style={{ textDecoration: "none" }}>
                {location.state.from}
            </Link>,
        );
    }

    const handleDataChange = (values: any) => {
        setFormData(values);
    };

    const handleResetFromParent = () => {
        formikRef.current?.resetForm();
    };

    const handleFormSubmit = async (values: any) => {
        const payload = {
            name: values.name,
        };

        const response = await updateGenreById(payload, genre?.id!);

        if (response) {
            toast.success(CONSTANTS.UPDATE__SUCCESS);
            getGenre();
        } else {
            toast.error(CONSTANTS.UPDATE__FAILURE);
        }
    };

    async function getGenre(): Promise<void> {
        const response = await getGenreById(params.id);
        setGenre(response);
    }

    useEffect(() => {
        async function fetchData() {
            await getGenre();
            setLoading(false);
        }

        fetchData();
    }, []);

    if (loading) return <Loading />;

    return (
        <Box m="20px">
            <Breadcrumb breadcrumbs={breadcrumbs} navigateTo={"/admin/genres"} />
            <HeaderDashboard title={CONSTANTS.USER__EDIT__TITLE} subtitle={CONSTANTS.USER__EDIT__SUBTITLE} />
            <FormAdvanced
                initialValues={{
                    id: genre?.id,
                    name: genre?.name,
                }}
                fields={[
                    {
                        name: "id",
                        label: "Genre id",
                        disabled: true,
                        variant: "filled",
                        type: "text",
                    },
                    {
                        name: "name",
                        label: "Name",
                        variant: "filled",
                        type: "text",
                    },
                ]}
                onDataChange={(values: any) => {
                    handleDataChange(values);
                }}
                onSubmit={handleFormSubmit}
                validationSchema={genreSchema}
                formRef={formikRef}
                actions={[
                    {
                        label: CONSTANTS.FORM__DELETE__BUTTON,
                        onClick: async () => {
                            openModal({
                                onClose: () => setOpen(false),
                                title: `Delete selected genre ${formData.name}`,
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
                                            const response = await deleteGenreById(genre?.id!);

                                            if (response) {
                                                toast.success(CONSTANTS.DELETE__SUCCESS);
                                                router.push("/admin/genres");
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

export default GenreAdmin;
