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
import { Movie, Prisma } from "@prisma/client";
import HeaderDashboard from "@/components/admin/headerDashboard/HeaderDashboard";
import FormAdvanced from "@/components/admin/form/Form";
import Breadcrumb from "@/components/admin/breadcrumb/Breadcrumb";
import { useParams, useRouter } from "next/navigation";
import { deleteMovieById, getMovieById, updateMovieById } from "@/actions/movie.actions";
import Link from "next/link";
import { z } from "zod";
import LoadingSpinner from "@/components/root/loadingSpinner/LoadingSpinner";

const movieSchema = z.object({
    title: z.string().min(1, { message: "required" }),
    photoSrc: z.string().min(1, { message: "required" }),
    trailerSrc: z.string().min(1, { message: "required" }),
    duration: z.coerce.number().min(1, { message: "required" }),
    dateAired: z.string().min(1, { message: "required" }),
    ratingImdb: z.coerce.number().min(1, { message: "required" }),
    description: z.string().min(1, { message: "required" }),
});

const MovieAdminPage = () => {
    const [movie, setMovie] = useState<Movie | null>(null);
    const [formData, setFormData] = useState<any>({});
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(true);

    const router = useRouter();
    const params = useParams();
    const { openModal } = useModal();
    const formRef = useRef<any>(null);

    const breadcrumbs = [
        <Link key="1" href="/admin/movies" style={{ textDecoration: "none" }}>
            Movies
        </Link>,
        <Link key="2" href={`/admin/movies/${params?.id}`} style={{ textDecoration: "none" }}>
            {movie?.title || `Movie ${params?.id}`}
        </Link>,
    ];

    const handleDataChange = (values: any) => {
        setFormData(values);
    };

    const handleResetFromParent = () => {
        formRef.current?.reset();
    };

    const handleFormSubmit = async (values: any) => {
        const payload: Prisma.MovieUpdateInput = {
            title: values.title,
            description: values.description,
            duration: Number(values.duration),
            photoSrc: values.photoSrc,
            trailerSrc: values.trailerSrc,
            ratingImdb: Number(values.ratingImdb),
            dateAired: values.dateAired,
        };

        const response: Movie | null = await updateMovieById(payload, String(movie?.id));

        if (response) {
            toast.success(CONSTANTS.UPDATE__SUCCESS);
            getMovie();
        } else {
            toast.error(CONSTANTS.UPDATE__FAILURE);
        }
    };

    async function getMovie(): Promise<void> {
        setLoading(true);

        const response: Movie | null = await getMovieById(Number(params.id), {});

        if (response) {
            setMovie(response);
            setLoading(false);
        }
    }

    useEffect(() => {
        getMovie();
    }, []);

    if (loading) {
        return <LoadingSpinner />;
    }

    return (
        <Box m="20px">
            <Breadcrumb breadcrumbs={breadcrumbs} navigateTo={"/admin/movies"} />
            <HeaderDashboard title={CONSTANTS.MOVIE__EDIT__TITLE} subtitle={CONSTANTS.MOVIE__EDIT__SUBTITLE} />
            <FormAdvanced
                defaultValues={{
                    id: movie?.id,
                    title: movie?.title,
                    trailerSrc: movie?.trailerSrc,
                    photoSrc: movie?.photoSrc,
                    description: movie?.description,
                    dateAired: movie?.dateAired,
                    ratingImdb: movie?.ratingImdb,
                    duration: movie?.duration,
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
                        label: "Photo src",
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
                        name: "trailerSrc",
                        label: "Trailer src",
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
                        label: "Rating imdb",
                        variant: "filled",
                        type: "text",
                    },
                    {
                        name: "duration",
                        label: "Duration",
                        variant: "filled",
                        type: "text",
                    },
                ]}
                onDataChange={(values: any) => {
                    handleDataChange(values);
                }}
                onSubmit={handleFormSubmit}
                schema={movieSchema}
                formRef={formRef}
                actions={[
                    {
                        label: CONSTANTS.FORM__DELETE__BUTTON,
                        onClick: async () => {
                            openModal({
                                onClose: () => setOpen(false),
                                title: `Delete selected movie ${formData.title}`,
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
                                            const response = await deleteMovieById(movie?.id!);

                                            if (response) {
                                                toast.success(CONSTANTS.DELETE__SUCCESS);
                                                router.push("/admin/movies");
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

export default MovieAdminPage;
