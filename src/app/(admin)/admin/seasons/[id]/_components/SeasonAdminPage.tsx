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
import { Season, Prisma } from "@prisma/client";
import HeaderDashboard from "@/components/admin/headerDashboard/HeaderDashboard";
import FormAdvanced from "@/components/admin/form/Form";
import Breadcrumb from "@/components/admin/breadcrumb/Breadcrumb";
import { useParams, useRouter } from "next/navigation";
import { deleteSeasonById, getSeasonById, updateSeasonById } from "@/actions/season.actions";
import Link from "next/link";
import LoadingSpinner from "@/components/root/loadingSpinner/LoadingSpinner";
import { seasonSchema } from "@/schemas/season.schema";

const SeasonAdminPage = () => {
    const [season, setSeason] = useState<Season | null>(null);
    const [formData, setFormData] = useState<any>({});
    const [loading, setLoading] = useState(true);
    const [open, setOpen] = useState(false);

    const router = useRouter();
    const params = useParams();
    const { openModal } = useModal();
    const formRef = useRef<any>(null);

    const breadcrumbs = [
        <Link key="1" href="/admin/seasons" style={{ textDecoration: "none" }}>
            Seasons
        </Link>,
        <Link key="2" href={`/admin/seasons/${params?.id}`} style={{ textDecoration: "none" }}>
            {season?.title || `Season ${params?.id}`}
        </Link>,
    ];

    // const handleDataChange = (values: any) => {
    //     setFormData(values);
    // };

    const handleResetFromParent = () => {
        formRef.current?.reset();
    };

    const handleFormSubmit = async (values: any) => {
        const payload: Prisma.SeasonUpdateInput = {
            title: values.title,
            photoSrc: values.photoSrc,
            photoSrcProd: values.photoSrcProd,
            trailerSrc: values.trailerSrc,
            description: values.description,
            dateAired: values.dateAired,
            ratingImdb: Number(values.ratingImdb),
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

    async function getSeason(): Promise<void> {
        setLoading(true);
        const response: Season | null = await getSeasonById(Number(params.id), {});

        if (response) {
            setSeason(response);
            setLoading(false);
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
            <Breadcrumb breadcrumbs={breadcrumbs} navigateTo={"/admin/seasons"} />
            <HeaderDashboard title={"Season"} subtitle={"Edit Season"} />
            <FormAdvanced
                defaultValues={{
                    id: season?.id,
                    title: season?.title,
                    photoSrc: season?.photoSrc,
                    photoSrcProd: season?.photoSrcProd,
                    trailerSrc: season?.trailerSrc,
                    description: season?.description,
                    dateAired: season?.dateAired,
                    ratingImdb: season?.ratingImdb,
                    serieId: season?.serieId,
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
                        name: "title",
                        label: "Title",
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
                        name: "trailerSrc",
                        label: "Trailer Src",
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
                        name: "dateAired",
                        label: "Date Aired",
                        variant: "filled",
                        type: "date",
                    },
                    {
                        name: "ratingImdb",
                        label: "IMDB Rating",
                        variant: "filled",
                        type: "text",
                    },
                    {
                        name: "serieId",
                        label: "Serie ID",
                        variant: "filled",
                        type: "text",
                    },
                ]}
                schema={seasonSchema}
                onSubmit={handleFormSubmit}
                formRef={formRef}
                actions={[
                    {
                        label: CONSTANTS.FORM__DELETE__BUTTON,
                        onClick: async () => {
                            openModal({
                                onClose: () => setOpen(false),
                                title: `Delete selected season ${formData.title}`,
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
                                            const response = await deleteSeasonById(season?.id);

                                            if (response) {
                                                toast.success(CONSTANTS.DELETE__SUCCESS);
                                                router.push("/admin/seasons");
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

export default SeasonAdminPage;
