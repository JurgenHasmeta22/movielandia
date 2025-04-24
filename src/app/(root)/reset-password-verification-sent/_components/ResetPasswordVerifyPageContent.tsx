import { Box, Typography } from "@mui/material";
import VerificationLayout from "@/components/root/verificationLayout/VerificationLayout";
import MarkEmailReadIcon from "@mui/icons-material/MarkEmailRead";

interface ResetPasswordVerifyPageContentProps {
	email?: string;
}

export default function ResetPasswordVerifyPageContent({
	email,
}: ResetPasswordVerifyPageContentProps) {
	if (!email) {
		return (
			<VerificationLayout title="Error">
				<Typography variant="body1" textAlign="center" color="error">
					Email not provided
				</Typography>
			</VerificationLayout>
		);
	}

	return (
		<VerificationLayout title="Check Your Email">
			<Box sx={{ textAlign: "center" }}>
				<MarkEmailReadIcon
					sx={{ fontSize: 60, color: "primary.main", mb: 3 }}
				/>
				<Typography variant="body1" sx={{ mb: 2 }}>
					We have sent a reset password verification link to{" "}
					<strong>{email}</strong>
				</Typography>
				<Typography variant="body2" color="text.secondary">
					Please check your email and follow the instructions to reset
					your password.
				</Typography>
			</Box>
		</VerificationLayout>
	);
}
