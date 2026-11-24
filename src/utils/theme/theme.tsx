"use client";

import { alpha, createTheme } from "@mui/material/styles";
import type { Shadows } from "@mui/material/styles";

const marqueeGold = "#FFB224";
const marqueeGoldSoft = "#FFCB6B";
const inkOnGold = "#1A1100";

const darkPalette = {
	primary: {
		main: "#F3EEE6",
		light: "#C9C0D4",
		dark: "#08060C",
		contrastText: "#0D0A12",
	},
	secondary: {
		main: "#2E2440",
		light: "#241B30",
		dark: "#1D1628",
		contrastText: "#F3EEE6",
	},
	accent: {
		main: marqueeGold,
		light: marqueeGoldSoft,
		dark: "#E58F00",
		contrastText: inkOnGold,
	},
	blue: { main: "#9AA8FF", light: "#C2CAFF", dark: "#6B7BEA" },
	red: { main: "#FF5F7E", light: "#FF8FA5", dark: "#D93A5C" },
	green: { main: "#4FD1A5", light: "#86E3C3", dark: "#2E9D77" },
	greyAccent: { main: "#E6E0EE" },
	error: { main: "#FF5F7E" },
	warning: { main: marqueeGold },
	success: { main: "#4FD1A5" },
	info: { main: "#9AA8FF" },
	background: { default: "#0D0A12", paper: "#161120" },
	text: {
		primary: "#F3EEE6",
		secondary: "#A79DB4",
		disabled: "#6E647B",
	},
	divider: "rgba(243, 238, 230, 0.1)",
	stats: {
		boxShadow: "rgba(0, 0, 0, 0.4)",
		hoverShadow: "rgba(0, 0, 0, 0.55)",
		iconBg: "rgba(255, 178, 36, 0.1)",
		borderColor: "rgba(243, 238, 230, 0.1)",
	},
};

const lightPalette = {
	primary: {
		main: "#1A1322",
		light: "#4A3F58",
		dark: "#FFFFFF",
		contrastText: "#FFFFFF",
	},
	secondary: {
		main: "#2A1F3A",
		light: "#E6E0F0",
		dark: "#1D1528",
		contrastText: "#FFFFFF",
	},
	accent: {
		main: "#B35F00",
		light: "#D17400",
		dark: "#8F4B00",
		contrastText: "#FFFFFF",
	},
	blue: { main: "#4B5BD6", light: "#7381EA", dark: "#3541A8" },
	red: { main: "#D6294A", light: "#E85C77", dark: "#A81C37" },
	green: { main: "#1E8E6A", light: "#35B189", dark: "#146B4F" },
	greyAccent: { main: "#1A1322" },
	error: { main: "#D6294A" },
	warning: { main: "#B35F00" },
	success: { main: "#1E8E6A" },
	info: { main: "#4B5BD6" },
	background: { default: "#F4F2F8", paper: "#FFFFFF" },
	text: {
		primary: "#1A1322",
		secondary: "#5E5469",
		disabled: "#9A91A6",
	},
	divider: "rgba(26, 19, 34, 0.12)",
	stats: {
		boxShadow: "rgba(26, 19, 34, 0.08)",
		hoverShadow: "rgba(26, 19, 34, 0.16)",
		iconBg: "rgba(179, 95, 0, 0.1)",
		borderColor: "rgba(26, 19, 34, 0.12)",
	},
};

const displayStack = "var(--font-display), Arial, sans-serif";
const bodyStack = "var(--font-body), Arial, sans-serif";

const shadows = Array.from({ length: 25 }, (_, level) =>
	level === 0
		? "none"
		: `0 ${Math.ceil(level / 2)}px ${level * 2 + 4}px rgba(8, 4, 16, ${Math.min(0.1 + level * 0.012, 0.4)})`,
) as Shadows;

export const theme = createTheme({
	cssVariables: {
		colorSchemeSelector: "class",
	},
	colorSchemes: {
		light: { palette: lightPalette },
		dark: { palette: darkPalette },
	},
	shape: { borderRadius: 12 },
	breakpoints: {
		values: { xs: 0, sm: 600, md: 900, nav: 1080, lg: 1200, xl: 1536 },
	},
	shadows,
	typography: {
		fontFamily: bodyStack,
		fontSize: 14,
		h1: {
			fontFamily: displayStack,
			fontWeight: 700,
			fontSize: "clamp(2.5rem, 1.6rem + 4vw, 4.5rem)",
			lineHeight: 1.02,
			letterSpacing: "-0.035em",
		},
		h2: {
			fontFamily: displayStack,
			fontWeight: 700,
			fontSize: "clamp(1.85rem, 1.3rem + 2.4vw, 2.75rem)",
			lineHeight: 1.08,
			letterSpacing: "-0.03em",
		},
		h3: {
			fontFamily: displayStack,
			fontWeight: 650,
			fontSize: "clamp(1.4rem, 1.1rem + 1.2vw, 1.9rem)",
			lineHeight: 1.15,
			letterSpacing: "-0.025em",
		},
		h4: {
			fontFamily: displayStack,
			fontWeight: 650,
			fontSize: "clamp(1.2rem, 1rem + 0.8vw, 1.5rem)",
			lineHeight: 1.2,
			letterSpacing: "-0.02em",
		},
		h5: {
			fontFamily: displayStack,
			fontWeight: 600,
			fontSize: "clamp(1.05rem, 0.95rem + 0.4vw, 1.25rem)",
			lineHeight: 1.25,
			letterSpacing: "-0.015em",
		},
		h6: {
			fontFamily: displayStack,
			fontWeight: 600,
			fontSize: "1rem",
			lineHeight: 1.3,
			letterSpacing: "-0.01em",
		},
		subtitle1: { fontWeight: 600, fontSize: "1rem" },
		subtitle2: { fontWeight: 600, fontSize: "0.875rem" },
		body1: { fontSize: "1rem", lineHeight: 1.65 },
		body2: { fontSize: "0.9rem", lineHeight: 1.6 },
		button: {
			fontFamily: bodyStack,
			fontWeight: 600,
			fontSize: "0.9rem",
			letterSpacing: "0.005em",
			textTransform: "none",
		},
		caption: { fontSize: "0.78rem", lineHeight: 1.5 },
	},
	components: {
		MuiCssBaseline: {
			styleOverrides: (theme) => ({
				html: {
					WebkitFontSmoothing: "antialiased",
					MozOsxFontSmoothing: "grayscale",
				},
				body: {
					backgroundColor: theme.vars.palette.background.default,
					backgroundImage: `radial-gradient(900px 520px at 88% -8%, ${alpha(marqueeGold, 0.07)}, transparent 70%), radial-gradient(800px 600px at -10% 40%, ${alpha("#7A3FD1", 0.08)}, transparent 70%)`,
					backgroundAttachment: "fixed",
					...theme.applyStyles("light", {
						backgroundImage: `radial-gradient(900px 520px at 88% -8%, ${alpha(marqueeGold, 0.16)}, transparent 70%), radial-gradient(800px 600px at -10% 40%, ${alpha("#7A3FD1", 0.08)}, transparent 70%)`,
					}),
				},
				"::selection": {
					backgroundColor: marqueeGold,
					color: inkOnGold,
				},
				"*:focus-visible": {
					outline: `2px solid ${theme.vars.palette.accent.main}`,
					outlineOffset: 2,
				},
				"::-webkit-scrollbar": { width: 10, height: 10 },
				"::-webkit-scrollbar-track": { background: "transparent" },
				"::-webkit-scrollbar-thumb": {
					backgroundColor: alpha("#8C7FA3", 0.4),
					borderRadius: 999,
					border: "2px solid transparent",
					backgroundClip: "content-box",
				},
				"::-webkit-scrollbar-thumb:hover": {
					backgroundColor: alpha(marqueeGold, 0.7),
					backgroundClip: "content-box",
				},
				"@media (prefers-reduced-motion: reduce)": {
					"*, *::before, *::after": {
						animationDuration: "0.01ms !important",
						animationIterationCount: "1 !important",
						transitionDuration: "0.01ms !important",
						scrollBehavior: "auto !important",
					},
				},
			}),
		},
		MuiButtonBase: {
			defaultProps: {
				disableRipple: true,
				disableTouchRipple: true,
			},
		},
		MuiButton: {
			defaultProps: {
				disableRipple: true,
				disableFocusRipple: true,
				disableTouchRipple: true,
				disableElevation: true,
			},
			styleOverrides: {
				root: ({ theme }) => ({
					borderRadius: 999,
					paddingInline: theme.spacing(2.5),
					paddingBlock: theme.spacing(1),
					textTransform: "none",
					fontWeight: 600,
					transition:
						"background-color 200ms ease, color 200ms ease, border-color 200ms ease, transform 200ms ease, box-shadow 200ms ease",
					"&:active": { transform: "scale(0.98)" },
				}),
				sizeSmall: ({ theme }) => ({
					paddingInline: theme.spacing(1.75),
					paddingBlock: theme.spacing(0.5),
				}),
				sizeLarge: ({ theme }) => ({
					paddingInline: theme.spacing(3.5),
					paddingBlock: theme.spacing(1.4),
					fontSize: "1rem",
				}),
				outlined: ({ theme }) => ({
					borderColor: theme.vars.palette.divider,
					borderWidth: 1,
					"&:hover": {
						borderWidth: 1,
						backgroundColor: alpha(marqueeGold, 0.08),
					},
				}),
			},
			variants: [
				{
					props: { variant: "contained", color: "secondary" },
					style: {
						"&:hover": { filter: "brightness(1.15)" },
					},
				},
				{
					props: { variant: "contained", color: "primary" },
					style: ({ theme }) => ({
						backgroundColor: marqueeGold,
						backgroundImage: `linear-gradient(180deg, ${marqueeGoldSoft} 0%, ${marqueeGold} 100%)`,
						color: inkOnGold,
						boxShadow: `0 6px 20px ${alpha(marqueeGold, 0.28)}`,
						"&:hover": {
							backgroundColor: marqueeGold,
							backgroundImage: `linear-gradient(180deg, #FFD88A 0%, ${marqueeGoldSoft} 100%)`,
							boxShadow: `0 10px 28px ${alpha(marqueeGold, 0.4)}`,
							transform: "translateY(-1px)",
						},
						"&.Mui-disabled": {
							backgroundImage: "none",
							boxShadow: "none",
							backgroundColor:
								theme.vars.palette.action.disabledBackground,
						},
					}),
				},
				{
					props: { variant: "outlined", color: "primary" },
					style: ({ theme }) => ({
						color: theme.vars.palette.text.primary,
						borderColor: alpha("#A79DB4", 0.45),
						"&:hover": {
							borderColor: theme.vars.palette.accent.main,
							color: theme.vars.palette.accent.main,
						},
					}),
				},
				{
					props: { variant: "text", color: "primary" },
					style: ({ theme }) => ({
						color: theme.vars.palette.text.primary,
						"&:hover": {
							backgroundColor: alpha(marqueeGold, 0.1),
							color: theme.vars.palette.accent.main,
						},
					}),
				},
			],
		},
		MuiIconButton: {
			defaultProps: {
				disableRipple: true,
				disableFocusRipple: true,
				disableTouchRipple: true,
			},
			styleOverrides: {
				root: {
					transition:
						"background-color 200ms ease, color 200ms ease, transform 200ms ease",
					"&:hover": { backgroundColor: alpha(marqueeGold, 0.12) },
				},
			},
		},
		MuiListItemButton: {
			defaultProps: {
				disableRipple: true,
				disableTouchRipple: true,
			},
			styleOverrides: {
				root: { borderRadius: 10 },
			},
		},
		MuiTab: {
			defaultProps: {
				disableRipple: true,
				disableFocusRipple: true,
				disableTouchRipple: true,
			},
			styleOverrides: {
				root: {
					textTransform: "none",
					fontWeight: 600,
					fontSize: "0.95rem",
					minHeight: 44,
				},
			},
		},
		MuiTabs: {
			styleOverrides: {
				indicator: ({ theme }) => ({
					height: 3,
					borderRadius: 3,
					backgroundColor: theme.vars.palette.accent.main,
				}),
			},
		},
		MuiPaper: {
			defaultProps: { elevation: 0 },
			styleOverrides: {
				root: ({ theme }) => ({
					backgroundImage: "none",
					border: `1px solid ${theme.vars.palette.divider}`,
				}),
				rounded: { borderRadius: 16 },
			},
		},
		MuiCard: {
			styleOverrides: {
				root: ({ theme }) => ({
					borderRadius: 16,
					border: `1px solid ${theme.vars.palette.divider}`,
					backgroundImage: "none",
				}),
			},
		},
		MuiAppBar: {
			defaultProps: { elevation: 0, color: "transparent" },
			styleOverrides: {
				root: {
					backgroundImage: "none",
					border: 0,
				},
			},
		},
		MuiDrawer: {
			styleOverrides: {
				paper: ({ theme }) => ({
					border: 0,
					borderRight: `1px solid ${theme.vars.palette.divider}`,
				}),
			},
		},
		MuiDialog: {
			styleOverrides: {
				paper: ({ theme }) => ({
					borderRadius: 24,
					border: `1px solid ${theme.vars.palette.divider}`,
					boxShadow: "0 40px 120px rgba(5, 2, 12, 0.6)",
				}),
				root: {
					"& .MuiBackdrop-root": {
						backgroundColor: "rgba(8, 5, 14, 0.72)",
						backdropFilter: "blur(6px)",
					},
				},
			},
		},
		MuiMenu: {
			styleOverrides: {
				paper: ({ theme }) => ({
					borderRadius: 14,
					marginTop: 8,
					border: `1px solid ${theme.vars.palette.divider}`,
					boxShadow: "0 24px 60px rgba(5, 2, 12, 0.45)",
				}),
			},
		},
		MuiMenuItem: {
			styleOverrides: {
				root: ({ theme }) => ({
					borderRadius: 8,
					marginInline: 6,
					"&:hover": {
						backgroundColor: alpha(marqueeGold, 0.1),
					},
					"&.Mui-selected": {
						backgroundColor: alpha(marqueeGold, 0.16),
						color: theme.vars.palette.accent.main,
					},
				}),
			},
		},
		MuiTooltip: {
			styleOverrides: {
				tooltip: {
					backgroundColor: "#0D0A12",
					color: "#F3EEE6",
					border: "1px solid rgba(243, 238, 230, 0.12)",
					borderRadius: 8,
					fontSize: "0.78rem",
					padding: "6px 10px",
				},
				arrow: { color: "#0D0A12" },
			},
		},
		MuiChip: {
			styleOverrides: {
				root: {
					borderRadius: 999,
					fontWeight: 600,
				},
			},
		},
		MuiOutlinedInput: {
			styleOverrides: {
				root: ({ theme }) => ({
					borderRadius: 14,
					backgroundColor: alpha("#8C7FA3", 0.08),
					transition:
						"background-color 200ms ease, box-shadow 200ms ease",
					"& .MuiOutlinedInput-notchedOutline": {
						borderColor: theme.vars.palette.divider,
					},
					"&:hover .MuiOutlinedInput-notchedOutline": {
						borderColor: alpha("#A79DB4", 0.5),
					},
					"&.Mui-focused": {
						backgroundColor: alpha("#8C7FA3", 0.12),
						boxShadow: `0 0 0 4px ${alpha(marqueeGold, 0.16)}`,
					},
					"&.Mui-focused .MuiOutlinedInput-notchedOutline": {
						borderColor: theme.vars.palette.accent.main,
						borderWidth: 1,
					},
				}),
			},
		},
		MuiFilledInput: {
			defaultProps: { disableUnderline: true },
			styleOverrides: {
				root: ({ theme }) => ({
					borderRadius: 14,
					border: `1px solid ${theme.vars.palette.divider}`,
					backgroundColor: alpha("#8C7FA3", 0.08),
					transition:
						"background-color 200ms ease, box-shadow 200ms ease, border-color 200ms ease",
					"&:hover": {
						backgroundColor: alpha("#8C7FA3", 0.12),
						borderColor: alpha("#A79DB4", 0.5),
					},
					"&.Mui-focused": {
						backgroundColor: alpha("#8C7FA3", 0.12),
						borderColor: theme.vars.palette.accent.main,
						boxShadow: `0 0 0 4px ${alpha(marqueeGold, 0.16)}`,
					},
					"&.Mui-disabled": {
						backgroundColor: alpha("#8C7FA3", 0.04),
					},
				}),
			},
		},
		MuiInputLabel: {
			styleOverrides: {
				root: ({ theme }) => ({
					"&.Mui-focused": { color: theme.vars.palette.accent.main },
				}),
			},
		},
		MuiCheckbox: {
			defaultProps: { disableRipple: true },
			styleOverrides: {
				root: ({ theme }) => ({
					"&.Mui-checked": { color: theme.vars.palette.accent.main },
				}),
			},
		},
		MuiRadio: {
			defaultProps: { disableRipple: true },
			styleOverrides: {
				root: ({ theme }) => ({
					"&.Mui-checked": { color: theme.vars.palette.accent.main },
				}),
			},
		},
		MuiSwitch: {
			defaultProps: { disableRipple: true },
			styleOverrides: {
				switchBase: ({ theme }) => ({
					"&.Mui-checked": { color: theme.vars.palette.accent.main },
					"&.Mui-checked + .MuiSwitch-track": {
						backgroundColor: theme.vars.palette.accent.main,
					},
				}),
			},
		},
		MuiPagination: {
			defaultProps: { shape: "rounded" },
		},
		MuiPaginationItem: {
			styleOverrides: {
				root: {
					borderRadius: 12,
					fontWeight: 600,
					"&.Mui-selected": {
						backgroundColor: marqueeGold,
						color: inkOnGold,
						"&:hover": { backgroundColor: marqueeGoldSoft },
					},
					"&:hover": {
						backgroundColor: alpha(marqueeGold, 0.12),
					},
				},
			},
		},
		MuiLinearProgress: {
			styleOverrides: {
				root: { borderRadius: 999, height: 6 },
			},
		},
		MuiSkeleton: {
			defaultProps: { animation: "wave" },
			styleOverrides: {
				root: {
					backgroundColor: alpha("#8C7FA3", 0.16),
					borderRadius: 12,
				},
			},
		},
		MuiAccordion: {
			defaultProps: { disableGutters: true, elevation: 0 },
			styleOverrides: {
				root: ({ theme }) => ({
					backgroundImage: "none",
					border: `1px solid ${theme.vars.palette.divider}`,
					borderRadius: 16,
					"&:before": { display: "none" },
					"&:not(:last-child)": { marginBottom: 12 },
					"&.Mui-expanded": {
						borderColor: alpha(marqueeGold, 0.45),
					},
				}),
			},
		},
		MuiAlert: {
			styleOverrides: {
				root: { borderRadius: 14 },
			},
		},
	},
});
