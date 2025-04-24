"use client";

import { Box } from "@mui/material";
import { toast } from "react-toastify";
import { useRef } from "react";
import SaveAsIcon from "@mui/icons-material/SaveAs";
import ClearAllIcon from "@mui/icons-material/ClearAll";
import * as CONSTANTS from "@/constants/Constants";
import { useRouter } from "next/navigation";
import HeaderDashboard from "@/components/admin/headerDashboard/HeaderDashboard";
import FormAdvanced from "@/components/admin/form/Form";
import { signUp } from "@/actions/auth.actions";
import { User } from "@prisma/client";
import Link from "next/link";
import Breadcrumb from "@/components/admin/breadcrumb/Breadcrumb";
import { addUserSchema } from "@/schemas/user.schema";

const AddUserAdminPage = () => {
	const router = useRouter();
	const formRef = useRef<any>(null);

	const breadcrumbs = [
		<Link key="1" href="/admin/users" style={{ textDecoration: "none" }}>
			Users
		</Link>,
		<Link
			key="2"
			href={`/admin/users/create`}
			style={{ textDecoration: "none" }}
		>
			New User
		</Link>,
	];

	const handleResetFromParent = () => {
		formRef.current?.reset();
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
		<Box m="20px">
			<Breadcrumb
				breadcrumbs={breadcrumbs}
				navigateTo={"/admin/genres"}
			/>
			<HeaderDashboard
				title={CONSTANTS.USER__ADD__TITLE}
				subtitle={CONSTANTS.USER__ADD__SUBTITLE}
			/>
			<FormAdvanced
				defaultValues={{
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
						icon: (
							<ClearAllIcon color="action" sx={{ ml: "10px" }} />
						),
					},
				]}
				onSubmit={handleFormSubmit}
				schema={addUserSchema}
				formRef={formRef}
			/>
		</Box>
	);
};

export default AddUserAdminPage;
