import ContactUsContent from "./_components/ContactUsContent";
import type { Metadata } from "next";

export const metadata: Metadata = {
	title: "Contact Us | MovieLandia",
	description: "Get in touch with MovieLandia - we'd love to hear from you!",
};

export default function ContactUsPage() {
	return <ContactUsContent />;
}
