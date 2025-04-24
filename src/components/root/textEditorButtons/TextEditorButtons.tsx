"use client";

import {
	WarningOutlined,
	CheckOutlined,
	SendOutlined,
	SaveOutlined,
	CancelOutlined,
} from "@mui/icons-material";
import {
	Box,
	Button,
	Typography,
	useTheme,
	CircularProgress,
} from "@mui/material";
import * as CONSTANTS from "@/constants/Constants";
import { useModal } from "@/providers/ModalProvider";
import type {} from "@mui/material/themeCssVarsAugmentation";
import { useTransition } from "react";

interface ITextEditorButtonsProps {
	isEditMode: boolean;
	setOpen: React.Dispatch<React.SetStateAction<boolean>>;
	setIsEditMode: React.Dispatch<React.SetStateAction<boolean>>;
	setReview: React.Dispatch<React.SetStateAction<string>>;
	setIsSubmitting: React.Dispatch<React.SetStateAction<boolean>>;
	onSubmitReview(): Promise<void>;
	handleFocusReview: () => void;
	onSubmitUpdateReview(): Promise<void>;
}

export function TextEditorButtons({
	isEditMode,
	onSubmitReview,
	setOpen,
	setIsEditMode,
	setReview,
	handleFocusReview,
	onSubmitUpdateReview,
	setIsSubmitting,
}: ITextEditorButtonsProps) {
	const { openModal } = useModal();
	const theme = useTheme();

	const [isPending, startTransition] = useTransition();

	const handleSubmit = () => {
		if (isPending) return;

		setIsSubmitting(true);

		startTransition(async () => {
			try {
				await onSubmitReview();
			} finally {
				setIsSubmitting(false);
			}
		});
	};

	const handleUpdate = () => {
		if (isPending) return;

		setIsSubmitting(true);

		startTransition(async () => {
			try {
				await onSubmitUpdateReview();
			} finally {
				setIsSubmitting(false);
			}
		});
	};

	return (
		<>
			{!isEditMode ? (
				<Box display={"flex"} justifyContent={"end"} marginTop={2}>
					<Button
						onClick={handleSubmit}
						variant="contained"
						disabled={isPending}
						startIcon={
							isPending ? (
								<CircularProgress size={20} color="inherit" />
							) : (
								<SendOutlined />
							)
						}
						sx={{
							display: "flex",
							placeSelf: "end",
							fontSize: 18,
							fontWeight: 900,
							padding: 1.5,
							textTransform: "capitalize",
							border: "none",
							backgroundColor: theme.vars.palette.green.light,
							color: theme.vars.palette.primary.dark,
							"&:hover": {
								backgroundColor: theme.vars.palette.green.main,
								color: theme.vars.palette.greyAccent.main,
							},
							"&:disabled": {
								backgroundColor: theme.vars.palette.green.light,
								opacity: 0.7,
							},
							minWidth: 150,
						}}
					>
						<Typography
							component={"span"}
							sx={{
								color: theme.vars.palette.primary.dark,
							}}
						>
							{isPending ? "Submitting..." : "Submit Review"}
						</Typography>
					</Button>
				</Box>
			) : (
				<Box
					display={"flex"}
					flexDirection={"row"}
					columnGap={1}
					justifyContent={"end"}
					alignItems={"center"}
					marginTop={2}
				>
					<Button
						onClick={() => {
							openModal({
								onClose: () => setOpen(false),
								title: "Discard Changes",
								actions: [
									{
										label: CONSTANTS.MODAL__DELETE__NO,
										onClick: () => setOpen(false),
										color: "error",
										variant: "contained",
										sx: {
											bgcolor: "#ff5252",
										},
										icon: <WarningOutlined />,
									},
									{
										label: CONSTANTS.MODAL__DELETE__YES,
										onClick: async () => {
											setIsEditMode(false);
											setReview("");
											handleFocusReview();
										},
										type: "submit",
										color: "success",
										variant: "contained",
										sx: {
											bgcolor: "#30969f",
										},
										icon: <CheckOutlined />,
									},
								],
								subTitle:
									"Are you sure that you want to discard changes on this review ?",
							});
						}}
						color="error"
						variant="contained"
						disabled={isPending}
						startIcon={<CancelOutlined />}
						sx={{
							display: "flex",
							placeSelf: "end",
							fontSize: 18,
							fontWeight: 900,
							padding: 1.5,
							textTransform: "capitalize",
							"&:disabled": {
								opacity: 0.7,
							},
						}}
					>
						<Typography component={"span"}>
							Discard Changes
						</Typography>
					</Button>
					<Button
						onClick={handleUpdate}
						color="success"
						variant="contained"
						disabled={isPending}
						startIcon={
							isPending ? (
								<CircularProgress size={20} color="inherit" />
							) : (
								<SaveOutlined />
							)
						}
						sx={{
							display: "flex",
							placeSelf: "end",
							fontSize: 18,
							fontWeight: 900,
							padding: 1.5,
							textTransform: "capitalize",
							"&:disabled": {
								opacity: 0.7,
							},
							minWidth: 150,
						}}
					>
						<Typography component={"span"}>
							{isPending ? "Saving..." : "Save Changes"}
						</Typography>
					</Button>
				</Box>
			)}
		</>
	);
}

export default TextEditorButtons;
