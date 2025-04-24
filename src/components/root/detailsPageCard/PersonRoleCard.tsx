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
						position: "relative",
						width: { xs: "60px", sm: "70px" },
						height: { xs: "60px", sm: "70px" },
						borderRadius: "50%",
						overflow: "hidden",
						cursor: "pointer",
						boxShadow: theme.shadows[4],
						"&:hover": {
							boxShadow: theme.shadows[8],
							"& .overlay": {
								opacity: 1,
							},
						},
					}}
				>
					<Image
						src={data.photoSrcProd || "/images/placeholder.jpg"}
						alt={data.fullname}
						fill
						sizes="(max-width: 600px) 60px, 70px"
						style={{
							objectFit: "cover",
						}}
					/>
					<Box
						className="overlay"
						sx={{
							position: "absolute",
							inset: 0,
							bgcolor: "rgba(0, 0, 0, 0.7)",
							display: "flex",
							alignItems: "center",
							justifyContent: "center",
							padding: 1,
							opacity: 0,
							transition: "opacity 0.3s ease-in-out",
						}}
					>
						<Typography
							variant="caption"
							sx={{
								color: "white",
								textAlign: "center",
								fontSize: { xs: "0.6rem", sm: "0.7rem" },
								fontWeight: 500,
								display: "-webkit-box",
								WebkitLineClamp: 2,
								WebkitBoxOrient: "vertical",
								overflow: "hidden",
							}}
						>
							{data.fullname}
							{data.debut && ` (${data.debut})`}
						</Typography>
					</Box>
				</Box>
			</Link>
		</motion.div>
	);
};

export default PersonRoleCard;
