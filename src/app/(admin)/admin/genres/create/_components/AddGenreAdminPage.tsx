"use client";

import Header from "@/components/admin/layout/headerDashboard/HeaderDashboard";
import * as yup from "yup";
import { toast } from "react-toastify";
import FormAdvanced from "@/components/admin/ui/form/Form";
import { FormikProps } from "formik";
import { useRef } from "react";
import SaveAsIcon from "@mui/icons-material/SaveAs";
import ClearAllIcon from "@mui/icons-material/ClearAll";
import * as CONSTANTS from "@/constants/Constants";
import { useRouter } from "next/navigation";
import { addGenre } from "@/actions/genre.actions";
import { Genre } from "@prisma/client";
import Box from "@mui/material-pigment-css/Box";

interface IGenreAdd {
    name: string;
}

const genreSchema = yup.object().shape({
    name: yup.string().required("required"),
});

const AddGenreAdminPage = () => {
    const router = useRouter();
    const formikRef = useRef<FormikProps<any>>(null);

    const handleResetFromParent = () => {
        formikRef.current?.resetForm();
    };

    const handleFormSubmit = async (values: IGenreAdd) => {
        const payload: IGenreAdd = {
            name: values.name,
        };

        const response: Genre | null = await addGenre(payload);

        if (response) {
            toast.success(CONSTANTS.UPDATE__SUCCESS);
            router.push(`/admin/genres/${response.id}`);
        } else {
            toast.error(CONSTANTS.UPDATE__FAILURE);
        }
    };

    return (
        <Box
            sx={{
                margin: "20px",
            }}
        >
            <Header title={CONSTANTS.GENRE__ADD__TITLE} subtitle={CONSTANTS.GENRE__ADD__SUBTITLE} />
            <FormAdvanced
                initialValues={{
                    name: "",
                }}
                fields={[
                    {
                        name: "name",
                        label: "Name",
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
                        icon: <SaveAsIcon sx={{ marginLeft: "10px" }} color="action" />,
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
                        icon: <ClearAllIcon color="action" sx={{ marginLeft: "10px" }} />,
                    },
                ]}
                onSubmit={handleFormSubmit}
                validationSchema={genreSchema}
                formRef={formikRef}
            />
        </Box>
    );
};

export default AddGenreAdminPage;
