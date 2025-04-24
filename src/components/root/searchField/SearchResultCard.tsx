"use client";

import React from "react";
import { Box, Typography, useTheme } from "@mui/material";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";

type ResultType =
	| "movie"
	| "serie"
	| "season"
	| "episode"
	| "actor"
	| "crew"
	| "user";
type PathType = "movies" | "actors" | "crew" | null;

interface BaseResultData {
	id: number;
	photoSrcProd?: string;
	description?: string;
	dateAired?: Date | null;
}

interface MediaResultData extends BaseResultData {
	title: string;
}

interface PersonResultData extends BaseResultData {
	fullname: string;
	debut: string;
}

interface UserResultData extends BaseResultData {
	userName: string;
	bio?: string | null;
}

type ResultData = MediaResultData | PersonResultData | UserResultData;

interface SearchResultCardProps {
	data: ResultData;
	type: ResultType;
	path?: PathType;
	onResultClick: () => void;
}

const SearchResultCard = ({
	data,
	type,
	path,
	onResultClick,
}: SearchResultCardProps) => {
	const theme = useTheme();
	const params = useParams();

	const getPath = (): string => {
		const formatTitle = (title: string) =>
			encodeURIComponent(title.split(" ").join("-"));

		switch (type) {
			case "serie":
				return `/series/${data.id}/${formatTitle((data as MediaResultData).title)}`;
			case "movie":
				return `/movies/${data.id}/${formatTitle((data as MediaResultData).title)}`;
			case "actor":
				if (path === "movies") {
					return `/movies/${data.id}/${formatTitle((data as MediaResultData).title)}`;
				} else if (path === "actors") {
					return `/actors/${data.id}/${formatTitle((data as PersonResultData).fullname)}`;
				}

				return `/series/${data.id}/${formatTitle((data as MediaResultData).title)}`;
			case "crew":
				if (path === "movies") {
					return `/movies/${data.id}/${formatTitle((data as MediaResultData).title)}`;
				} else if (path === "crew") {
					return `/crew/${data.id}/${formatTitle((data as PersonResultData).fullname)}`;
				}

				return `/series/${data.id}/${formatTitle((data as MediaResultData).title)}`;
			case "season": {
				const serieId =
					typeof params.serieId === "string" ? params.serieId : "";
				const serieTitle =
					typeof params.serieTitle === "string"
						? formatTitle(params.serieTitle)
						: "";
				return `/series/${serieId}/${serieTitle}/seasons/${data.id}/${formatTitle(
					(data as MediaResultData).title,
				)}`;
			}

			case "episode": {
				const serieId =
					typeof params.serieId === "string" ? params.serieId : "";
				const serieTitle =
					typeof params.serieTitle === "string"
						? formatTitle(params.serieTitle)
						: "";
				const seasonId =
					typeof params.seasonId === "string" ? params.seasonId : "";
				const seasonTitle =
					typeof params.seasonTitle === "string"
						? formatTitle(params.seasonTitle)
						: "";
				return `/series/${serieId}/${serieTitle}/seasons/${seasonId}/${seasonTitle}/episodes/${
					data.id
				}/${formatTitle((data as MediaResultData).title)}`;
			}

			case "user":
				return `/users/${data.id}/${formatTitle((data as UserResultData).userName)}`;
			default:
				return "/";
		}
	};

	const getDisplayTitle = () => {
		if (type === "actor" || type === "crew") {
			const personData = data as PersonResultData;
			return `${personData.fullname}${personData.debut ? ` (${personData.debut})` : ""}`;
		}

		if (type === "user") {
			return (data as UserResultData).userName;
		}

		const mediaData = data as MediaResultData;

		return `${mediaData.title}${mediaData.dateAired ? ` (${new Date(mediaData.dateAired).getFullYear()})` : ""}`;
	};

	const getDescription = () => {
		if (type === "user") {
			return (data as UserResultData).bio;
		}

		return data.description;
	};

	return (
		<Link
			href={getPath()}
			style={{ textDecoration: "none" }}
			onClick={onResultClick}
		>
			<Box
				sx={{
					display: "flex",
					gap: 2,
					p: { xs: 1.5, sm: 2 },
					borderRadius: 1,
					transition: "all 0.2s",
					"&:hover": {
						bgcolor: theme.vars.palette.action.hover,
						transform: "translateX(4px)",
					},
				}}
			>
				<Box
					sx={{
						position: "relative",
						width: { xs: 45, sm: 55 },
						height: { xs: 65, sm: 75 },
						flexShrink: 0,
						borderRadius: 1,
						overflow: "hidden",
						boxShadow: 1,
					}}
				>
					<Image
						src={data.photoSrcProd || "/images/placeholder.jpg"}
						alt={data.description || "No description available"}
						fill
						sizes="(max-width: 600px) 45px, 55px"
						style={{ objectFit: "cover" }}
						priority
					/>
				</Box>
				<Box sx={{ overflow: "hidden", flex: 1 }}>
					<Typography
						variant="subtitle1"
						sx={{
							fontWeight: 600,
							overflow: "hidden",
							textOverflow: "ellipsis",
							whiteSpace: "nowrap",
							color: theme.vars.palette.text.primary,
							mb: 0.75,
						}}
					>
						{getDisplayTitle()}
					</Typography>
					{getDescription() && (
						<Typography
							variant="body2"
							sx={{
								color: theme.vars.palette.text.secondary,
								display: "-webkit-box",
								WebkitLineClamp: 2,
								WebkitBoxOrient: "vertical",
								overflow: "hidden",
								lineHeight: 1.4,
							}}
						>
							{getDescription()}
						</Typography>
					)}
				</Box>
			</Box>
		</Link>
	);
};

export default SearchResultCard;
