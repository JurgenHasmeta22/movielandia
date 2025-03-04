import { Suspense } from "react";
import LoadingSpinner from "@/components/root/loadingSpinner/LoadingSpinner";
import VerifyRegisterPageContent from "./_components/VerifyRegisterPageContent";

interface VerifyRegisterPageProps {
    searchParams: Promise<{ email?: string }>;
}

export default async function VerifyRegisterPage({ searchParams }: VerifyRegisterPageProps) {
    const searchParamsKey = JSON.stringify(searchParams);
    const { email } = await searchParams;

    return (
        <Suspense key={searchParamsKey} fallback={<LoadingSpinner />}>
            <VerifyRegisterPageContent email={email} />
        </Suspense>
    );
}
