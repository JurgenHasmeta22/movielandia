import { Box, Stack, Typography } from "@mui/material";
import { Crew } from "@prisma/client";
import {
	getCrewMembersWithFilters,
	getCrewTotalCount,
} from "@/actions/crew.actions";
import CardItem from "@/components/root/cardItem/CardItem";
import PaginationControl from "@/components/root/paginationControl/PaginationControl";
import SortSelect from "@/components/root/sortSelect/SortSelect";

interface CrewPageContentProps {
	searchParams:
		| {
				crewAscOrDesc?: string;
				pageCrews?: string;
				crewSortBy?: string;
		  }
		| undefined;
	session: any;
}

export default async function CrewAllPageContent({
	searchParams,
	session,
}: CrewPageContentProps) {
	const { ascOrDesc, page, sortBy } = {
		ascOrDesc: searchParams?.crewAscOrDesc ?? "",
		page: searchParams?.pageCrews ? Number(searchParams.pageCrews) : 1,
		sortBy: searchParams?.crewSortBy ?? "",
	};

	const queryParams = { ascOrDesc, page, sortBy };
	const userId = session?.user?.id;

	const crewData = await getCrewMembersWithFilters(
		queryParams,
		Number(userId),
	);
	const crewMembers = crewData.crewMembers;
	const crewCount = await getCrewTotalCount();

	const itemsPerPage = 12;
	const pageCount = Math.ceil(crewCount / itemsPerPage);
	const startIndex = (page - 1) * itemsPerPage + 1;
	const endIndex = Math.min(startIndex + itemsPerPage - 1, crewCount);

	return (
		<Box
			component="section"
			sx={{
				display: "flex",
				flexDirection: "column",
				gap: { xs: 3, sm: 4, md: 5 },
			}}
		>
			<Box
				component="section"
				sx={{
					maxWidth: "1200px",
					margin: "0 auto",
					width: "100%",
					mt: 8,
					px: { xs: 2, sm: 3, md: 4 },
				}}
			>
				<Box
					sx={{
						display: "flex",
						justifyContent: "space-between",
						alignItems: "flex-start",
						flexDirection: { xs: "column", sm: "row" },
						gap: { xs: 2, sm: 3 },
						mb: { xs: 3, md: 4 },
					}}
				>
					<Box
						sx={{
							display: "flex",
							flexDirection: { xs: "column", sm: "row" },
							alignItems: { xs: "flex-start", sm: "baseline" },
							gap: { xs: 1, sm: 2 },
						}}
					>
						<Typography
							variant="h2"
							sx={{
								fontSize: { xs: 24, sm: 28, md: 32 },
								fontWeight: 800,
								color: "text.primary",
								position: "relative",
								display: "inline-block",
								"&::after": {
									content: '""',
									position: "absolute",
									bottom: -8,
									left: 0,
									width: "100%",
									height: 3,
									bgcolor: "primary.main",
									borderRadius: 1,
								},
							}}
						>
							Crew
						</Typography>
						<Typography
							variant="h5"
							sx={{
								fontSize: { xs: 16, sm: 18 },
								color: "text.secondary",
								mt: { xs: 2, sm: 0 },
								ml: { sm: 1 },
								position: "relative",
								top: { sm: 2 },
							}}
						>
							{startIndex} – {endIndex} of {crewCount} crew
							members
						</Typography>
					</Box>
					<Box>
						<SortSelect
							sortBy={sortBy}
							ascOrDesc={ascOrDesc}
							type="list"
							dataType="crew"
						/>
					</Box>
				</Box>
				<Box
					sx={{
						width: "100%",
						overflow: "hidden",
						mt: { xs: 4, md: 5 },
						mb: 4,
					}}
				>
					<Stack
						direction="row"
						flexWrap="wrap"
						sx={{
							columnGap: { xs: 1, sm: 2, md: 3 },
							rowGap: { xs: 3, sm: 4, md: 5 },
							justifyContent: { xs: "center", md: "flex-start" },
							mx: { xs: 1, sm: 2 },
							mb: { xs: 3, md: 4 },
						}}
					>
						{crewMembers.map((crewMember: Crew) => (
							<CardItem
								key={crewMember.id}
								data={crewMember}
								type="crew"
								path="crew"
							/>
						))}
					</Stack>
					<PaginationControl
						currentPage={Number(page)}
						pageCount={pageCount}
						urlParamName="pageCrews"
					/>
				</Box>
			</Box>
		</Box>
	);
}
