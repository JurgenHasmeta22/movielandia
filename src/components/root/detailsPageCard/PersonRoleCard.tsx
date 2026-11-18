"use client";

import { Box, Typography, useTheme } from "@mui/material";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

interface PersonRoleCardProps {
	data: any;
	type: "actor" | "crew";
}

const PersonRoleCard = ({ data, type }: PersonRoleCardProps) => {
	const theme = useTheme();

	return (
		<motion.div whileHover={{ scale: 1.05 }} transition={{ duration: 0.2 }}>
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
						width: { xs: 76, sm: 88 },
						cursor: "pointer",
					}}
				>
					<Box
						sx={{
							position: "relative",
							width: { xs: 64, sm: 72 },
							height: { xs: 76, sm: 86 },
							borderRadius: 1.5,
							overflow: "hidden",
							border: "1px solid",
							borderColor: theme.vars.palette.divider,
							bgcolor: theme.vars.palette.action.hover,
						}}
					>
						<Image
							src={data.photoSrcProd || "/images/placeholder.jpg"}
							alt={data.fullname}
							fill
							sizes="(max-width: 600px) 64px, 72px"
							style={{ objectFit: "cover" }}
						/>
					</Box>
					<Typography
						variant="caption"
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
						}}
					>
						{data.fullname}
					</Typography>
					{data.debut && (
						<Typography
							variant="caption"
							sx={{
								color: theme.vars.palette.text.secondary,
								fontSize: "0.65rem",
							}}
						>
							{data.debut}
						</Typography>
					)}
				</Box>
			</Link>
		</motion.div>
	);
};

export default PersonRoleCard;
