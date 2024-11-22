"use client";

import { Box } from "@mui/material";
import { useRouter } from "next/navigation";
import { useRef } from "react";
import { toast } from "react-toastify";
import HeaderDashboard from "@/components/admin/headerDashboard/HeaderDashboard";
import { addCrewMember } from "@/actions/crew.actions";
import SaveAsIcon from "@mui/icons-material/SaveAs";
import ClearAllIcon from "@mui/icons-material/ClearAll";
import FormAdvanced from "@/components/admin/form/Form";
import * as CONSTANTS from "@/constants/Constants";
import { z } from "zod";
import Link from "next/link";
import Breadcrumb from "@/components/admin/breadcrumb/Breadcrumb";

export const crewSchema = z.object({
    fullname: z.string().min(1, { message: "required" }),
    photoSrc: z.string().min(1, { message: "required" }),
    photoSrcProd: z.string().min(1, { message: "required" }),
    role: z.string().min(1, { message: "required" }),
    description: z.string().min(1, { message: "required" }),
    debut: z.string().min(1, { message: "required" }),
});

const AddCrewAdminPage = () => {
    const router = useRouter();
    const formRef = useRef<any>(null);

    const breadcrumbs = [
        <Link key="1" href="/admin/crews" style={{ textDecoration: "none" }}>
            Crews
        </Link>,
        <Link key="2" href={`/admin/crews/create`} style={{ textDecoration: "none" }}>
            New Crew
        </Link>,
    ];

    const handleFormSubmit = async (data: any) => {
        const response = await addCrewMember(data);

        if (response) {
            toast.success(CONSTANTS.UPDATE__SUCCESS);
            router.push("/admin/crew");
        } else {
            toast.error(CONSTANTS.UPDATE__FAILURE);
        }
    };

    const handleResetFromParent = () => {
        if (formRef.current) {
            formRef.current.reset();
        }
    };

    return (
        <Box m="20px">
            <Breadcrumb breadcrumbs={breadcrumbs} navigateTo="/admin/actors" />
            <HeaderDashboard title="Crew" subtitle="Add a crew member" />
            <FormAdvanced
                schema={crewSchema}
                defaultValues={{
                    fullname: "",
                    photoSrc: "",
                    photoSrcProd: "",
                    role: "",
                    description: "",
                    debut: "",
                }}
                onSubmit={handleFormSubmit}
                formRef={formRef}
                fields={[
                    {
                        name: "fullname",
                        label: "Full Name",
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
                        name: "role",
                        label: "Role",
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

export default AddCrewAdminPage;
