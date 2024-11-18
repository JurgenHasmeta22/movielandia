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
import { z } from "zod";

const movieSchema = z.object({
    title: z.string().min(1, { message: "required" }),
    photoSrc: z.string().min(1, { message: "required" }),
    trailerSrc: z.string().min(1, { message: "required" }),
    duration: z.string().min(1, { message: "required" }),
    dateAired: z.string().min(1, { message: "required" }),
    ratingImdb: z.string().min(1, { message: "required" }),
    description: z.string().min(1, { message: "required" }),
});

const AddMovieAdminPage = () => {
    const router = useRouter();
    const formRef = useRef<any>(null);

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

    return (
        <Box m="20px">
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
                fields={[
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
                        name: "trailerSrc",
                        label: "Trailer src",
                        variant: "filled",
                        type: "text",
                    },
                    {
                        name: "duration",
                        label: "Duration",
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
                        name: "dateAired",
                        label: "Date aired",
                        variant: "filled",
                        type: "text",
                    },
                    {
                        name: "description",
                        label: "Description",
                        variant: "filled",
                        type: "text",
                    },
                ]}
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
