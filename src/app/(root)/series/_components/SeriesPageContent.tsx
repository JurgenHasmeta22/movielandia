import { Box, Typography } from "@mui/material";
import { Serie } from "@prisma/client";
import {
	getLatestSeries,
	getSeriesTotalCount,
	getSeriesWithFilters,
} from "@/actions/serie.actions";
import Carousel from "@/components/root/carousel/Carousel";
import CardItem from "@/components/root/cardItem/CardItem";
import PaginationControl from "@/components/root/paginationControl/PaginationControl";
import { LatestList } from "@/components/root/latestList/LatestList";
import SortSelect from "@/components/root/sortSelect/SortSelect";

interface SeriesPageContentProps {
	searchParams:
		| {
				seriesAscOrDesc?: string;
				pageSeries?: string;
				seriesSortBy?: string;
		  }
		| undefined;
	session: any;
}

export default async function SeriesPageContent({
	searchParams,
	session,
}: SeriesPageContentProps) {
	const { ascOrDesc, page, sortBy } = {
		ascOrDesc: searchParams?.seriesAscOrDesc ?? "",
		page: searchParams?.pageSeries ? Number(searchParams.pageSeries) : 1,
		sortBy: searchParams?.seriesSortBy ?? "",
	};

	const queryParams = { ascOrDesc, page, sortBy };
	const userId = session?.user?.id;

	const seriesData = await getSeriesWithFilters(queryParams, Number(userId));
	const series = seriesData.rows;
	const seriesCount = await getSeriesTotalCount();

	const latestSeries = await getLatestSeries();
	const seriesCarouselImages: Serie[] = seriesData.rows.slice(0, 5);

	const itemsPerPage = 12;
	const pageCount = Math.ceil(seriesCount / itemsPerPage);
	const startIndex = (page - 1) * itemsPerPage + 1;
	const endIndex = Math.min(startIndex + itemsPerPage - 1, seriesCount);

	return (
		<Box
			component="section"
			sx={{
				display: "flex",
				flexDirection: "column",
				gap: { xs: 2, sm: 3, md: 4 },
			}}
		>
			<Box component="section">
				<Carousel data={seriesCarouselImages} type="series" />
			</Box>
			<Box
				component="section"
				sx={{
					maxWidth: "1320px",
					margin: "0 auto",
					width: "100%",
					px: { xs: 2, sm: 3, md: 4, xl: 0 },
				}}
			>
				<Box
					sx={{
						display: "flex",
						justifyContent: "space-between",
						alignItems: { xs: "flex-start", sm: "center" },
						flexDirection: { xs: "column", sm: "row" },
						gap: { xs: 2, sm: 3 },
						mb: { xs: 2.5, md: 3 },
						pb: { xs: 2, md: 2.5 },
						borderBottom: "1px solid",
						borderColor: "divider",
					}}
				>
					<Box
						sx={{
							display: "flex",
							flexDirection: "column",
							alignItems: "flex-start",
							gap: 0.75,
						}}
					>
						<Typography
							variant="h2"
							component="h1"
							sx={{
								fontSize: { xs: 30, sm: 36, md: 42 },
								fontWeight: 700,
								color: "text.primary",
								letterSpacing: "-0.05em",
							}}
						>
							Series
						</Typography>
						<Typography
							variant="body2"
							sx={{
								fontSize: { xs: 14, sm: 15 },
								color: "text.secondary",
							}}
						>
							{startIndex} – {endIndex} of {seriesCount} series
						</Typography>
					</Box>
					<Box sx={{ alignSelf: { xs: "stretch", sm: "center" } }}>
						<SortSelect
							sortBy={sortBy}
							ascOrDesc={ascOrDesc}
							type="list"
							dataType="series"
						/>
					</Box>
				</Box>
				<Box
					sx={{
						width: "100%",
						overflow: "visible",
						mt: { xs: 2.5, md: 3.5 },
					}}
				>
					<Box
						sx={{
							display: "grid",
							gridTemplateColumns: {
								xs: "repeat(2, minmax(0, 1fr))",
								sm: "repeat(3, minmax(0, 1fr))",
								md: "repeat(4, minmax(0, 1fr))",
								lg: "repeat(5, minmax(0, 1fr))",
								xl: "repeat(6, minmax(0, 1fr))",
							},
							gap: { xs: 1.5, sm: 2.5, md: 3 },
							mb: { xs: 3, md: 4 },
						}}
					>
						{series.map((serie: Serie) => (
							<CardItem
								key={serie.id}
								data={serie}
								type="serie"
								presentation="poster"
							/>
						))}
					</Box>
					<PaginationControl
						currentPage={Number(page)}
						pageCount={pageCount}
						urlParamName="pageSeries"
					/>
				</Box>
			</Box>
			<LatestList data={latestSeries} type="Series" />
		</Box>
	);
}
