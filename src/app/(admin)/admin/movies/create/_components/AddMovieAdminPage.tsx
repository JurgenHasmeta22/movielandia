"use client";

import { Box } from "@mui/material";
import { toast } from "react-toastify";
import { useRef } from "react";
import SaveAsIcon from "@mui/icons-material/SaveAs";
import ClearAllIcon from "@mui/icons-material/ClearAll";
import * as CONSTANTS from "@/constants/Constants";
import HeaderDashboard from "@/components/admin/headerDashboard/HeaderDashboard";
import FormAdvanced from "@/components/admin/form/Form";
import { addMovie } from "@/actions/movie.actions";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Breadcrumb from "@/components/admin/breadcrumb/Breadcrumb";
import { movieSchema } from "@/schemas/movie.schema";

const AddMovieAdminPage = () => {
    const router = useRouter();
    const formRef = useRef<any>(null);

    const breadcrumbs = [
        <Link key="1" href="/admin/movies" style={{ textDecoration: "none" }}>
            Movies
        </Link>,
        <Link key="2" href={`/admin/movies/create`} style={{ textDecoration: "none" }}>
            New Movie
        </Link>,
    ];

    const handleResetFromParent = () => {
        formRef.current?.reset();
    };

    const handleFormSubmit = async (values: any) => {
        const payload = {
            title: values.title,
            description: values.description,
            duration: values.duration,
            photoSrc: values.photoSrc,
            trailerSrc: values.trailerSrc,
            ratingImdb: Number(values.ratingImdb),
            dateAired: values.dateAired,
        };

        const response = await addMovie(payload);

        if (response) {
            toast.success(CONSTANTS.UPDATE__SUCCESS);
            router.push(`/admin/movies/${response.id}`);
        } else {
            toast.error(CONSTANTS.UPDATE__FAILURE);
        }
    };

    const formFields = [
        {
            key: 'title',
            name: "title",
            label: "Title",
            variant: "filled",
            type: "text",
        },
        {
            key: 'photoSrc',
            name: "photoSrc",
            label: "Photo src",
            variant: "filled",
            type: "text",
        },
        {
            key: 'photoSrcProd',
            name: "photoSrcProd",
            label: "Photo src prod",
            variant: "filled",
            type: "text",
        },
        {
            key: 'trailerSrc',
            name: "trailerSrc",
            label: "Trailer src",
            variant: "filled",
            type: "text",
        },
        {
            key: 'duration',
            name: "duration",
            label: "Duration",
            variant: "filled",
            type: "text",
        },
        {
            key: 'ratingImdb',
            name: "ratingImdb",
            label: "Rating imdb",
            variant: "filled",
            type: "text",
        },
        {
            key: 'dateAired',
            name: "dateAired",
            label: "Date aired",
            variant: "filled",
            type: "date",
        },
        {
            key: 'description',
            name: "description",
            label: "Description",
            variant: "filled",
            type: "text",
        },
    ];

    return (
        <Box m="20px">
            <Breadcrumb breadcrumbs={breadcrumbs} navigateTo={"/admin/movies"} />
            <HeaderDashboard title={CONSTANTS.MOVIE__ADD__TITLE} subtitle={CONSTANTS.MOVIE__ADD__SUBTITLE} />
            <FormAdvanced
                defaultValues={{
                    title: "",
                    photoSrc: "",
                    trailerSrc: "",
                    duration: "",
                    ratingImdb: "",
                    dateAired: "",
                    description: "",
                }}
                fields={formFields}
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
                onSubmit={handleFormSubmit}
                schema={movieSchema}
                formRef={formRef}
            />
        </Box>
    );
};

export default AddMovieAdminPage;
