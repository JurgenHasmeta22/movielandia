import DashboardAdminPage from "./_components/DashboardAdminPage";
import { getDashboardStats } from "./_actions/getDashboardStats";

export default async function DashboardAdmin() {
    const stats = await getDashboardStats();

    return <DashboardAdminPage stats={stats} />;
}
