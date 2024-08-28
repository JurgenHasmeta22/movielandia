"use client";

import Box from "@mui/material-pigment-css/Box";
import * as yup from "yup";
import { toast } from "react-toastify";
import { FormikProps } from "formik";
import { useRef } from "react";
import SaveAsIcon from "@mui/icons-material/SaveAs";
import ClearAllIcon from "@mui/icons-material/ClearAll";
import * as CONSTANTS from "@/constants/Constants";
import { useRouter } from "next/navigation";
import HeaderDashboard from "@/components/admin/layout/headerDashboard/HeaderDashboard";
import FormAdvanced from "@/components/admin/ui/form/Form";
import { signUp } from "@/actions/auth.actions";
import { User } from "@prisma/client";

const userSchema = yup.object().shape({
    userName: yup.string().required("required"),
    email: yup.string().required("required"),
    password: yup.string().required("required"),
});

const AddUserAdminPage = () => {
    const router = useRouter();
    const formikRef = useRef<FormikProps<any>>(null);

    const handleResetFromParent = () => {
        formikRef.current?.resetForm();
    };

    const handleFormSubmit = async (values: any) => {
        const response: User | null | undefined = await signUp({
            userName: values.userName,
            email: values.email,
            password: values.password,
        });

        if (response) {
            toast.success(CONSTANTS.ADD__SUCCESS);
            router.push(`/admin/users/${response.id}`);
        } else {
            toast.error(CONSTANTS.ADD__FAILURE);
        }
    };

    return (
        <Box
            sx={{
                margin: "20px",
            }}
        >
            <HeaderDashboard title={CONSTANTS.USER__ADD__TITLE} subtitle={CONSTANTS.USER__ADD__SUBTITLE} />
            <FormAdvanced
                initialValues={{
                    userName: "",
                    email: "",
                    password: "",
                }}
                fields={[
                    {
                        name: "userName",
                        label: "Username",
                        variant: "filled",
                        type: "text",
                    },
                    {
                        name: "email",
                        label: "Email",
                        variant: "filled",
                        type: "text",
                    },
                    {
                        name: "password",
                        label: "Password",
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
                validationSchema={userSchema}
                formRef={formikRef}
            />
        </Box>
    );
};

export default AddUserAdminPage;
