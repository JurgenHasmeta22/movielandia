import React from "react";
import {
    Html,
    Head,
    Preview,
    Body,
    Container,
    Heading,
    Text,
    Img,
    Section,
} from "@react-email/components";

interface NewsletterEmailProps {
    userName: string;
}

const baseUrl = process.env.NEXT_PUBLIC_APP_URL;

const NewsletterEmail: React.FC<NewsletterEmailProps> = ({ userName }) => {
    const main = {
        backgroundColor: "#f6f9fc",
        fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
    };

    const container = {
        backgroundColor: "#ffffff",
        margin: "0 auto",
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
    };

    const paragraph = {
        margin: "0 0 15px",
        fontSize: "15px",
        lineHeight: "1.6",
        color: "#3c4149",
    };

    const footer = {
        color: "#706a7b",
        fontSize: "12px",
        lineHeight: "16px",
        textAlign: "center" as const,
        marginTop: "32px",
    };

    return (
        <Html>
            <Head />
            <Preview>Welcome to MovieLandia24 Newsletter 🎬</Preview>
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
                    <Heading style={heading}>
                        Welcome, {userName}! 👋
                    </Heading>
                    <Text style={paragraph}>
                        Thank you for subscribing to our newsletter! Get ready for exclusive movie updates,
                        recommendations, and insider content delivered straight to your inbox.
                    </Text>
                    <Text style={paragraph}>
                        Stay tuned for:
                        <br />• Latest movie releases and reviews
                        <br />• Exclusive behind-the-scenes content
                        <br />• Special features and interviews
                        <br />• Community highlights and discussions
                    </Text>
                    <Text style={{ ...paragraph, marginTop: "24px" }}>
                        Best regards,
                        <br />
                        The MovieLandia24 Team 🎥
                    </Text>
                    <Text style={footer}>
                        &copy; 2024 MovieLandia24. All rights reserved.
                    </Text>
                </Container>
            </Body>
        </Html>
    );
};

export default NewsletterEmail;
