"use client";

import { Box } from "@mui/material";
import * as yup from "yup";
import { toast } from "react-toastify";
import { FormikProps } from "formik";
import { useRef } from "react";
import SaveAsIcon from "@mui/icons-material/SaveAs";
import ClearAllIcon from "@mui/icons-material/ClearAll";
import * as CONSTANTS from "@/constants/Constants";
import HeaderDashboard from "@/components/admin/layout/headerDashboard/HeaderDashboard";
import FormAdvanced from "@/components/admin/ui/form/Form";
import { addMovie } from "@/lib/actions/movie.actions";
import { useRouter } from "next/navigation";

const movieSchema = yup.object().shape({
    title: yup.string().required("required"),
    photoSrc: yup.string().required("required"),
    trailerSrc: yup.string().required("required"),
    duration: yup.string().required("required"),
    releaseYear: yup.string().required("required"),
    ratingImdb: yup.string().required("required"),
    description: yup.string().required("required"),
});

const AddMovieAdminPage = () => {
    const router = useRouter();
    const formikRef = useRef<FormikProps<any>>(null);

    const handleResetFromParent = () => {
        formikRef.current?.resetForm();
    };

    const handleFormSubmit = async (values: any) => {
        const payload = {
            title: values.title,
            description: values.description,
            duration: values.duration,
            photoSrc: values.photoSrc,
            trailerSrc: values.trailerSrc,
            ratingImdb: Number(values.ratingImdb),
            releaseYear: Number(values.releaseYear),
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
                initialValues={{
                    title: "",
                    photoSrc: "",
                    trailerSrc: "",
                    duration: "",
                    ratingImdb: "",
                    releaseYear: "",
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
                        name: "releaseYear",
                        label: "Release year",
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
                validationSchema={movieSchema}
                formRef={formikRef}
            />
        </Box>
    );
};

export default AddMovieAdminPage;
