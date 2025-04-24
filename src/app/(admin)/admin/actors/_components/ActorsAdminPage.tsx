"use client";

import { Box } from "@mui/material";
import { MaterialReactTable } from "material-react-table";
import HeaderDashboard from "@/components/admin/headerDashboard/HeaderDashboard";
import { useRouter } from "next/navigation";
import TableAdmin from "@/components/admin/tableAdmin/TableAdmin";

const ActorsAdminPage = () => {
	const router = useRouter();

	function handleAddActor() {
		router.push("/admin/actors/create");
	}

	const { table } = TableAdmin({
		page: "actors",
		handleAddItem: handleAddActor,
	});

	return (
		<Box m="20px">
			<HeaderDashboard title="Actors" subtitle="List of actors" />
			<MaterialReactTable table={table} />
		</Box>
	);
};

export default ActorsAdminPage;
