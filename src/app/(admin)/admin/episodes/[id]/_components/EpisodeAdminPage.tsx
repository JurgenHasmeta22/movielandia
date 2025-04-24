"use client";

import { Box } from "@mui/material";
import { useState, useEffect, useRef } from "react";
import ClearOutlinedIcon from "@mui/icons-material/ClearOutlined";
import SaveAsIcon from "@mui/icons-material/SaveAs";
import ClearAllIcon from "@mui/icons-material/ClearAll";
import { toast } from "react-toastify";
import * as CONSTANTS from "@/constants/Constants";
import { useModal } from "@/providers/ModalProvider";
import { WarningOutlined, CheckOutlined } from "@mui/icons-material";
import { Episode, Prisma } from "@prisma/client";
import HeaderDashboard from "@/components/admin/headerDashboard/HeaderDashboard";
import FormAdvanced from "@/components/admin/form/Form";
import Breadcrumb from "@/components/admin/breadcrumb/Breadcrumb";
import { useParams, useRouter } from "next/navigation";
import {
	deleteEpisodeById,
	getEpisodeById,
	updateEpisodeById,
} from "@/actions/episode.actions";
import Link from "next/link";
import LoadingSpinner from "@/components/root/loadingSpinner/LoadingSpinner";
import { episodeSchema } from "@/schemas/episode.schema";

const EpisodeAdminPage = () => {
	const [episode, setEpisode] = useState<Episode | null>(null);
	const [formData, setFormData] = useState<any>({});
	const [loading, setLoading] = useState(true);
	const [open, setOpen] = useState(false);

	const router = useRouter();
	const params = useParams();
	const { openModal } = useModal();
	const formRef = useRef<any>(null);

	const breadcrumbs = [
		<Link key="1" href="/admin/episodes" style={{ textDecoration: "none" }}>
			Episodes
		</Link>,
		<Link
			key="2"
			href={`/admin/episodes/${params?.id}`}
			style={{ textDecoration: "none" }}
		>
			{episode?.title || `Episode ${params?.id}`}
		</Link>,
	];

	const handleResetFromParent = () => {
		formRef.current?.reset();
	};

	const handleFormSubmit = async (values: any) => {
		const payload: Prisma.EpisodeUpdateInput = {
			title: values.title,
			photoSrc: values.photoSrc,
			photoSrcProd: values.photoSrcProd,
			trailerSrc: values.trailerSrc,
			description: values.description,
			duration: Number(values.duration),
			dateAired: values.dateAired,
			ratingImdb: Number(values.ratingImdb),
			season: {
				connect: {
					id: values.seasonId,
				},
			},
		};

		const response: Episode | null = await updateEpisodeById(
			payload,
			String(episode?.id),
		);

		if (response) {
			toast.success(CONSTANTS.UPDATE__SUCCESS);
			getEpisode();
		} else {
			toast.error(CONSTANTS.UPDATE__FAILURE);
		}
	};

	async function getEpisode(): Promise<void> {
		setLoading(true);
		const response: Episode | null = await getEpisodeById(
			Number(params.id),
			{},
		);

		if (response) {
			setEpisode(response);
			setLoading(false);
		}
	}

	useEffect(() => {
		getEpisode();
	}, []);

	if (loading) {
		return <LoadingSpinner />;
	}

	return (
		<Box m="20px">
			<Breadcrumb
				breadcrumbs={breadcrumbs}
				navigateTo={"/admin/episodes"}
			/>
			<HeaderDashboard title={"Episode"} subtitle={"Edit Episode"} />
			<FormAdvanced
				defaultValues={{
					id: episode?.id,
					title: episode?.title,
					photoSrc: episode?.photoSrc,
					photoSrcProd: episode?.photoSrcProd,
					trailerSrc: episode?.trailerSrc,
					description: episode?.description,
					duration: episode?.duration,
					dateAired: episode?.dateAired,
					ratingImdb: episode?.ratingImdb,
					seasonId: episode?.seasonId,
				}}
				fields={[
					{
						name: "id",
						label: "Id",
						disabled: true,
						variant: "filled",
						type: "text",
					},
					{
						name: "title",
						label: "Title",
						variant: "filled",
						type: "text",
					},
					{
						name: "photoSrc",
						label: "Photo Src",
						variant: "filled",
						type: "text",
					},
					{
						name: "photoSrcProd",
						label: "Photo Src Prod",
						variant: "filled",
						type: "text",
					},
					{
						name: "trailerSrc",
						label: "Trailer Src",
						variant: "filled",
						type: "text",
					},
					{
						name: "description",
						label: "Description",
						variant: "filled",
						type: "text",
					},
					{
						name: "duration",
						label: "Duration (minutes)",
						variant: "filled",
						type: "text",
					},
					{
						name: "dateAired",
						label: "Date Aired",
						variant: "filled",
						type: "date",
					},
					{
						name: "ratingImdb",
						label: "IMDB Rating",
						variant: "filled",
						type: "text",
					},
					{
						name: "seasonId",
						label: "Season ID",
						variant: "filled",
						type: "text",
					},
				]}
				schema={episodeSchema}
				onSubmit={handleFormSubmit}
				formRef={formRef}
				actions={[
					{
						label: CONSTANTS.FORM__DELETE__BUTTON,
						onClick: async () => {
							openModal({
								onClose: () => setOpen(false),
								title: `Delete selected episode ${formData.title}`,
								actions: [
									{
										label: CONSTANTS.MODAL__DELETE__NO,
										onClick: () => setOpen(false),
										color: "secondary",
										variant: "contained",
										sx: {
											bgcolor: "#ff5252",
										},
										icon: <WarningOutlined />,
									},
									{
										label: CONSTANTS.MODAL__DELETE__YES,
										onClick: async () => {
											const response =
												await deleteEpisodeById(
													episode?.id!,
												);

											if (response) {
												toast.success(
													CONSTANTS.DELETE__SUCCESS,
												);
												router.push("/admin/episodes");
											} else {
												toast.success(
													CONSTANTS.DELETE__FAILURE,
												);
											}
										},
										type: "submit",
										color: "secondary",
										variant: "contained",
										sx: {
											bgcolor: "#30969f",
										},
										icon: <CheckOutlined />,
									},
								],
								subTitle:
									"Do you want to delete selected record ?",
							});
						},
						color: "secondary",
						variant: "contained",
						sx: {
							bgcolor: "#ff5252",
						},
						icon: (
							<ClearOutlinedIcon
								color="action"
								sx={{ ml: "10px" }}
							/>
						),
					},
					{
						label: CONSTANTS.FORM__RESET__BUTTON,
						type: "reset",
						onClick: () => {
							handleResetFromParent();
						},
						color: "secondary",
						variant: "contained",
						sx: {
							bgcolor: "#00bfff",
						},
						icon: (
							<ClearAllIcon color="action" sx={{ ml: "10px" }} />
						),
					},
					{
						label: CONSTANTS.FORM__UPDATE__BUTTON,
						type: "submit",
						color: "secondary",
						variant: "contained",
						sx: {
							bgcolor: "#30969f",
						},
						icon: <SaveAsIcon sx={{ ml: "10px" }} color="action" />,
					},
				]}
			/>
		</Box>
	);
};

export default EpisodeAdminPage;
