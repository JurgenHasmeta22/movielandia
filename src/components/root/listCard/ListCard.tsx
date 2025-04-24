import {
	Box,
	Typography,
	Stack,
	Tooltip,
	Card,
	Chip,
	Avatar,
} from "@mui/material";
import Link from "next/link";
import Image from "next/image";
import LockIcon from "@mui/icons-material/Lock";
import ArchiveIcon from "@mui/icons-material/Archive";
import ShareIcon from "@mui/icons-material/Share";
import PeopleIcon from "@mui/icons-material/People";
import EditIcon from "@mui/icons-material/Edit";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { formatDate } from "@/utils/helpers/utils";
import { formatForUrl } from "@/utils/helpers/formatUrl";

interface ListCardProps {
	list: any;
	username: string;
	userId: number;
	isSharedView?: boolean;
}

const getTotalItems = (counts: Record<string, number>) => {
	return Object.values(counts).reduce((acc, curr) => acc + curr, 0);
};

export default function ListCard({
	list,
	username,
	userId,
	isSharedView = false,
}: ListCardProps) {
	const getListPath = () => {
		const formattedUsername = encodeURIComponent(username);
		const formattedListName = list.name ? formatForUrl(list.name) : "";

		return `/users/${userId}/${formattedUsername}/lists/${list.id}/${formattedListName}`;
	};

	const getFormattedDate = () => {
		try {
			return list?.createdAt
				? formatDate(new Date(list.createdAt))
				: "No date";
		} catch (error) {
			return "Invalid date";
		}
	};

	return (
		<Link href={getListPath()} style={{ textDecoration: "none" }}>
			<Card
				elevation={1}
				sx={{
					width: { xs: "100%", sm: 280 },
					height: 180,
					display: "flex",
					flexDirection: "column",
				}}
			>
				<Box sx={{ p: 2, display: "flex", gap: 2 }}>
					<Box
						sx={{
							display: "flex",
							flexDirection: "column",
							width: "100%",
						}}
					>
						<Stack
							direction="row"
							alignItems="center"
							justifyContent="space-between"
							mb={1}
						>
							<Typography
								variant="h6"
								sx={{
									fontSize: "1.1rem",
									fontWeight: 600,
									color: "text.primary",
									overflow: "hidden",
									textOverflow: "ellipsis",
									whiteSpace: "nowrap",
								}}
							>
								{list.name}
							</Typography>
							<Stack direction="row" spacing={1}>
								{list?.isPrivate && (
									<Tooltip title="Private list">
										<LockIcon
											fontSize="small"
											color="action"
										/>
									</Tooltip>
								)}
								{list?.isArchived && (
									<Tooltip title="Archived list">
										<ArchiveIcon
											fontSize="small"
											color="action"
										/>
									</Tooltip>
								)}
								{!isSharedView &&
									list?.sharedWith?.length > 0 && (
										<Tooltip
											title={`Shared with ${list.sharedWith.length} user${list.sharedWith.length > 1 ? "s" : ""}`}
										>
											<ShareIcon
												fontSize="small"
												color="primary"
											/>
										</Tooltip>
									)}
								{isSharedView && (
									<Tooltip
										title={
											list.sharedWith?.find(
												(share: any) =>
													share.userId === userId,
											)?.canEdit
												? "You can edit this list"
												: "View only"
										}
									>
										{list.sharedWith?.find(
											(share: any) =>
												share.userId === userId,
										)?.canEdit ? (
											<EditIcon
												fontSize="small"
												color="primary"
											/>
										) : (
											<VisibilityIcon
												fontSize="small"
												color="action"
											/>
										)}
									</Tooltip>
								)}
							</Stack>
						</Stack>

						<Typography
							variant="body2"
							sx={{
								color: "text.secondary",
								overflow: "hidden",
								textOverflow: "ellipsis",
								display: "-webkit-box",
								WebkitLineClamp: 2,
								WebkitBoxOrient: "vertical",
								mb: "auto",
								flexGrow: 1,
							}}
						>
							{list?.description || "No description"}
						</Typography>

						<Stack
							direction="row"
							justifyContent="space-between"
							alignItems="center"
							sx={{
								mt: 2,
								pt: 1,
								borderTop: "1px solid",
								borderColor: "divider",
							}}
						>
							<Typography
								variant="caption"
								color="text.secondary"
							>
								{list?._count ? getTotalItems(list._count) : 0}{" "}
								items
							</Typography>
							{isSharedView && list.user && (
								<Tooltip title={`Owner: ${list.user.userName}`}>
									<Chip
										avatar={
											<Avatar
												src={list.user.avatar?.photoSrc}
												alt={list.user.userName}
											/>
										}
										label={list.user.userName}
										size="small"
										variant="outlined"
										sx={{
											height: 20,
											"& .MuiChip-label": {
												fontSize: "0.65rem",
												px: 1,
											},
										}}
									/>
								</Tooltip>
							)}
							{!isSharedView && (
								<Typography
									variant="caption"
									color="text.secondary"
								>
									{getFormattedDate()}
								</Typography>
							)}
						</Stack>
					</Box>
				</Box>
			</Card>
		</Link>
	);
}
