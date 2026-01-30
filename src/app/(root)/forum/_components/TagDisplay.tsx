"use client";

import { Box, Chip, Stack, Typography } from "@mui/material";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface Tag {
	id: number;
	name: string;
	color?: string | null;
}

interface TagDisplayProps {
	tags: Tag[];
	size?: "small" | "medium";
	clickable?: boolean;
	wrap?: boolean;
	label?: string;
	categoryId?: number;
	categorySlug?: string;
}

export default function TagDisplay({
	tags,
	size = "small",
	clickable = true,
	wrap = true,
	label,
	categoryId,
	categorySlug,
}: TagDisplayProps) {
	const router = useRouter();

	if (!tags || tags.length === 0) {
		return null;
	}

	const handleTagClick = (tagId: number) => {
		if (!clickable || !categoryId || !categorySlug) return;
		router.push(`/forum/categories/${categoryId}/${categorySlug}?tags=${tagId}`);
	};

	return (
		<Box sx={{ mt: 1, mb: 1 }}>
			{label && (
				<Typography
					variant="body2"
					color="text.secondary"
					sx={{ mb: 0.5 }}
				>
					{label}:
				</Typography>
			)}
			<Stack
				direction="row"
				spacing={0.5}
				sx={{
					flexWrap: wrap ? "wrap" : "nowrap",
					overflow: wrap ? "visible" : "auto",
				}}
			>
				{tags.map((tag) =>
					clickable ? (
						<Chip
							key={tag.id}
							label={tag.name}
							size={size}
							onClick={() => handleTagClick(tag.id)}
							sx={{
								backgroundColor: tag.color || undefined,
								color: tag.color ? "white" : undefined,
								cursor: categoryId && categorySlug ? "pointer" : "default",
								mb: wrap ? 0.5 : 0,
								"&:hover": {
									opacity: categoryId && categorySlug ? 0.9 : 1,
								},
							}}
						/>
					) : (
						<Chip
							key={tag.id}
							label={tag.name}
							size={size}
							sx={{
								backgroundColor: tag.color || undefined,
								color: tag.color ? "white" : undefined,
								mb: wrap ? 0.5 : 0,
							}}
						/>
					),
				)}
			</Stack>
		</Box>
	);
}
