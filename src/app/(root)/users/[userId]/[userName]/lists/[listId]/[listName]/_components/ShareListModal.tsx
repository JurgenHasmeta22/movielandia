"use client";

import { useState, useEffect, useTransition } from "react";
import {
	Dialog,
	DialogTitle,
	DialogContent,
	DialogActions,
	Button,
	TextField,
	Box,
	Typography,
	List,
	ListItem,
	ListItemAvatar,
	ListItemText,
	Avatar,
	IconButton,
	FormControl,
	InputLabel,
	Select,
	MenuItem,
	Chip,
	Paper,
	Divider,
	CircularProgress,
	InputAdornment,
	useTheme,
	alpha,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import SearchIcon from "@mui/icons-material/Search";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import ShareIcon from "@mui/icons-material/Share";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import SwapHorizIcon from "@mui/icons-material/SwapHoriz";
import { useDebounce } from "@/hooks/useDebounce";
import { searchUsers } from "@/actions/user/userMessages.actions";
import {
	shareList,
	unshareList,
	updateSharePermission,
} from "@/actions/list/listShare.actions";
import { showToast } from "@/utils/helpers/toast";
import { useRouter } from "next/navigation";

interface User {
	id: number;
	userName: string;
	email: string;
	avatar?: {
		photoSrc: string;
	};
}

interface SharedUser {
	id: number;
	userName: string;
	email?: string;
	avatar?: {
		photoSrc: string;
	} | null;
	canEdit: boolean;
	sharedAt: Date;
}

interface ShareListModalProps {
	open: boolean;
	onClose: () => void;
	listId: number;
	userId: number;
	sharedUsers: SharedUser[];
}

export default function ShareListModal({
	open,
	onClose,
	listId,
	userId,
	sharedUsers,
}: ShareListModalProps) {
	const router = useRouter();
	const theme = useTheme();
	const [isPending, startTransition] = useTransition();
	const [searchQuery, setSearchQuery] = useState("");
	const [searchResults, setSearchResults] = useState<User[]>([]);
	const [selectedUser, setSelectedUser] = useState<User | null>(null);
	const [permissionLevel, setPermissionLevel] = useState<boolean>(false);
	const [isSearching, setIsSearching] = useState(false);
	const [currentSharedUsers, setCurrentSharedUsers] = useState<SharedUser[]>(
		sharedUsers || [],
	);

	const debouncedSearchQuery = useDebounce(searchQuery, 300);

	useEffect(() => {
		if (debouncedSearchQuery.length > 2) {
			setIsSearching(true);
			searchUsers(debouncedSearchQuery, userId)
				.then((results) => {
					const filteredResults = results.filter(
						(user: {
							id: number;
							avatar: {
								id: number;
								photoSrc: string;
								userId: number;
							} | null;
							userName: string;
							email: string;
						}) =>
							!currentSharedUsers.some(
								(sharedUser) => sharedUser.id === user.id,
							),
					);

					setSearchResults(
						filteredResults.map((user) => ({
							id: user.id,
							userName: user.userName,
							email: user.email,
							avatar: user.avatar
								? { photoSrc: user.avatar.photoSrc }
								: undefined,
						})),
					);
				})
				.catch((error) => {
					console.error("Error searching users:", error);
					setSearchResults([]);
				})
				.finally(() => {
					setIsSearching(false);
				});
		} else {
			setSearchResults([]);
		}
	}, [debouncedSearchQuery, userId, currentSharedUsers]);

	const handleSelectUser = (user: User) => {
		setSelectedUser(user);
		setSearchQuery("");
		setSearchResults([]);
	};

	const handleClearSelection = () => {
		setSelectedUser(null);
		setPermissionLevel(false);
	};

	const handleShareList = () => {
		if (!selectedUser) return;

		startTransition(async () => {
			try {
				await shareList(
					listId,
					userId,
					selectedUser.id,
					permissionLevel,
				);

				// Add the newly shared user to the current shared users list
				setCurrentSharedUsers([
					...currentSharedUsers,
					{
						...selectedUser,
						canEdit: permissionLevel,
						sharedAt: new Date(),
					},
				]);

				showToast(
					"success",
					`List shared with ${selectedUser.userName} successfully!`,
				);
				handleClearSelection();
				router.refresh();
			} catch (error) {
				showToast(
					"error",
					error instanceof Error
						? error.message
						: "Failed to share list",
				);
			}
		});
	};

	const handleUnshareList = (targetUserId: number, userName: string) => {
		startTransition(async () => {
			try {
				await unshareList(listId, userId, targetUserId);

				// Remove the unshared user from the current shared users list
				setCurrentSharedUsers(
					currentSharedUsers.filter(
						(user) => user.id !== targetUserId,
					),
				);

				showToast(
					"success",
					`List unshared with ${userName} successfully!`,
				);
				router.refresh();
			} catch (error) {
				showToast(
					"error",
					error instanceof Error
						? error.message
						: "Failed to unshare list",
				);
			}
		});
	};

	const handleUpdatePermission = (
		targetUserId: number,
		canEdit: boolean,
		userName: string,
	) => {
		startTransition(async () => {
			try {
				await updateSharePermission(
					listId,
					userId,
					targetUserId,
					canEdit,
				);

				// Update the permission level for the user in the current shared users list
				setCurrentSharedUsers(
					currentSharedUsers.map((user) =>
						user.id === targetUserId ? { ...user, canEdit } : user,
					),
				);

				showToast(
					"success",
					`Permission updated for ${userName} successfully!`,
				);
				router.refresh();
			} catch (error) {
				showToast(
					"error",
					error instanceof Error
						? error.message
						: "Failed to update permission",
				);
			}
		});
	};

	return (
		<Dialog
			open={open}
			onClose={onClose}
			fullWidth
			maxWidth="sm"
			PaperProps={{
				sx: {
					borderRadius: 1,
					bgcolor: "#1e2330", // Dark background matching the EditListModal
					boxShadow: 3,
					overflow: "hidden",
					"& .MuiDialogContent-root": {
						p: 3,
					},
				},
			}}
		>
			<DialogTitle
				sx={{
					fontSize: "1.1rem",
					fontWeight: 500,
					bgcolor: "#2c3347", // Darker header background
					color: "#fff",
					py: 2,
					px: 3,
					borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
				}}
			>
				<Box sx={{ display: "flex", alignItems: "center" }}>
					<ShareIcon
						sx={{ mr: 1.5, color: "#fff", fontSize: "1.2rem" }}
					/>
					<Typography
						variant="h6"
						component="span"
						fontWeight={500}
						fontSize="1.1rem"
					>
						Share List
					</Typography>
				</Box>
				<IconButton
					aria-label="close"
					onClick={onClose}
					sx={{
						position: "absolute",
						right: 8,
						top: 8,
						color: "rgba(255, 255, 255, 0.7)",
						"&:hover": {
							color: "#fff",
						},
					}}
				>
					<CloseIcon />
				</IconButton>
			</DialogTitle>
			<DialogContent sx={{ bgcolor: "#1e2330", p: "24px !important" }}>
				<Box sx={{ mb: 3 }}>
					<Typography
						variant="subtitle2"
						component="label"
						sx={{
							display: "block",
							mb: 1,
							color: "rgba(255, 255, 255, 0.7)",
							fontWeight: 400,
							fontSize: "0.9rem",
						}}
					>
						Share with a user
					</Typography>
					{selectedUser ? (
						<Box
							sx={{
								display: "flex",
								flexDirection: "column",
								gap: 2,
							}}
						>
							<Box
								sx={{
									display: "flex",
									alignItems: "center",
									gap: 1,
								}}
							>
								<Chip
									avatar={
										<Avatar
											src={selectedUser.avatar?.photoSrc}
											alt={selectedUser.userName}
										/>
									}
									label={selectedUser.userName}
									onDelete={handleClearSelection}
									variant="outlined"
									sx={{
										bgcolor: alpha("#fff", 0.05),
										borderColor: "rgba(255, 255, 255, 0.3)",
										color: "#fff",
										"& .MuiChip-deleteIcon": {
											color: "rgba(255, 255, 255, 0.7)",
											"&:hover": {
												color: "#fff",
											},
										},
									}}
								/>
							</Box>
							<Box>
								<Typography
									variant="subtitle2"
									component="label"
									sx={{
										display: "block",
										mb: 1,
										color: "rgba(255, 255, 255, 0.7)",
										fontWeight: 400,
										fontSize: "0.9rem",
									}}
								>
									Permission Level
								</Typography>
								<FormControl fullWidth size="small">
									<Select
										value={
											permissionLevel ? "edit" : "view"
										}
										onChange={(e) =>
											setPermissionLevel(
												e.target.value === "edit",
											)
										}
										displayEmpty
										sx={{
											borderRadius: 1,
											bgcolor: "#2c3347",
											color: "#fff",
											"& .MuiOutlinedInput-notchedOutline":
												{
													borderColor:
														"rgba(255, 255, 255, 0.2)",
												},
											"&:hover .MuiOutlinedInput-notchedOutline":
												{
													borderColor:
														"rgba(255, 255, 255, 0.3)",
												},
											"&.Mui-focused .MuiOutlinedInput-notchedOutline":
												{
													borderColor:
														"rgba(255, 255, 255, 0.5)",
												},
											"& .MuiSelect-select": {
												display: "flex",
												alignItems: "center",
											},
										}}
									>
										<MenuItem value="view">
											<Box
												sx={{
													display: "flex",
													alignItems: "center",
												}}
											>
												<VisibilityIcon
													sx={{
														mr: 1,
														fontSize: "1rem",
													}}
												/>
												View only
											</Box>
										</MenuItem>
										<MenuItem value="edit">
											<Box
												sx={{
													display: "flex",
													alignItems: "center",
												}}
											>
												<EditIcon
													sx={{
														mr: 1,
														fontSize: "1rem",
													}}
												/>
												Can edit
											</Box>
										</MenuItem>
									</Select>
								</FormControl>
							</Box>
							<Button
								variant="contained"
								onClick={handleShareList}
								disabled={isPending}
								startIcon={<PersonAddIcon />}
								sx={{
									mt: 1,
									alignSelf: "flex-start",
									textTransform: "none",
									borderRadius: 1,
									fontWeight: 500,
									px: 2,
									bgcolor: theme.palette.primary.main,
									color: "#fff",
									"&:hover": {
										bgcolor: alpha(
											theme.palette.primary.main,
											0.8,
										),
									},
								}}
							>
								{isPending ? (
									<CircularProgress size={24} />
								) : (
									"Share with User"
								)}
							</Button>
						</Box>
					) : (
						<TextField
							fullWidth
							placeholder="Search for a user..."
							value={searchQuery}
							onChange={(e) => setSearchQuery(e.target.value)}
							variant="outlined"
							size="small"
							InputProps={{
								startAdornment: (
									<InputAdornment position="start">
										<SearchIcon
											sx={{
												color: "rgba(255, 255, 255, 0.7)",
											}}
										/>
									</InputAdornment>
								),
								endAdornment: isSearching ? (
									<InputAdornment position="end">
										<CircularProgress
											size={20}
											sx={{
												color: "rgba(255, 255, 255, 0.7)",
											}}
										/>
									</InputAdornment>
								) : null,
							}}
							sx={{
								mb: 1,
								"& .MuiOutlinedInput-root": {
									borderRadius: 1,
									bgcolor: "#2c3347",
									color: "#fff",
									"& fieldset": {
										borderColor: "rgba(255, 255, 255, 0.2)",
									},
									"&:hover fieldset": {
										borderColor: "rgba(255, 255, 255, 0.3)",
									},
									"&.Mui-focused fieldset": {
										borderColor: "rgba(255, 255, 255, 0.5)",
									},
								},
							}}
						/>
					)}
					{!selectedUser && searchResults.length > 0 && (
						<Paper
							elevation={3}
							sx={{
								mt: 1,
								maxHeight: 200,
								overflow: "auto",
								bgcolor: "#2c3347",
								borderRadius: 1,
								border: "1px solid rgba(255, 255, 255, 0.1)",
							}}
						>
							<List dense>
								{searchResults.map((user) => (
									<ListItem
										key={user.id}
										onClick={() => handleSelectUser(user)}
										sx={{
											"&:hover": {
												bgcolor: alpha("#fff", 0.05),
											},
											cursor: "pointer",
											borderBottom:
												"1px solid rgba(255, 255, 255, 0.05)",
										}}
									>
										<ListItemAvatar>
											<Avatar
												src={user.avatar?.photoSrc}
												alt={user.userName}
											/>
										</ListItemAvatar>
										<ListItemText
											primary={
												<Typography
													variant="body1"
													sx={{
														color: "#fff",
														fontWeight: 500,
													}}
												>
													{user.userName}
												</Typography>
											}
											secondary={
												<Typography
													variant="body2"
													sx={{
														color: "rgba(255, 255, 255, 0.7)",
													}}
												>
													{user.email}
												</Typography>
											}
										/>
									</ListItem>
								))}
							</List>
						</Paper>
					)}
				</Box>

				<Divider
					sx={{ my: 2, borderColor: "rgba(255, 255, 255, 0.1)" }}
				/>

				<Typography
					variant="subtitle2"
					component="label"
					sx={{
						display: "block",
						mb: 1,
						color: "rgba(255, 255, 255, 0.7)",
						fontWeight: 400,
						fontSize: "0.9rem",
					}}
				>
					Currently shared with
				</Typography>
				{currentSharedUsers.length > 0 ? (
					<List
						sx={{
							bgcolor: "#2c3347",
							borderRadius: 1,
							border: "1px solid rgba(255, 255, 255, 0.1)",
							overflow: "hidden",
						}}
					>
						{currentSharedUsers.map((user) => (
							<ListItem
								key={user.id}
								secondaryAction={
									<Box>
										<IconButton
											edge="end"
											aria-label="toggle-permission"
											onClick={() =>
												handleUpdatePermission(
													user.id,
													!user.canEdit,
													user.userName,
												)
											}
											sx={{
												mr: 1,
												color: user.canEdit
													? "rgba(255, 255, 255, 0.7)"
													: "rgba(255, 255, 255, 0.5)",
												"&:hover": {
													color: "#fff",
													bgcolor: alpha(
														"#fff",
														0.05,
													),
												},
											}}
											title={`Change to ${user.canEdit ? "view only" : "can edit"}`}
										>
											{user.canEdit ? (
												<EditIcon />
											) : (
												<VisibilityIcon />
											)}
										</IconButton>
										<IconButton
											edge="end"
											aria-label="delete"
											onClick={() =>
												handleUnshareList(
													user.id,
													user.userName,
												)
											}
											sx={{
												color: "rgba(255, 255, 255, 0.5)",
												"&:hover": {
													color: theme.palette.error
														.main,
													bgcolor: alpha(
														theme.palette.error
															.main,
														0.1,
													),
												},
											}}
										>
											<DeleteIcon />
										</IconButton>
									</Box>
								}
								sx={{
									pr: 10,
									borderBottom:
										"1px solid rgba(255, 255, 255, 0.05)",
									"&:last-child": {
										borderBottom: "none",
									},
								}}
							>
								<ListItemAvatar>
									<Avatar
										src={user.avatar?.photoSrc}
										alt={user.userName}
									/>
								</ListItemAvatar>
								<ListItemText
									primary={
										<Box
											sx={{
												display: "flex",
												alignItems: "center",
												gap: 1,
											}}
										>
											<Typography
												variant="body1"
												sx={{ color: "#fff" }}
											>
												{user.userName}
											</Typography>
											<Chip
												label={
													user.canEdit
														? "Can edit"
														: "View only"
												}
												size="small"
												color={
													user.canEdit
														? "primary"
														: "default"
												}
												variant="outlined"
												sx={{
													bgcolor: user.canEdit
														? alpha(
																theme.palette
																	.primary
																	.main,
																0.1,
															)
														: "transparent",
													borderColor: user.canEdit
														? theme.palette.primary
																.main
														: "rgba(255, 255, 255, 0.3)",
													color: user.canEdit
														? theme.palette.primary
																.main
														: "rgba(255, 255, 255, 0.7)",
												}}
											/>
										</Box>
									}
									secondary={
										<Typography
											variant="body2"
											sx={{
												color: "rgba(255, 255, 255, 0.5)",
											}}
										>
											Shared{" "}
											{new Date(
												user.sharedAt,
											).toLocaleDateString()}
										</Typography>
									}
								/>
							</ListItem>
						))}
					</List>
				) : (
					<Typography
						variant="body2"
						sx={{
							color: "rgba(255, 255, 255, 0.5)",
							fontStyle: "italic",
							p: 2,
						}}
					>
						This list is not shared with anyone yet.
					</Typography>
				)}
			</DialogContent>
			<DialogActions
				sx={{
					px: 3,
					py: 2,
					bgcolor: "#2c3347",
					borderTop: "1px solid rgba(255, 255, 255, 0.1)",
				}}
			>
				<Button
					onClick={onClose}
					variant="outlined"
					sx={{
						textTransform: "none",
						borderRadius: 1,
						fontWeight: 500,
						px: 2,
						borderColor: "rgba(255, 255, 255, 0.3)",
						color: "#fff",
						"&:hover": {
							borderColor: "rgba(255, 255, 255, 0.5)",
							bgcolor: alpha("#fff", 0.05),
						},
					}}
				>
					Close
				</Button>
			</DialogActions>
		</Dialog>
	);
}
