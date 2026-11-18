import type {
	PaletteColor,
	PaletteColorChannel,
	PaletteColorOptions,
} from "@mui/material/styles";

interface StatsPalette {
	boxShadow: string;
	hoverShadow: string;
	iconBg: string;
	borderColor: string;
}

declare module "@mui/material/styles" {
	interface Palette {
		blue: PaletteColor;
		green: PaletteColor;
		greyAccent: PaletteColor;
		red: PaletteColor;
		stats: StatsPalette;
	}

	interface PaletteOptions {
		blue?: PaletteColorOptions;
		green?: PaletteColorOptions;
		greyAccent?: PaletteColorOptions;
		red?: PaletteColorOptions;
		stats?: Partial<StatsPalette>;
	}

	interface CssVarsPalette {
		blue: PaletteColorChannel;
		green: PaletteColorChannel;
		greyAccent: PaletteColorChannel;
		red: PaletteColorChannel;
		stats: StatsPalette;
	}
}
