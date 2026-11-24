"use client";

import { Box, Typography, useTheme } from "@mui/material";
import Image from "next/image";
import Link from "next/link";
import type {} from "@mui/material/themeCssVarsAugmentation";

interface PersonRoleCardProps {
	data: any;
	type: "actor" | "crew";
}

const PersonRoleCard = ({ data, type }: PersonRoleCardProps) => {
	const theme = useTheme();

	return (
		<Link
			href={`/${type === "actor" ? "actors" : "crew"}/${data.id}/${encodeURIComponent(
				data.fullname.split(" ").join("-"),
			)}`}
			style={{ textDecoration: "none" }}
		>
			<Box
				sx={{
					display: "flex",
					flexDirection: "column",
					alignItems: "center",
					gap: 0.75,
					width: { xs: 84, sm: 96 },
					cursor: "pointer",
					"&:hover .personAvatar": {
						borderColor: theme.vars.palette.accent.main,
						transform: "translateY(-3px)",
						boxShadow: "0 12px 24px rgba(5, 2, 12, 0.45)",
					},
					"&:hover .personName": {
						color: theme.vars.palette.accent.main,
					},
				}}
			>
				<Box
					className="personAvatar"
					sx={{
						position: "relative",
						width: { xs: 68, sm: 80 },
						height: { xs: 68, sm: 80 },
						borderRadius: "50%",
						overflow: "hidden",
						border: "2px solid",
						borderColor: theme.vars.palette.divider,
						bgcolor: theme.vars.palette.action.hover,
						transition:
							"border-color 200ms ease, transform 200ms ease, box-shadow 200ms ease",
					}}
				>
					<Image
						src={data.photoSrcProd || "/images/placeholder.jpg"}
						alt={data.fullname}
						fill
						sizes="(max-width: 600px) 68px, 80px"
						style={{ objectFit: "cover" }}
					/>
				</Box>
				<Typography
					variant="caption"
					className="personName"
					sx={{
						width: "100%",
						color: theme.vars.palette.text.primary,
						fontWeight: 600,
						textAlign: "center",
						display: "-webkit-box",
						WebkitLineClamp: 2,
						WebkitBoxOrient: "vertical",
						overflow: "hidden",
						lineHeight: 1.25,
						transition: "color 200ms ease",
					}}
				>
					{data.fullname}
				</Typography>
				{data.debut && (
					<Typography
						variant="caption"
						sx={{
							color: theme.vars.palette.text.secondary,
							fontSize: "0.7rem",
						}}
					>
						{data.debut}
					</Typography>
				)}
			</Box>
		</Link>
	);
};

export default PersonRoleCard;
