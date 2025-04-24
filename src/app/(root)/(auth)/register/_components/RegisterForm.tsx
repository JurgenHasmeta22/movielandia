"use client";

import { Visibility, VisibilityOff } from "@mui/icons-material";
import {
	Box,
	Button,
	FormControl,
	IconButton,
	InputAdornment,
	TextField,
	Typography,
	Divider,
	MenuItem,
	Select,
	InputLabel,
	Checkbox,
	FormControlLabel,
	FormHelperText,
	Link,
} from "@mui/material";
import { useState } from "react";
import { showToast } from "@/utils/helpers/toast";
import { signUp } from "@/actions/auth.actions";
import EmailIcon from "@mui/icons-material/Email";
import PasswordIcon from "@mui/icons-material/Password";
import PersonIcon from "@mui/icons-material/Person";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import PhoneIcon from "@mui/icons-material/Phone";
import PublicIcon from "@mui/icons-material/Public";
import WcIcon from "@mui/icons-material/Wc";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import GoogleIcon from "@mui/icons-material/Google";
import { signIn } from "next-auth/react";
import { registerSchema } from "@/schemas/auth.schema";
import Image from "next/image";
import { useRouter } from "next/navigation";
import CakeIcon from "@mui/icons-material/Cake";
import { z } from "zod";

interface RegisterFormValues {
	userName: string;
	email: string;
	password: string;
	confirmPassword: string;
	gender: string;
	birthday: string;
	phone: string;
	countryFrom: string;
	acceptTerms: boolean;
}

const countries = [
	"United States",
	"United Kingdom",
	"Canada",
	"Australia",
	"Germany",
	"France",
	"Spain",
	"Italy",
	"Japan",
	"Brazil",
];

export default function RegisterForm() {
	const [showPassword, setShowPassword] = useState(false);
	const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);

	const {
		control,
		handleSubmit,
		formState: { errors, isSubmitting },
	} = useForm<RegisterFormValues>({
		resolver: zodResolver(registerSchema as z.ZodType<RegisterFormValues>),
		defaultValues: {
			userName: "",
			email: "",
			password: "",
			confirmPassword: "",
			gender: "",
			birthday: "",
			phone: "",
			countryFrom: "",
			acceptTerms: false,
		},
		mode: "onChange",
	});

	const handleClickShowPassword = () => setShowPassword(!showPassword);
	const handleMouseDownPassword = () => setShowPassword(!showPassword);

	const handleClickShowPasswordConfirm = () =>
		setShowPasswordConfirm(!showPasswordConfirm);
	const handleMouseDownPasswordConfirm = () =>
		setShowPasswordConfirm(!showPasswordConfirm);

	async function handleSubmitRegister(values: RegisterFormValues) {
		if (!values.birthday) {
			throw new Error("Birthday is required");
		}

		await signUp({
			userName: values.userName,
			email: values.email,
			gender: values.gender as "Male" | "Female",
			phone: values.phone,
			birthday: new Date(values.birthday),
			password: values.password,
			countryFrom: values.countryFrom,
		});

		showToast(
			"success",
			"Registration successful! Please check your email to activate your account.",
		);
	}

	return (
		<Box sx={{ width: "100%", maxWidth: "400px", margin: "0 auto", px: 2 }}>
			<form onSubmit={handleSubmit(handleSubmitRegister)}>
				<Box
					sx={{
						display: "flex",
						flexDirection: "column",
						rowGap: 2.5,
					}}
				>
					<Box
						sx={{
							mb: 6,
							display: "flex",
							justifyContent: "center",
						}}
					>
						<Image
							src="/icons/movielandia24-logo.png"
							alt="MovieLandia24"
							height={75}
							width={240}
							priority
							style={{
								objectFit: "contain",
							}}
						/>
					</Box>
					<FormControl fullWidth>
						<Controller
							name="userName"
							control={control}
							render={({ field }) => (
								<TextField
									{...field}
									placeholder="Username"
									size="small"
									fullWidth
									error={!!errors.userName}
									helperText={errors.userName?.message}
									slotProps={{
										input: {
											startAdornment: (
												<InputAdornment position="start">
													<PersonIcon />
												</InputAdornment>
											),
										},
									}}
									sx={{
										"& .MuiOutlinedInput-root": {
											borderRadius: "8px",
										},
									}}
								/>
							)}
						/>
					</FormControl>
					<FormControl fullWidth>
						<Controller
							name="email"
							control={control}
							render={({ field }) => (
								<TextField
									{...field}
									placeholder="Email"
									size="small"
									fullWidth
									error={!!errors.email}
									helperText={errors.email?.message}
									slotProps={{
										input: {
											startAdornment: (
												<InputAdornment position="start">
													<EmailIcon />
												</InputAdornment>
											),
										},
									}}
									sx={{
										"& .MuiOutlinedInput-root": {
											borderRadius: "8px",
										},
									}}
								/>
							)}
						/>
					</FormControl>
					<FormControl fullWidth>
						<Controller
							name="birthday"
							control={control}
							render={({ field }) => (
								<TextField
									{...field}
									type="date"
									size="small"
									fullWidth
									label="Birthday"
									error={!!errors.birthday}
									helperText={errors.birthday?.message}
									value={field.value || ""}
									slotProps={{
										input: {
											startAdornment: (
												<InputAdornment position="start">
													<CakeIcon />
												</InputAdornment>
											),
										},
									}}
									sx={{
										"& .MuiOutlinedInput-root": {
											borderRadius: "8px",
										},
									}}
								/>
							)}
						/>
					</FormControl>
					<FormControl size="small" fullWidth>
						<InputLabel id="gender-label">Gender</InputLabel>
						<Controller
							name="gender"
							control={control}
							render={({ field }) => (
								<>
									<Select
										labelId="gender-label"
										label="Gender"
										{...field}
										error={!!errors.gender}
										value={field.value || ""}
										startAdornment={
											<InputAdornment position="start">
												<WcIcon />
											</InputAdornment>
										}
										MenuProps={{
											disableScrollLock: true,
											anchorOrigin: {
												vertical: "bottom",
												horizontal: "right",
											},
											transformOrigin: {
												vertical: "top",
												horizontal: "right",
											},
											PaperProps: {
												sx: { mt: 1 },
											},
										}}
										sx={{
											borderRadius: "8px",
											"& .MuiOutlinedInput-notchedOutline":
												{
													borderColor: errors.gender
														? "error.main"
														: "inherit",
												},
										}}
									>
										<MenuItem value="Male">Male</MenuItem>
										<MenuItem value="Female">
											Female
										</MenuItem>
									</Select>
									{errors.gender && (
										<FormHelperText error>
											{errors.gender.message}
										</FormHelperText>
									)}
								</>
							)}
						/>
					</FormControl>
					<FormControl fullWidth>
						<Controller
							name="phone"
							control={control}
							render={({ field }) => (
								<TextField
									{...field}
									placeholder="Phone Number"
									size="small"
									fullWidth
									error={!!errors.phone}
									helperText={errors.phone?.message}
									slotProps={{
										input: {
											startAdornment: (
												<InputAdornment position="start">
													<PhoneIcon />
												</InputAdornment>
											),
										},
									}}
									sx={{
										"& .MuiOutlinedInput-root": {
											borderRadius: "8px",
										},
									}}
								/>
							)}
						/>
					</FormControl>
					<FormControl size="small" fullWidth>
						<InputLabel id="countryFrom-label">Country</InputLabel>
						<Controller
							name="countryFrom"
							control={control}
							render={({ field }) => (
								<>
									<Select
										labelId="countryFrom-label"
										label="Country"
										{...field}
										error={!!errors.countryFrom}
										startAdornment={
											<InputAdornment position="start">
												<PublicIcon />
											</InputAdornment>
										}
										MenuProps={{
											disableScrollLock: true,
											anchorOrigin: {
												vertical: "bottom",
												horizontal: "left",
											},
											transformOrigin: {
												vertical: "top",
												horizontal: "left",
											},
											PaperProps: {
												sx: {
													mt: 1,
													maxHeight: "300px",
													"&::-webkit-scrollbar": {
														width: "8px",
													},
													"&::-webkit-scrollbar-track":
														{
															background:
																"transparent",
														},
													"&::-webkit-scrollbar-thumb":
														{
															backgroundColor:
																"primary.main",
															borderRadius: "4px",
														},
													"&::-webkit-scrollbar-thumb:hover":
														{
															backgroundColor:
																"primary.dark",
														},
												},
											},
										}}
										sx={{
											borderRadius: "8px",
											"& .MuiOutlinedInput-notchedOutline":
												{
													borderColor:
														errors.countryFrom
															? "error.main"
															: "inherit",
												},
										}}
									>
										{countries.map((country) => (
											<MenuItem
												key={country}
												value={country}
											>
												{country}
											</MenuItem>
										))}
									</Select>
									{errors.countryFrom && (
										<FormHelperText error>
											{errors.countryFrom.message}
										</FormHelperText>
									)}
								</>
							)}
						/>
					</FormControl>
					<FormControl variant="outlined" size="small" fullWidth>
						<Controller
							name="password"
							control={control}
							render={({ field }) => (
								<TextField
									{...field}
									type={showPassword ? "text" : "password"}
									placeholder="Password"
									size="small"
									fullWidth
									error={!!errors.password}
									helperText={errors.password?.message}
									slotProps={{
										input: {
											startAdornment: (
												<InputAdornment position="start">
													<PasswordIcon />
												</InputAdornment>
											),
											endAdornment: (
												<InputAdornment position="end">
													<IconButton
														onClick={
															handleClickShowPassword
														}
														onMouseDown={
															handleMouseDownPassword
														}
													>
														{showPassword ? (
															<Visibility />
														) : (
															<VisibilityOff />
														)}
													</IconButton>
												</InputAdornment>
											),
										},
									}}
									sx={{
										minHeight: "60px",
										"& .MuiFormHelperText-root": {
											position: "absolute",
											bottom: "-18px",
											margin: 0,
											lineHeight: 1.2,
											whiteSpace: "normal",
											overflowWrap: "break-word",
											wordWrap: "break-word",
											maxWidth: "100%",
										},
									}}
								/>
							)}
						/>
					</FormControl>
					<FormControl variant="outlined" size="small" fullWidth>
						<Controller
							name="confirmPassword"
							control={control}
							render={({ field }) => (
								<TextField
									{...field}
									type={
										showPasswordConfirm
											? "text"
											: "password"
									}
									placeholder="Confirm Password"
									size="small"
									fullWidth
									error={!!errors.confirmPassword}
									helperText={errors.confirmPassword?.message}
									slotProps={{
										input: {
											startAdornment: (
												<InputAdornment position="start">
													<PasswordIcon />
												</InputAdornment>
											),
											endAdornment: (
												<InputAdornment position="end">
													<IconButton
														onClick={
															handleClickShowPasswordConfirm
														}
														onMouseDown={
															handleMouseDownPasswordConfirm
														}
													>
														{showPasswordConfirm ? (
															<Visibility />
														) : (
															<VisibilityOff />
														)}
													</IconButton>
												</InputAdornment>
											),
										},
									}}
									sx={{
										minHeight: "40px",
										"& .MuiFormHelperText-root": {
											position: "absolute",
											bottom: "-15px",
											margin: 0,
											lineHeight: 1.2,
											whiteSpace: "normal",
											overflowWrap: "break-word",
											wordWrap: "break-word",
											maxWidth: "100%",
										},
									}}
								/>
							)}
						/>
					</FormControl>
					<FormControl error={!!errors.acceptTerms}>
						<FormControlLabel
							control={
								<Controller
									name="acceptTerms"
									control={control}
									render={({ field }) => (
										<Checkbox
											{...field}
											checked={field.value}
											color="primary"
										/>
									)}
								/>
							}
							label={
								<Typography variant="body2">
									I accept the{" "}
									<Link href="/terms" target="_blank">
										Terms of Service
									</Link>{" "}
									and{" "}
									<Link href="/privacy" target="_blank">
										Privacy Policy
									</Link>
								</Typography>
							}
						/>
						{errors.acceptTerms && (
							<FormHelperText error>
								{errors.acceptTerms.message}
							</FormHelperText>
						)}
					</FormControl>
					<Box
						sx={{
							display: "flex",
							justifyContent: "center",
							marginTop: 2,
							flexDirection: "column",
							rowGap: 1,
						}}
					>
						<Button
							type="submit"
							variant="outlined"
							fullWidth
							disabled={isSubmitting}
							sx={{
								fontWeight: 600,
								py: 1,
								px: 4,
							}}
						>
							<LockOutlinedIcon />
							<Typography
								component={"span"}
								sx={{
									fontSize: 16,
									paddingLeft: 1,
									textTransform: "capitalize",
								}}
							>
								Sign Up
							</Typography>
						</Button>

						<Box
							sx={{
								display: "flex",
								alignItems: "center",
								width: "100%",
								my: 1,
							}}
						>
							<Divider sx={{ flexGrow: 1 }} />
							<Typography
								variant="body2"
								component="span"
								sx={{
									px: 2,
									color: "text.secondary",
									fontWeight: 500,
									fontSize: "0.875rem",
								}}
							>
								OR
							</Typography>
							<Divider sx={{ flexGrow: 1 }} />
						</Box>

						<Button
							onClick={() =>
								signIn("google", { callbackUrl: "/" })
							}
							variant="outlined"
							sx={{ fontWeight: 600, py: 1 }}
						>
							<GoogleIcon />
							<Typography
								component={"span"}
								sx={{
									fontSize: 16,
									paddingLeft: 1,
									textTransform: "capitalize",
								}}
							>
								Continue with Google
							</Typography>
						</Button>

						<Typography
							variant="body2"
							sx={{
								textAlign: "center",
								mt: 1,
								fontSize: 14,
							}}
						>
							Already have an account?{" "}
							<Link
								href="/login"
								sx={{
									textDecoration: "none",
									pl: 1,
									fontSize: 14,
									textTransform: "capitalize",
									"&:hover": {
										textDecoration: "underline",
									},
								}}
							>
								Sign In
							</Link>
						</Typography>
					</Box>
				</Box>
			</form>
		</Box>
	);
}
