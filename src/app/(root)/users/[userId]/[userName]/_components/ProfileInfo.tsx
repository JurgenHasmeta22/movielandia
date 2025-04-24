"use client";

import { useState, useTransition, useRef, useEffect } from "react";
import {
	Box,
	Typography,
	Stack,
	IconButton,
	TextField,
	CircularProgress,
	Collapse,
} from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import InfoIcon from "@mui/icons-material/Info";
import EditIcon from "@mui/icons-material/Edit";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import { useTheme } from "@mui/material/styles";
import { updateUserById } from "@/actions/user/user.actions";
import { showToast } from "@/utils/helpers/toast";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

interface ProfileInfoProps {
	userInPage: {
		id: number;
		userName: string;
		bio: string;
	};
	userLoggedIn: {
		id: number;
	} | null;
}

export default function ProfileInfo({
	userInPage,
	userLoggedIn,
}: ProfileInfoProps) {
	const theme = useTheme();
	const router = useRouter();

	const [isEditingUserName, setIsEditingUserName] = useState(false);
	const [isEditingBio, setIsEditingBio] = useState(false);
	const [userNamePending, startUserNameTransition] = useTransition();
	const [bioPending, startBioTransition] = useTransition();
	const [userName, setUserName] = useState(userInPage.userName);
	const [bio, setBio] = useState(userInPage.bio);
	const [isSaving, setIsSaving] = useState(false);

	const userNameRef = useRef<HTMLInputElement>(null);
	const bioRef = useRef<HTMLTextAreaElement>(null);

	useEffect(() => {
		if (isEditingUserName) {
			userNameRef.current?.focus();
		}
	}, [isEditingUserName]);

	useEffect(() => {
		if (isEditingBio) {
			bioRef.current?.focus();
		}
	}, [isEditingBio]);

	const handleEditUserName = () => {
		setIsEditingUserName(true);
	};

	const handleCancelEditUserName = () => {
		setIsEditingUserName(false);
		setUserName(userInPage.userName);
	};

	const handleEditBio = () => {
		setIsEditingBio(true);
	};

	const handleCancelEditBio = () => {
		setIsEditingBio(false);
		setBio(userInPage.bio);
	};

	const handleSaveUserName = async () => {
		if (!userLoggedIn || isSaving) return;
		setIsSaving(true);

		startUserNameTransition(async () => {
			try {
				await updateUserById(
					{ userName, bio: userInPage.bio },
					Number(userInPage.id),
				);
				router.refresh();
				showToast("success", "Username updated successfully!");
				setIsEditingUserName(false);
			} catch (error: any) {
				console.error(`Error updating user info: ${error.message}`);
				showToast("error", error.message || "Error updating user info");
			} finally {
				setIsSaving(false);
			}
		});
	};

	const handleSaveBio = async () => {
		if (!userLoggedIn || isSaving) return;
		setIsSaving(true);

		startBioTransition(async () => {
			try {
				await updateUserById(
					{ userName: userInPage.userName, bio },
					Number(userInPage.id),
				);
				router.refresh();
				showToast("success", "Bio updated successfully!");
				setIsEditingBio(false);
			} catch (error: any) {
				console.error(`Error updating user info: ${error.message}`);
				showToast("error", error.message || "Error updating user info");
			} finally {
				setIsSaving(false);
			}
		});
	};

	if (!userLoggedIn || userLoggedIn.id !== userInPage.id) {
		return (
			<Stack spacing={1} alignItems="center">
				<Stack direction="row" alignItems="center" spacing={1}>
					<PersonIcon color="action" />
					<Typography variant="h6" fontWeight={500} align="center">
						{userInPage.userName}
					</Typography>
				</Stack>
				<Stack direction="row" alignItems="center" spacing={1}>
					<InfoIcon color="action" />
					<Typography
						variant="body2"
						color="text.secondary"
						align="center"
					>
						{userInPage.bio}
					</Typography>
				</Stack>
			</Stack>
		);
	}

	return (
		<Stack spacing={1} alignItems="center">
			<Stack direction="row" alignItems="center" spacing={1}>
				<PersonIcon color="action" />
				{isEditingUserName ? (
					<motion.div
						initial={{ opacity: 0, x: -20 }}
						animate={{ opacity: 1, x: 0 }}
						exit={{ opacity: 0, x: 20 }}
						transition={{ duration: 0.2 }}
					>
						<TextField
							inputRef={userNameRef}
							value={userName}
							onChange={(e) => setUserName(e.target.value)}
							variant="standard"
							size="small"
							sx={{
								"& .MuiInputBase-input": {
									textAlign: "center",
									fontSize: "1.2rem",
									fontWeight: 500,
								},
							}}
						/>
					</motion.div>
				) : (
					<>
						<Typography color="text.secondary">
							Username:
						</Typography>
						<Typography
							variant="h6"
							fontWeight={500}
							align="center"
						>
							{userInPage.userName}
						</Typography>
					</>
				)}
				{!isEditingUserName && (
					<IconButton
						onClick={handleEditUserName}
						sx={{
							color: theme.palette.grey[500],
							"&:hover": {
								color: theme.palette.primary.main,
								transform: "scale(1.1)",
							},
						}}
					>
						<EditIcon />
					</IconButton>
				)}
				{isEditingUserName && (
					<Stack direction="row" spacing={1}>
						<IconButton
							onClick={handleSaveUserName}
							disabled={userNamePending}
							sx={{
								color: "success.main",
								"&:hover": {
									color: "success.dark",
									transform: "scale(1.1)",
								},
							}}
						>
							{userNamePending ? (
								<CircularProgress size={20} color="inherit" />
							) : (
								<CheckIcon />
							)}
						</IconButton>
						<IconButton
							onClick={handleCancelEditUserName}
							disabled={userNamePending}
							sx={{
								color: "error.main",
								"&:hover": {
									color: "error.dark",
									transform: "scale(1.1)",
								},
							}}
						>
							<CloseIcon />
						</IconButton>
					</Stack>
				)}
			</Stack>
			<Stack direction="row" alignItems="center" spacing={1}>
				<InfoIcon color="action" />
				{isEditingBio ? (
					<motion.div
						initial={{ opacity: 0, x: -20 }}
						animate={{ opacity: 1, x: 0 }}
						exit={{ opacity: 0, x: 20 }}
						transition={{ duration: 0.2 }}
					>
						<TextField
							inputRef={bioRef}
							value={bio}
							onChange={(e) => setBio(e.target.value)}
							variant="standard"
							multiline
							fullWidth
							size="small"
							sx={{
								"& .MuiInputBase-input": {
									textAlign: "center",
								},
							}}
						/>
					</motion.div>
				) : (
					<>
						<Typography color="text.secondary">Bio:</Typography>
						<Typography variant="body2" align="center">
							{userInPage.bio}
						</Typography>
					</>
				)}
				{!isEditingBio && (
					<IconButton
						onClick={handleEditBio}
						sx={{
							color: theme.palette.grey[500],
							"&:hover": {
								color: theme.palette.primary.main,
								transform: "scale(1.1)",
							},
						}}
					>
						<EditIcon />
					</IconButton>
				)}
				{isEditingBio && (
					<Stack direction="row" spacing={1}>
						<IconButton
							onClick={handleSaveBio}
							disabled={bioPending}
							sx={{
								color: "success.main",
								"&:hover": {
									color: "success.dark",
									transform: "scale(1.1)",
								},
							}}
						>
							{bioPending ? (
								<CircularProgress size={20} color="inherit" />
							) : (
								<CheckIcon />
							)}
						</IconButton>
						<IconButton
							onClick={handleCancelEditBio}
							disabled={bioPending}
							sx={{
								color: "error.main",
								"&:hover": {
									color: "error.dark",
									transform: "scale(1.1)",
								},
							}}
						>
							<CloseIcon />
						</IconButton>
					</Stack>
				)}
			</Stack>
		</Stack>
	);
}
