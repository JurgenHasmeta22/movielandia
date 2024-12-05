import {
    Html,
    Head,
    Preview,
    Body,
    Container,
    Heading,
    Text,
    Button,
    Link,
    Section,
    Img,
} from "@react-email/components";

interface ResetPasswordEmailProps {
    userName: string;
    email: string;
    token: string;
}

const baseUrl = process.env.NEXT_PUBLIC_APP_URL;

const ResetPasswordEmail: React.FC<ResetPasswordEmailProps> = ({ userName, email, token }) => {
    const verificationLink = `${baseUrl}/verify-reset-password?token=${token}&email=${email}`;

    const main = {
        backgroundColor: "#f6f9fc",
        fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
    };

    const container = {
        backgroundColor: "#ffffff",
        margin: "40px auto",
        padding: "32px",
        borderRadius: "12px",
        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.05)",
        maxWidth: "600px",
    };

    const logo = {
        margin: "0 auto",
        width: "150px",
        height: "auto",
    };

    const heading = {
        fontSize: "24px",
        letterSpacing: "-0.5px",
        lineHeight: "1.3",
        fontWeight: "700",
        color: "#484848",
        padding: "17px 0 0",
        textAlign: "center" as const,
    };

    const paragraph = {
        margin: "0 0 15px",
        fontSize: "15px",
        lineHeight: "1.6",
        color: "#3c4149",
        textAlign: "center" as const,
    };

    const buttonContainer = {
        textAlign: "center" as const,
        margin: "24px 0",
    };

    const button = {
        backgroundColor: "#6366f1",
        borderRadius: "6px",
        color: "#fff",
        fontSize: "16px",
        fontWeight: "600",
        textDecoration: "none",
        textAlign: "center" as const,
        padding: "12px 24px",
        transition: "background-color 0.2s",
        display: "inline-block",
    };

    const divider = {
        borderTop: "1px solid #e9ecef",
        margin: "32px 0 20px",
    };

    const link = {
        color: "#6366f1",
        fontSize: "14px",
        textDecoration: "underline",
        wordBreak: "break-all" as const,
        display: "inline-block",
        maxWidth: "100%",
    };

    const footer = {
        color: "#706a7b",
        fontSize: "12px",
        lineHeight: "16px",
        textAlign: "center" as const,
        marginTop: "32px",
        padding: "0 24px",
    };

    return (
        <Html>
            <Head />
            <Preview>Reset your MovieLandia24 password 🔐</Preview>
            <Body style={main}>
                <Container style={container}>
                    <Section style={{ textAlign: "center" as const }}>
                        <Img
                            src={`${baseUrl}/icons/movielandia24-logo.png`}
                            width="150"
                            height="auto"
                            alt="MovieLandia24"
                            style={logo}
                        />
                    </Section>
                    <Heading style={heading}>Reset Your Password</Heading>
                    <Text style={paragraph}>
                        Hi {userName}, we received a request to reset your password. Click the button below to create a
                        new password for your MovieLandia24 account.
                    </Text>
                    <Section style={buttonContainer}>
                        <Button href={verificationLink} style={button}>
                            Reset Password
                        </Button>
                    </Section>
                    <Text style={paragraph}>
                        If you didn&apos;t request a password reset, you can safely ignore this email. Your password
                        will remain unchanged.
                    </Text>
                    <Section style={divider} />
                    <Text style={{ ...paragraph, fontSize: "14px", color: "#666666" }}>
                        If the button doesn&apos;t work, you can copy and paste this link into your browser:
                    </Text>
                    <Text style={{ ...paragraph, margin: "8px 0 24px" }}>
                        <Link href={verificationLink} style={link}>
                            {verificationLink}
                        </Link>
                    </Text>
                    <Text style={footer}>
                        &copy; 2024 MovieLandia24. All rights reserved.
                        <br />
                        This is an automated message, please do not reply.
                    </Text>
                </Container>
            </Body>
        </Html>
    );
};

export default ResetPasswordEmail;
