"use client";

import { Box } from "@mui/material";
import HeaderDashboard from "@/components/admin/headerDashboard/HeaderDashboard";
import { useState, useEffect, useRef } from "react";
import ClearOutlinedIcon from "@mui/icons-material/ClearOutlined";
import SaveAsIcon from "@mui/icons-material/SaveAs";
import ClearAllIcon from "@mui/icons-material/ClearAll";
import FormAdvanced from "@/components/admin/form/Form";
import { toast } from "react-toastify";
import * as CONSTANTS from "@/constants/Constants";
import Breadcrumb from "@/components/admin/breadcrumb/Breadcrumb";
import { useModal } from "@/providers/ModalProvider";
import { WarningOutlined, CheckOutlined } from "@mui/icons-material";
import { useParams, useRouter } from "next/navigation";
import { deleteGenreById, getGenreById, updateGenreById } from "@/actions/genre.actions";
import { Genre, Prisma } from "@prisma/client";
import Link from "next/link";
import { z } from "zod";

interface IGenreEdit {
    id?: string;
    name: string;
}

const genreSchema = z.object({
    name: z.string().min(1, { message: "required" }),
});

const GenreAdminPage = () => {
    const [genre, setGenre] = useState<Genre | null>(null);
    const [formData, setFormData] = useState<any>({});
    const [open, setOpen] = useState(false);

    const formRef = useRef<any>(null);

    const router = useRouter();
    const params = useParams();
    const { openModal } = useModal();

    const breadcrumbs = [
        <Link key="2" href={`/admin/genres/${params?.id}`} style={{ textDecoration: "none" }}>
            Genre {`${params?.id}`}
        </Link>,
    ];

    // if (location?.state?.from) {
    breadcrumbs.push(
        <Link key="1" href={"/admin/genres"} style={{ textDecoration: "none" }}>
            {/* {location.state.from} */}
        </Link>,
    );
    // }

    const handleDataChange = (values: any) => {
        setFormData(values);
    };

    const handleResetFromParent = () => {
        if (formRef.current) {
            formRef.current.reset();
        }
    };

    const handleFormSubmit = async (values: IGenreEdit) => {
        const payload: Prisma.GenreUpdateInput = {
            name: values.name,
        };

        const response: Genre | null = await updateGenreById(payload, String(genre?.id));

        if (response) {
            toast.success(CONSTANTS.UPDATE__SUCCESS);
            getGenre();
        } else {
            toast.error(CONSTANTS.UPDATE__FAILURE);
        }
    };

    async function getGenre(): Promise<void> {
        const response: Genre | null = await getGenreById(Number(params.id), {});

        if (response) {
            setGenre(response);
            handleResetFromParent();
        }
    }

    useEffect(() => {
        async function fetchData() {
            await getGenre();
        }

        fetchData();
    }, []);

    return (
        <Box m="20px">
            <Breadcrumb breadcrumbs={breadcrumbs} navigateTo={"/admin/genres"} />
            <HeaderDashboard title={CONSTANTS.USER__EDIT__TITLE} subtitle={CONSTANTS.USER__EDIT__SUBTITLE} />
            <FormAdvanced
                defaultValues={{
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
                schema={genreSchema}
                formRef={formRef}
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

export default GenreAdminPage;
