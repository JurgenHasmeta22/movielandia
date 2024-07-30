"use client";

import { Box } from "@mui/material";
import { useState, useEffect, useRef } from "react";
import { FormikProps } from "formik";
import * as yup from "yup";
import ClearOutlinedIcon from "@mui/icons-material/ClearOutlined";
import SaveAsIcon from "@mui/icons-material/SaveAs";
import ClearAllIcon from "@mui/icons-material/ClearAll";
import { toast } from "react-toastify";
import * as CONSTANTS from "@/constants/Constants";
import { useModal } from "@/providers/ModalProvider";
import { WarningOutlined, CheckOutlined } from "@mui/icons-material";
import { Movie, Prisma } from "@prisma/client";
import HeaderDashboard from "@/components/admin/layout/headerDashboard/HeaderDashboard";
import FormAdvanced from "@/components/admin/ui/form/Form";
import Breadcrumb from "@/components/admin/ui/breadcrumb/Breadcrumb";
import { useParams, useRouter } from "next/navigation";
import { deleteMovieById, getMovieById, updateMovieById } from "@/lib/actions/movie.actions";
import Link from "next/link";

const movieSchema = yup.object().shape({
    title: yup.string().required("required"),
    photoSrc: yup.string().required("required"),
    trailerSrc: yup.string().required("required"),
    duration: yup.string().required("required"),
    dateAired: yup.string().required("required"),
    ratingImdb: yup.string().required("required"),
    description: yup.string().required("required"),
});

const MovieAdminPage = () => {
    const [movie, setMovie] = useState<Movie | null>(null);
    const [formData, setFormData] = useState<any>({});
    const [open, setOpen] = useState(false);

    const router = useRouter();
    const params = useParams();

    const formikRef = useRef<FormikProps<any>>(null);
    const { openModal } = useModal();

    const breadcrumbs = [
        <Link key="2" href={`/admin/movies/${params?.id}`} style={{ textDecoration: "none" }}>
            Movie {`${params?.id}`}
        </Link>,
    ];

    // if (location?.state?.from) {
    breadcrumbs.unshift(
        <Link key="1" href={"/admin/movies"} style={{ textDecoration: "none" }}>
            {/* {location.state.from} */}
        </Link>,
    );
    // }

    const handleDataChange = (values: any) => {
        setFormData(values);
    };

    const handleResetFromParent = () => {
        formikRef.current?.resetForm();
    };

    const handleFormSubmit = async (values: any) => {
        const payload: Prisma.MovieUpdateInput = {
            title: values.title,
            description: values.description,
            duration: values.duration,
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
        const response: Movie | null = await getMovieById(Number(params.id));

        if (response) setMovie(response);
    }

    useEffect(() => {
        async function fetchData() {
            await getMovie();
        }

        fetchData();
    }, []);

    return (
        <Box m="20px">
            <Breadcrumb breadcrumbs={breadcrumbs} navigateTo={"/admin/movies"} />
            <HeaderDashboard title={CONSTANTS.MOVIE__EDIT__TITLE} subtitle={CONSTANTS.MOVIE__EDIT__SUBTITLE} />
            <FormAdvanced
                initialValues={{
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
                validationSchema={movieSchema}
                formRef={formikRef}
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
                                            // eslint-disable-next-line @typescript-eslint/no-non-null-asserted-optional-chain
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
