import ChangePasswordForm from "./_components/ChangePasswordForm";

export default async function ChangePasswordPage(props: {
	searchParams: Promise<{ email: string }>;
}) {
	const searchParams = await props.searchParams;
	const { email } = searchParams;

	return <ChangePasswordForm email={email} />;
}
