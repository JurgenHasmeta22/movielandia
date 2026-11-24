"use client";

import { Box } from "@mui/material";
import { MaterialReactTable } from "material-react-table";
import HeaderDashboard from "@/components/admin/headerDashboard/HeaderDashboard";
import { useRouter } from "next/navigation";
import useTableAdmin from "@/components/admin/tableAdmin/TableAdmin";

const EpisodesAdminPage = () => {
	"use no memo";
	const router = useRouter();

	function handleAddEpisode() {
		router.push("/admin/episodes/create");
	}

	const { table } = useTableAdmin({
		page: "episodes",
		handleAddItem: handleAddEpisode,
	});

	return (
		<Box sx={{ m: "20px" }}>
			<HeaderDashboard title="Episodes" subtitle="List of episodes" />
			<MaterialReactTable table={table} />
		</Box>
	);
};

export default EpisodesAdminPage;
