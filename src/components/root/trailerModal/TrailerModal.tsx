"use client";

import React, { useEffect, useState } from "react";
import { Dialog, DialogContent, IconButton, Box } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

interface ITrailerModalProps {
	open: boolean;
	onClose: () => void;
	trailerSrc?: string | null;
}

export default function TrailerModal({
	open,
	onClose,
	trailerSrc,
}: ITrailerModalProps) {
	const [src, setSrc] = useState<string | null>(null);

	useEffect(() => {
		if (open) {
			setSrc(trailerSrc ?? null);
		} else {
			setSrc(null);
		}
	}, [open, trailerSrc]);

	return (
		<Dialog
			open={open}
			onClose={onClose}
			maxWidth="lg"
			fullWidth
			PaperProps={{
				sx: {
					borderRadius: 2,
					overflow: "hidden",
					boxShadow: (theme) =>
						theme.shadows[12] ?? "0 10px 40px rgba(0,0,0,0.6)",
					backgroundColor: "transparent",
				},
			}}
		>
			<IconButton
				aria-label="close trailer"
				onClick={onClose}
				sx={{
					position: "absolute",
					right: 12,
					top: 12,
					zIndex: 1200,
					bgcolor: "rgba(0,0,0,0.6)",
					color: "#fff",
					width: 40,
					height: 40,
					"&:hover": { bgcolor: "rgba(0,0,0,0.75)" },
				}}
			>
				<CloseIcon />
			</IconButton>

			<DialogContent sx={{ p: 0, background: "#000" }}>
				{src ? (
					<Box
						sx={{
							width: "100%",
							height: { xs: "50vh", sm: "60vh", md: "70vh" },
							position: "relative",
							backgroundColor: "#000",
						}}
					>
						<Box
							component="iframe"
							title="Trailer"
							src={src}
							frameBorder="0"
							allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
							allowFullScreen
							sx={{
								position: "absolute",
								inset: 0,
								width: "100%",
								height: "100%",
								border: 0,
							}}
						/>
					</Box>
				) : null}
			</DialogContent>
		</Dialog>
	);
}
