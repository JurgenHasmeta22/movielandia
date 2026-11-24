"use client";

import { Box } from "@mui/material";
import { MaterialReactTable } from "material-react-table";
import HeaderDashboard from "@/components/admin/headerDashboard/HeaderDashboard";
import { useRouter } from "next/navigation";
import useTableAdmin from "@/components/admin/tableAdmin/TableAdmin";

const MoviesAdminPage = () => {
	"use no memo";
	const router = useRouter();

	function handleAddMovie() {
		router.push("/admin/movies/create");
	}

	const { table } = useTableAdmin({
		page: "movies",
		handleAddItem: handleAddMovie,
	});

	return (
		<>
			<Box component={"main"} sx={{ m: "20px" }}>
				<HeaderDashboard title="Movies" subtitle="List of Movies" />
				<MaterialReactTable table={table} />
			</Box>
		</>
	);
};

export default MoviesAdminPage;
