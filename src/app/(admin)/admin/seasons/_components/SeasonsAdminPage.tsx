"use client";

import { Box } from "@mui/material";
import { MaterialReactTable } from "material-react-table";
import HeaderDashboard from "@/components/admin/headerDashboard/HeaderDashboard";
import { useRouter } from "next/navigation";
import useTableAdmin from "@/components/admin/tableAdmin/TableAdmin";

const SeasonsAdminPage = () => {
	"use no memo";
	const router = useRouter();

	function handleAddSeason() {
		router.push("/admin/seasons/create");
	}

	const { table } = useTableAdmin({
		page: "seasons",
		handleAddItem: handleAddSeason,
	});

	return (
		<Box sx={{ m: "20px" }}>
			<HeaderDashboard title="Seasons" subtitle="List of seasons" />
			<MaterialReactTable table={table} />
		</Box>
	);
};

export default SeasonsAdminPage;
