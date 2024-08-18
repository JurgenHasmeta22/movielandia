import { Html, Head, Preview, Body, Container, Heading, Text, Button, Link } from "@react-email/components";

interface IRegistrationEmailProps {
    userName: string;
    email: string;
    token: string;
}

export default function RegistrationEmail({ userName, email, token }: IRegistrationEmailProps) {
    const verificationLink = `https://movielandia-avenger22s-projects.vercel.app/verify-register?token=${token}&email=${email}`;

    return (
        <Html>
            <Head />
            <Preview>Verify your MovieLandia24 account</Preview>
            <Body
                style={{
                    fontFamily: "Arial, sans-serif",
                    backgroundColor: "#f9f9f9",
                    margin: "0 auto",
                    padding: "20px",
                }}
            >
                <Container
                    style={{
                        maxWidth: "600px",
                        margin: "0 auto",
                        backgroundColor: "#ffffff",
                        padding: "20px",
                        borderRadius: "8px",
                    }}
                >
                    <Heading style={{ fontSize: "24px", fontWeight: "bold", marginBottom: "20px", color: "#333333" }}>
                        Welcome to MovieLandia24, {userName}!
                    </Heading>
                    <Text style={{ fontSize: "16px", color: "#333333", lineHeight: "1.5" }}>
                        Thank you for registering at MovieLandia24. Please click the button below to verify your email
                        address and complete your registration.
                    </Text>
                    <Button
                        href={verificationLink}
                        style={{
                            backgroundColor: "#007bff",
                            color: "#ffffff",
                            padding: "10px 20px",
                            borderRadius: "5px",
                            textDecoration: "none",
                            display: "inline-block",
                            marginTop: "20px",
                        }}
                    >
                        Verify Your Email
                    </Button>
                    <Text style={{ fontSize: "14px", color: "#666666", marginTop: "20px", lineHeight: "1.5" }}>
                        If the button above doesn’t work, you can also click on the link below or paste it into your
                        browser:
                    </Text>
                    <Link href={verificationLink} style={{ color: "#007bff", wordBreak: "break-all" }}>
                        {verificationLink}
                    </Link>
                    <Text style={{ fontSize: "14px", color: "#666666", marginTop: "20px", lineHeight: "1.5" }}>
                        If you didn’t create an account with MovieLandia24, you can safely ignore this email.
                    </Text>
                </Container>
            </Body>
        </Html>
    );
}
