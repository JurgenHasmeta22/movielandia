"use client";

import React, { useEffect } from "react";
import { useTheme } from "@mui/material/styles";
import Rating from "@mui/material/Rating";
import Box from "@mui/material/Box";
import { Typography } from "@mui/material";
import dynamic from "next/dynamic";
import "react-quill-new/dist/quill.snow.css";
const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false });

interface ITextEditorProps {
	value: string;
	rating?: number | null;
	setRating?: React.Dispatch<React.SetStateAction<number | null>>;
	isDisabled?: boolean;
	type: string;
	onChange: (value: string) => void;
}

// Custom Blot for @mentions that are non-deletable and clickable
const configureMentionBlot = (Quill: any) => {
	const Embed = Quill.import("blots/embed");

	class MentionBlot extends Embed {
		static create(data: { username: string; userId?: number }) {
			const node = super.create();
			node.setAttribute("data-username", data.username);
			if (data.userId)
				node.setAttribute("data-userid", String(data.userId));
			node.setAttribute("contenteditable", "false");
			node.setAttribute("class", "mention-blot");

			// Create the link element
			const link = document.createElement("a");
			// Use userId if available, otherwise fallback to username
			const userId = data.userId || data.username;
			link.href = `/users/${userId}/${data.username}`;

			// Make sure it opens in a new tab
			link.setAttribute("target", "_blank");
			link.setAttribute("rel", "noopener noreferrer");
			link.textContent = `@${data.username}`;
			link.style.color = "#1976d2";
			link.style.fontWeight = "bold";
			link.style.textDecoration = "none";
			link.style.marginRight = "4px";
			link.style.cursor = "pointer";

			node.appendChild(link);
			return node;
		}

		static value(node: HTMLElement) {
			return {
				username: node.getAttribute("data-username"),
				userId: node.hasAttribute("data-userid")
					? Number(node.getAttribute("data-userid"))
					: undefined,
			};
		}
	}

	MentionBlot.blotName = "mention";
	MentionBlot.tagName = "span";

	Quill.register(MentionBlot);
};

const getModulesConfig = () => ({
	toolbar: [
		[{ header: [1, 2, 3, 4, 5, 6, false] }],
		[{ font: [] }],
		[{ size: ["small", false, "large", "huge"] }],
		["bold", "italic", "underline", "strike"],
		[{ color: [] }, { background: [] }],
		[{ align: ["", "center", "right", "justify"] }],
		[{ list: "ordered" }, { list: "bullet" }],
		[{ indent: "-1" }, { indent: "+1" }],
		[{ script: "sub" }, { script: "super" }],
		["blockquote", "code-block"],
		["link", "image", "video"],
		[{ direction: "rtl" }],
	],
	clipboard: {
		matchVisual: false,
	},
	keyboard: {
		bindings: {
			tab: false,
			"list autofill": true,
		},
	},
});

const formatsArray = [
	"header",
	"font",
	"size",
	"bold",
	"italic",
	"underline",
	"strike",
	"color",
	"background",
	"align",
	"list",
	"indent",
	"script",
	"blockquote",
	"code-block",
	"link",
	"image",
	"video",
	"direction",
	"mention", // Add mention format
];

const TextEditor = React.forwardRef<any, ITextEditorProps>(
	({ value, onChange, rating, setRating, isDisabled, type }, ref) => {
		const theme = useTheme();
		const formats = formatsArray;

		// Register the MentionBlot when the component mounts
		useEffect(() => {
			if (typeof window !== "undefined") {
				import("react-quill-new").then((module) => {
					const Quill = module.default.Quill;
					configureMentionBlot(Quill);
				});
			}
		}, []);

		return (
			<Box
				sx={{
					opacity: isDisabled ? 0.7 : 1,
					pointerEvents: isDisabled ? "none" : "auto",
				}}
			>
				<Box
					sx={{
						".ql-toolbar": {
							backgroundColor: (theme) =>
								theme.vars.palette.background.paper,
							border: (theme) =>
								`1px solid ${theme.vars.palette.divider}`,
							borderTopLeftRadius: "4px",
							borderTopRightRadius: "4px",
							"& .ql-stroke": {
								stroke: (theme) =>
									theme.vars.palette.text.secondary,
							},
							"& .ql-fill": {
								fill: (theme) =>
									theme.vars.palette.text.secondary,
							},
							"& .ql-picker": {
								color: (theme) =>
									theme.vars.palette.text.secondary,
							},
							"& .ql-picker-options": {
								backgroundColor: (theme) =>
									theme.vars.palette.background.paper,
								border: (theme) =>
									`1px solid ${theme.vars.palette.divider}`,
							},
							"& button:hover .ql-stroke": {
								stroke: (theme) =>
									theme.vars.palette.primary.main,
							},
							"& button:hover .ql-fill": {
								fill: (theme) =>
									theme.vars.palette.primary.main,
							},
							"& .ql-picker-label:hover": {
								color: theme.vars.palette.primary.main,
							},
							"& .ql-color .ql-picker-options": {
								padding: "5px",
								width: "152px",
							},
							"& .ql-color .ql-picker-item": {
								width: "16px",
								height: "16px",
								margin: "2px",
							},
							"& .ql-background .ql-picker-options": {
								padding: "5px",
								width: "152px",
							},
							"& .ql-background .ql-picker-item": {
								width: "16px",
								height: "16px",
								margin: "2px",
							},
							"& .ql-size .ql-picker-options": {
								minWidth: "100px",
							},
							"& .ql-align .ql-picker-options": {
								minWidth: "100px",
							},
						},
						".ql-container": {
							backgroundColor: (theme) =>
								theme.vars.palette.background.paper,
							border: (theme) =>
								`1px solid ${theme.vars.palette.divider}`,
							borderRadius: isDisabled ? "4px" : "0 0 4px 4px",
							borderTop: isDisabled
								? (theme) =>
										`1px solid ${theme.vars.palette.divider}`
								: "none",
							fontSize: "16px",
							minHeight: "250px",
						},
						".ql-editor": {
							color: (theme) => theme.vars.palette.text.primary,
							padding: "20px",
							"&.ql-blank::before": {
								content: '""',
								color: (theme) =>
									theme.vars.palette.text.disabled,
								opacity: 0,
								fontStyle: "normal",
								fontSize: "16px",
								left: "16px",
								right: "16px",
							},
							"p, h1, h2, h3": {
								color: (theme) =>
									theme.vars.palette.text.primary,
								margin: "0 0 0.5em 0",
							},
							h1: { fontSize: "2em" },
							h2: { fontSize: "1.5em" },
							h3: { fontSize: "1.17em" },
							a: {
								color: (theme) =>
									theme.vars.palette.primary.main,
								textDecoration: "underline",
							},
							".mention-blot": {
								display: "inline-block",
								backgroundColor: (theme) =>
									`${theme.vars.palette.primary.light}20`,
								borderRadius: "4px",
								padding: "0 4px",
								margin: "0 2px",
								cursor: "default",
								userSelect: "all",
							},
							blockquote: {
								borderLeft: (theme) =>
									`4px solid ${theme.vars.palette.divider}`,
								color: (theme) =>
									theme.vars.palette.text.secondary,
								backgroundColor: (theme) =>
									theme.vars.palette.background.default,
								opacity: 0.9,
								margin: "0.5em 0",
								padding: "0.5em 1em",
								borderRadius: "2px",
							},
							ul: {
								color: (theme) =>
									theme.vars.palette.text.primary,
							},
							ol: {
								color: (theme) =>
									theme.vars.palette.text.primary,
							},
							"& pre.ql-syntax": {
								backgroundColor: (theme) =>
									theme.vars.palette.background.default,
								color: (theme) =>
									theme.vars.palette.text.primary,
								padding: "1em",
								borderRadius: "4px",
								fontFamily: "monospace",
								fontSize: "14px",
								overflow: "auto",
							},
							"& sup": {
								fontSize: "0.75em",
								verticalAlign: "super",
							},
							"& sub": {
								fontSize: "0.75em",
								verticalAlign: "sub",
							},
							"&[dir='rtl']": {
								textAlign: "right",
							},
							"& .ql-indent-1": { paddingLeft: "3em" },
							"& .ql-indent-2": { paddingLeft: "6em" },
							"& .ql-indent-3": { paddingLeft: "9em" },
							"& .ql-indent-4": { paddingLeft: "12em" },
							"& .ql-indent-5": { paddingLeft: "15em" },
							"& .ql-align-center": { textAlign: "center" },
							"& .ql-align-right": { textAlign: "right" },
							"& .ql-align-justify": { textAlign: "justify" },
							wordWrap: "break-word",
							overflowWrap: "break-word",
							minWidth: "100%",
							whiteSpace: "pre-wrap",
						},
					}}
				>
					<ReactQuill
						theme="snow"
						value={value}
						onChange={onChange}
						modules={getModulesConfig()}
						formats={formats}
						readOnly={isDisabled}
						// @ts-expect-error ref
						ref={ref!}
					/>
				</Box>
				{type === "review" && (
					<Box
						sx={{
							display: "flex",
							alignItems: "center",
							justifyContent: "flex-start",
							mt: 2,
						}}
					>
						<Rating
							name="review-rating"
							value={rating}
							onChange={(_, newValue) => {
								setRating!(newValue);
							}}
							size="medium"
							max={10}
							precision={0.5}
							readOnly={isDisabled}
						/>
						<Typography
							variant="body2"
							fontSize={16}
							fontWeight={700}
							sx={{
								ml: 1,
								color: theme.vars.palette.primary.main,
							}}
						>
							{rating?.toFixed(1)}
						</Typography>
					</Box>
				)}
			</Box>
		);
	},
);

TextEditor.displayName = "TextEditor";
export default TextEditor;
