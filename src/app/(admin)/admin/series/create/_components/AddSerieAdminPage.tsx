"use client";

import { Box } from "@mui/material";
import * as yup from "yup";
import { toast } from "react-toastify";
import { FormikProps } from "formik";
import { useRef } from "react";
import SaveAsIcon from "@mui/icons-material/SaveAs";
import ClearAllIcon from "@mui/icons-material/ClearAll";
import * as CONSTANTS from "@/constants/Constants";
import HeaderDashboard from "@/components/admin/ui/headerDashboard/HeaderDashboard";
import { useRouter } from "next/navigation";
import FormAdvanced from "@/components/admin/ui/form/Form";
import { addSerie } from "@/actions/serie.actions";
import { Serie } from "@prisma/client";

interface IAddSerie {
    title: string;
    photoSrc: string;
    dateAired: string;
    ratingImdb: string | number;
}

const serieSchema = yup.object().shape({
    title: yup.string().required("required"),
    photoSrc: yup.string().required("required"),
    dateAired: yup.string().required("required"),
    ratingImdb: yup.string().required("required"),
});

const AddSerieAdminPage = () => {
    const formikRef = useRef<FormikProps<any>>(null);
    const router = useRouter();

    const handleResetFromParent = () => {
        formikRef.current?.resetForm();
    };

    const handleFormSubmit = async (values: IAddSerie) => {
        const payload = {
            title: values.title,
            photoSrc: values.photoSrc,
            ratingImdb: Number(values.ratingImdb),
            dateAired: values.dateAired,
        };

        const response: Serie | null = await addSerie(payload);

        if (response) {
            toast.success(CONSTANTS.UPDATE__SUCCESS);
            router.push(`/admin/series/${response.id}`);
        } else {
            toast.error(CONSTANTS.UPDATE__FAILURE);
        }
    };

    return (
        <Box m="20px">
            <HeaderDashboard title={CONSTANTS.SERIE__ADD__TITLE} subtitle={CONSTANTS.SERIE__ADD__SUBTITLE} />
            <FormAdvanced
                initialValues={{
                    title: "",
                    photoSrc: "",
                    dateAired: "",
                    ratingImdb: "",
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
                validationSchema={serieSchema}
                formRef={formikRef}
            />
        </Box>
    );
};

export default AddSerieAdminPage;
