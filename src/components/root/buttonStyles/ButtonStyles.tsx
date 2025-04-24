"use client";

import { SxProps, Theme } from "@mui/material";

/**
 * Utility function to preserve the original text transformation for buttons
 * Use this when you need to override the global capitalization setting
 */
export const preserveTextTransform: SxProps<Theme> = {
	textTransform: "none",
};

/**
 * Utility function to explicitly set capitalized text transformation for buttons
 * This is redundant with the global setting but can be used for clarity
 */
export const capitalizeTextTransform: SxProps<Theme> = {
	textTransform: "capitalize",
};

/**
 * Utility function to set uppercase text transformation for buttons
 */
export const uppercaseTextTransform: SxProps<Theme> = {
	textTransform: "uppercase",
};
