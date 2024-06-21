import { Box } from "@mui/material";
import Header from "~/components/admin/headerDashboard/HeaderDashboard";
import { useNavigate } from "react-router";
import * as yup from "yup";
import { toast } from "react-toastify";
import FormAdvanced from "~/components/admin/form/Form";
import { FormikProps } from "formik";
import { useState, useRef } from "react";
import SaveAsIcon from "@mui/icons-material/SaveAs";
import ClearAllIcon from "@mui/icons-material/ClearAll";
import * as CONSTANTS from "~/constants/Constants";
import IMoviePost from "~/types/IMoviePost";
import movieService from "~/services/api/movieService";

const movieSchema = yup.object().shape({
    title: yup.string().required("required"),
    photoSrc: yup.string().required("required"),
    trailerSrc: yup.string().required("required"),
    duration: yup.string().required("required"),
    releaseYear: yup.string().required("required"),
    ratingImdb: yup.string().required("required"),
    description: yup.string().required("required"),
});

const AddMovie = () => {
    // const [formData, setFormData] = useState({});
    const navigate = useNavigate();
    const formikRef = useRef<FormikProps<any>>(null);

    // const handleDataChange = (values: any) => {
    //     setFormData(values);
    // };

    const handleResetFromParent = () => {
        formikRef.current?.resetForm();
    };

    const handleFormSubmit = async (values: any) => {
        const payload: IMoviePost = {
            title: values.title,
            description: values.description,
            duration: values.duration,
            photoSrc: values.photoSrc,
            trailerSrc: values.trailerSrc,
            ratingImdb: Number(values.ratingImdb),
            releaseYear: Number(values.releaseYear),
        };
        const response = await movieService.addMovie(payload);

        if (response) {
            toast.success(CONSTANTS.UPDATE__SUCCESS);
            navigate(`/admin/movies/${response.id}`);
        } else {
            toast.error(CONSTANTS.UPDATE__FAILURE);
        }
    };

    return (
        <Box m="20px">
            <Header title={CONSTANTS.MOVIE__ADD__TITLE} subtitle={CONSTANTS.MOVIE__ADD__SUBTITLE} />
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
                // onDataChange={(values: any) => {
                //     handleDataChange(values);
                // }}
                onSubmit={handleFormSubmit}
                validationSchema={movieSchema}
                formRef={formikRef}
            />
        </Box>
    );
};

export default AddMovie;
