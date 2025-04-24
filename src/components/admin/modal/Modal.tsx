"use client";

import React, { useEffect } from "react";
import {
	Button,
	Dialog,
	DialogActions,
	DialogContent,
	DialogContentText,
	DialogTitle,
	IconButton,
	Grid,
	TextField,
	Select,
	MenuItem,
	FormControl,
	InputLabel,
	SxProps,
	Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";

interface IModalProps {
	onClose?: () => void;
	onDataChange?: (values: any) => void;
	onSave?: (values: any) => void;
	open: boolean;
	initialValues?: any;
	fields?: FieldConfig[];
	validationSchema?: z.ZodSchema<any>;
	title: string;
	actions?: ActionConfig[];
	subTitle?: string;
}

type FieldConfig = {
	name: string;
	label: string;
	type?: string;
	options?: Array<{ label: string; value: any }>;
};

type ActionConfig = {
	onClick: () => void;
	label: string;
	type?: string;
	color?:
		| "inherit"
		| "primary"
		| "secondary"
		| "success"
		| "error"
		| "info"
		| "warning"
		| "default";
	variant?: "text" | "outlined" | "contained";
	icon?: React.ReactNode;
	sx?: SxProps;
};

const Modal: React.FC<IModalProps> = ({
	onClose,
	initialValues,
	fields,
	validationSchema,
	onSave,
	title,
	actions,
	onDataChange,
	subTitle,
}) => {
	const router = useRouter();

	const {
		control,
		handleSubmit,
		watch,
		formState: { errors },
	} = useForm({
		defaultValues: initialValues || {},
		resolver: validationSchema ? zodResolver(validationSchema) : undefined,
	});

	const watchedValues = watch();

	useEffect(() => {
		if (onDataChange) {
			onDataChange(watchedValues);
		}
	}, [watchedValues, onDataChange]);

	const onSubmit = (values: any) => {
		if (onSave) {
			onSave(values);
		}
		if (onClose) {
			onClose();
		}
	};

	return (
		<Dialog open={true} onClose={onClose || (() => {})} fullWidth>
			<DialogTitle fontSize={"22px"}>
				{title}
				<IconButton
					style={{ position: "absolute", right: 2, top: 2 }}
					onClick={onClose || (() => {})}
				>
					<CloseIcon color="action" />
				</IconButton>
			</DialogTitle>
			<DialogContent>
				<DialogContentText fontSize={"16px"}>
					{subTitle}
				</DialogContentText>
				{fields ? (
					<form onSubmit={handleSubmit(onSubmit)}>
						<Grid container spacing={4} sx={{ mt: 2 }}>
							{fields.map((field, index: number) => (
								<Grid size={{ xs: 6 }} key={index}>
									{field.type === "select" ? (
										<FormControl fullWidth size="medium">
											<InputLabel
												id={`${field.name}-label`}
											>
												{field.label}
											</InputLabel>
											<Controller
												name={field.name}
												control={control}
												render={({
													field: selectField,
												}) => (
													<Select
														{...selectField}
														labelId={`${field.name}-label`}
													>
														{field.options?.map(
															(option, idx) => (
																<MenuItem
																	key={idx}
																	value={
																		option.value
																	}
																>
																	{
																		option.label
																	}
																</MenuItem>
															),
														)}
													</Select>
												)}
											/>
										</FormControl>
									) : (
										<Controller
											name={field.name}
											control={control}
											render={({ field: textField }) => (
												<TextField
													{...textField}
													label={field.label}
													fullWidth
													size="medium"
													type={field.type || "text"}
													error={!!errors[field.name]}
													// @ts-expect-error helper
													helperText={
														errors[field.name]
															?.message
													}
												/>
											)}
										/>
									)}
								</Grid>
							))}
						</Grid>
						<DialogActions style={{ marginTop: "15px" }}>
							{actions?.map((action, index) => (
								<Button
									key={index}
									onClick={action.onClick}
									// @ts-expect-error color

									color={action.color || "secondary"}
									variant={action.variant || "text"}
									sx={action.sx}
									type={action.type}
									endIcon={action.icon}
								>
									<Typography
										sx={{ textTransform: "capitalize" }}
									>
										{action.label}
									</Typography>
								</Button>
							))}
						</DialogActions>
					</form>
				) : (
					<DialogActions style={{ marginTop: "15px" }}>
						{actions?.map((action, index) => (
							<Button
								key={index}
								onClick={() => {
									action.onClick();
									onClose && onClose();
								}}
								// @ts-expect-error color

								color={action.color || "secondary"}
								variant={action.variant || "text"}
								sx={action.sx}
								type={
									action.type === "submit" ||
									action.type === "reset"
										? action.type
										: ""
								}
								endIcon={action.icon}
							>
								{action.label}
							</Button>
						))}
					</DialogActions>
				)}
			</DialogContent>
		</Dialog>
	);
};

export default Modal;
