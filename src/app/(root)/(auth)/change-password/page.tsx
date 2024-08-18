import ChangePasswordForm from "./_components/ChangePasswordForm";

export default function ChangePasswordPage({ searchParams }: { searchParams: { email: string } }) {
    const { email } = searchParams;

    return <ChangePasswordForm email={email} />;
}
