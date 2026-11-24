"use client";

import { Box } from "@mui/material";
import { MaterialReactTable } from "material-react-table";
import HeaderDashboard from "@/components/admin/headerDashboard/HeaderDashboard";
import { useRouter } from "next/navigation";
import useTableAdmin from "@/components/admin/tableAdmin/TableAdmin";

const ActorsAdminPage = () => {
	"use no memo";
	const router = useRouter();

	function handleAddActor() {
		router.push("/admin/actors/create");
	}

	const { table } = useTableAdmin({
		page: "actors",
		handleAddItem: handleAddActor,
	});

	return (
		<Box sx={{ m: "20px" }}>
			<HeaderDashboard title="Actors" subtitle="List of actors" />
			<MaterialReactTable table={table} />
		</Box>
	);
};

export default ActorsAdminPage;
