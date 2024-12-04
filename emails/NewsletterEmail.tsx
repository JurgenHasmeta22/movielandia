import React from "react";
import { Html, Head, Preview, Body, Container, Heading, Text } from "@react-email/components";

const NewsletterEmail = ({ userName }: { userName: string }) => {
    return (
        <Html>
            <Head />
            <Preview>Stay updated with our latest news</Preview>
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
                        Hello {userName},
                    </Heading>
                    <Text style={{ fontSize: "16px", color: "#333333", lineHeight: "1.5" }}>
                        Thank you for subscribing to our newsletter! We&apos;re excited to keep you updated with the
                        latest news and offers.
                    </Text>
                    <Text style={{ fontSize: "16px", color: "#333333", lineHeight: "1.5", marginTop: "20px" }}>
                        Best regards,
                    </Text>
                    <Text style={{ fontSize: "16px", color: "#333333", lineHeight: "1.5" }}>
                        The MovieLandia24 Team
                    </Text>
                </Container>
            </Body>
        </Html>
    );
};

export default NewsletterEmail;
