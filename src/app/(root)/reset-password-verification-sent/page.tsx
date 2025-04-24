import { Suspense } from "react";
import LoadingSpinner from "@/components/root/loadingSpinner/LoadingSpinner";
import ResetPasswordVerifyPageContent from "./_components/ResetPasswordVerifyPageContent";

interface ResetPasswordVerifyPageProps {
	searchParams: Promise<{ email?: string }>;
}

export default async function ResetPasswordVerifyPage({
	searchParams,
}: ResetPasswordVerifyPageProps) {
	const searchParamsKey = JSON.stringify(searchParams);
	const { email } = await searchParams;

	return (
		<Suspense key={searchParamsKey} fallback={<LoadingSpinner />}>
			<ResetPasswordVerifyPageContent email={email} />
		</Suspense>
	);
}
