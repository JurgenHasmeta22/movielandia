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
import { CheckOutlined, WarningOutlined } from "@mui/icons-material";
import HeaderDashboard from "@/components/admin/layout/headerDashboard/HeaderDashboard";
import Breadcrumb from "@/components/admin/ui/breadcrumb/Breadcrumb";
import FormAdvanced from "@/components/admin/ui/form/Form";
import { useModal } from "@/providers/ModalProvider";
import { deleteUserById, getUserById, updateUserById, updateUserByIdAdmin } from "@/actions/user.actions";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Prisma, User } from "@prisma/client";

const userSchema = yup.object().shape({
    userName: yup.string().required("required"),
    email: yup.string().required("required"),
});

const UserAdmin = () => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState<any>({});
    const [open, setOpen] = useState(false);

    const router = useRouter();
    const params = useParams();

    const formikRef = useRef<FormikProps<any>>(null);
    const { openModal } = useModal();

    const breadcrumbs = [
        <Link key="2" href={`/admin/users/${Number(params?.id)}`} style={{ textDecoration: "none" }}>
            User {`${params?.id}`}
        </Link>,
    ];

    // if (location?.state?.from) {
    breadcrumbs.unshift(
        <Link key="1" href={"/admin/users"} style={{ textDecoration: "none" }}>
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
        const payload: Prisma.UserUpdateInput = {
            userName: values.userName,
            email: values.email,
            password: values.password,
        };

        const response: User | null = await updateUserByIdAdmin(payload, Number(user?.id));

        if (response) {
            toast.success(CONSTANTS.UPDATE__SUCCESS);
            getUser();
        } else {
            toast.error(CONSTANTS.UPDATE__FAILURE);
        }
    };

    async function getUser(): Promise<void> {
        const response: User | null = await getUserById(Number(params.id));
        if (response) setUser(response);
    }

    useEffect(() => {
        async function fetchData() {
            await getUser();
            setLoading(false);
        }

        fetchData();
    }, []);

    return (
        <Box m="20px">
            <Breadcrumb breadcrumbs={breadcrumbs} navigateTo={"/admin/users"} />
            <HeaderDashboard title={CONSTANTS.USER__EDIT__TITLE} subtitle={CONSTANTS.USER__EDIT__SUBTITLE} />
            <FormAdvanced
                initialValues={{
                    id: user?.id,
                    userName: user?.userName,
                    email: user?.email,
                }}
                fields={[
                    {
                        name: "id",
                        label: "User id",
                        disabled: true,
                        variant: "filled",
                        type: "text",
                    },
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
                ]}
                onDataChange={(values: any) => {
                    handleDataChange(values);
                }}
                onSubmit={handleFormSubmit}
                validationSchema={userSchema}
                formRef={formikRef}
                actions={[
                    {
                        label: CONSTANTS.FORM__DELETE__BUTTON,
                        onClick: async () => {
                            openModal({
                                onClose: () => setOpen(false),
                                title: `Delete selected user ${formData.userName}`,
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
                                            setOpen(false);

                                            const response = await deleteUserById(user?.id!);

                                            if (response) {
                                                toast.success(CONSTANTS.DELETE__SUCCESS);
                                                router.push("/admin/users");
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

export default UserAdmin;
