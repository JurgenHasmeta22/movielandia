"use client";

import { Box } from "@mui/material";
import { useRef } from "react";
import SaveAsIcon from "@mui/icons-material/SaveAs";
import ClearAllIcon from "@mui/icons-material/ClearAll";
import { toast } from "react-toastify";
import * as CONSTANTS from "@/constants/Constants";
import HeaderDashboard from "@/components/admin/headerDashboard/HeaderDashboard";
import Breadcrumb from "@/components/admin/breadcrumb/Breadcrumb";
import FormAdvanced from "@/components/admin/form/Form";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Person, Prisma } from "@prisma/client";
import { addPerson } from "@/actions/person.actions";
import { personSchema } from "@/schemas/person.schema";

const AddPersonAdminPage = () => {
    const formRef = useRef<any>(null);
    const router = useRouter();

    const breadcrumbs = [
        <Link key="1" href="/admin/persons" style={{ textDecoration: "none" }}>
            Persons
        </Link>,
        <Link key="2" href="/admin/persons/create" style={{ textDecoration: "none" }}>
            New Person
        </Link>,
    ];

    const handleResetFromParent = () => {
        if (formRef.current) {
            formRef.current.reset();
        }
    };

    const handleFormSubmit = async (values: any) => {
        const payload: Prisma.PersonCreateInput = {
            fullname: values.fullname,
            photoSrc: values.photoSrc,
            photoSrcProd: values.photoSrcProd,
            description: values.description,
            debut: values.debut,
        };

        try {
            const response: Person | null = await addPerson(payload);

            if (response) {
                toast.success(CONSTANTS.ADD__SUCCESS);
                router.push("/admin/persons");
            } else {
                toast.error(CONSTANTS.ADD__FAILURE);
            }
        } catch (error) {
            console.error("Error creating person:", error);
            toast.error(CONSTANTS.ADD__FAILURE);
        }
    };

    return (
        <Box m="20px">
            <Breadcrumb breadcrumbs={breadcrumbs} navigateTo="/admin/persons" />
            <HeaderDashboard title="Person" subtitle="Add an person" />
            <FormAdvanced
                schema={personSchema}
                defaultValues={{
                    fullname: "",
                    photoSrc: "",
                    photoSrcProd: "",
                    description: "",
                    debut: "",
                }}
                onSubmit={handleFormSubmit}
                formRef={formRef}
                fields={[
                    {
                        name: "fullname",
                        label: "Fullname",
                        type: "text",
                        variant: "filled",
                    },
                    {
                        name: "photoSrc",
                        label: "Photo Src",
                        type: "text",
                        variant: "filled",
                    },
                    {
                        name: "photoSrcProd",
                        label: "Photo Src Prod",
                        type: "text",
                        variant: "filled",
                    },
                    {
                        name: "description",
                        label: "Description",
                        type: "text",
                        variant: "filled",
                    },
                    {
                        name: "debut",
                        label: "Debut",
                        type: "text",
                        variant: "filled",
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
            />
        </Box>
    );
};

export default AddPersonAdminPage;
