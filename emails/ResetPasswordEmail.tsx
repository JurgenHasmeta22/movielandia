import { Html, Head, Preview, Body, Container, Heading, Text, Button, Link } from "@react-email/components";

interface IResetPasswordEmailProps {
    userName: string;
    email: string;
    token: string;
}

const ResetPasswordEmail = ({ userName, email, token }: IResetPasswordEmailProps) => {
    const verificationLink = `https://movielandia-avenger22s-projects.vercel.app/verify-reset-password?token=${token}&email=${email}`;

    return (
        <Html>
            <Head />
            <Preview>Reset your password, {userName}</Preview>
            <Body
                style={{
                    backgroundColor: "#f6f9fc",
                    margin: "0 auto",
                    fontFamily: "Arial, sans-serif",
                }}
            >
                <Container
                    style={{
                        maxWidth: "600px",
                        margin: "40px auto",
                        padding: "20px",
                        backgroundColor: "#ffffff",
                        borderRadius: "8px",
                        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                    }}
                >
                    <Heading
                        style={{
                            fontSize: "24px",
                            fontWeight: "bold" as const,
                            marginBottom: "24px",
                            color: "#333333",
                        }}
                    >
                        Reset Your Password
                    </Heading>
                    <Text
                        style={{
                            fontSize: "16px",
                            lineHeight: "1.5",
                            marginBottom: "16px",
                            color: "#555555",
                        }}
                    >
                        We received a request to reset your password. Click the button below to reset it.
                    </Text>
                    <Button
                        style={{
                            display: "block",
                            width: "100%",
                            padding: "12px",
                            backgroundColor: "#007bff",
                            color: "#ffffff",
                            textDecoration: "none",
                            textAlign: "center" as const,
                            borderRadius: "4px",
                            fontWeight: "bold" as const,
                            marginBottom: "24px",
                        }}
                        href={verificationLink}
                    >
                        Reset Password
                    </Button>
                    <Text
                        style={{
                            fontSize: "16px",
                            lineHeight: "1.5",
                            marginBottom: "16px",
                            color: "#555555",
                        }}
                    >
                        If you didn&apos;t request a password reset, please ignore this email or contact support if you
                        have questions.
                    </Text>
                    <Text
                        style={{
                            fontSize: "16px",
                            lineHeight: "1.5",
                            marginBottom: "16px",
                            color: "#555555",
                        }}
                    >
                        Thanks, <br />
                        The [MovieLandia24] Team
                    </Text>
                    <Text
                        style={{
                            fontSize: "12px",
                            color: "#999999",
                            marginTop: "24px",
                            borderTop: "1px solid #eeeeee",
                            paddingTop: "12px",
                        }}
                    >
                        If you&apos;re having trouble with the button above, copy and paste the following URL into your
                        web browser:{" "}
                        <Link
                            href={verificationLink}
                            style={{
                                color: "#007bff",
                                textDecoration: "none",
                            }}
                        >
                            {verificationLink}
                        </Link>
                    </Text>
                </Container>
            </Body>
        </Html>
    );
};

export default ResetPasswordEmail;
