"use client";

import { Box } from "@mui/material";
import { MaterialReactTable } from "material-react-table";
import HeaderDashboard from "@/components/admin/headerDashboard/HeaderDashboard";
import { useRouter } from "next/navigation";
import useTableAdmin from "@/components/admin/tableAdmin/TableAdmin";

const CrewsAdminPage = () => {
	"use no memo";
	const router = useRouter();

	function handleAddCrew() {
		router.push("/admin/crews/create");
	}

	const { table } = useTableAdmin({
		page: "crews",
		handleAddItem: handleAddCrew,
	});

	return (
		<>
			<Box component={"main"} sx={{ m: "20px" }}>
				<HeaderDashboard title="Crews" subtitle="List of crews" />
				<MaterialReactTable table={table} />
			</Box>
		</>
	);
};

export default CrewsAdminPage;
