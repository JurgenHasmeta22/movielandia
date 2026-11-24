import { Bricolage_Grotesque, Instrument_Sans } from "next/font/google";

export const displayFont = Bricolage_Grotesque({
	subsets: ["latin"],
	display: "swap",
	variable: "--font-display",
	fallback: ["Arial", "sans-serif"],
});

export const bodyFont = Instrument_Sans({
	subsets: ["latin"],
	display: "swap",
	variable: "--font-body",
	fallback: ["Arial", "sans-serif"],
});

export const fontClassNames = `${displayFont.variable} ${bodyFont.variable}`;
