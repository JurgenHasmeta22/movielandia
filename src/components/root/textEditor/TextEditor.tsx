"use client";

import dynamic from "next/dynamic";
import React, { useEffect } from "react";
import { useTheme } from "@mui/material/styles";
import Rating from "@mui/material/Rating";
import Box from "@mui/material/Box";
import { Typography } from "@mui/material";
import "react-quill-new/dist/quill.snow.css";

const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false });

interface ITextEditorProps {
    value: string;
    ref: any;
    rating: number | null;
    setRating: React.Dispatch<React.SetStateAction<number | null>>;
    onChange: (value: string) => void;
    isDisabled?: boolean;
}

const modules = {
    toolbar: [
        [{ header: "1" }, { header: "2" }, { font: [] }],
        [{ size: [] }],
        ["bold", "italic", "underline", "strike", "blockquote"],
        [{ list: "ordered" }, { list: "bullet" }],
        ["link", "image", "video"],
        ["clean"],
    ],
};

const formats = [
    "header",
    "font",
    "size",
    "bold",
    "italic",
    "underline",
    "strike",
    "blockquote",
    "list",
    // "bullet", this broke the component
    "link",
    "image",
    "video",
];

const TextEditor: React.FC<ITextEditorProps> = ({ value, onChange, rating, setRating, ref, isDisabled }) => {
    const theme = useTheme();

    useEffect(() => {
        const resizeImages = () => {
            const quillEditor = ref?.current?.getEditor?.();

            if (quillEditor) {
                const images = quillEditor.container.querySelectorAll("img");

                images.forEach((img: HTMLImageElement) => {
                    img.style.maxWidth = "50%";
                    img.style.maxHeight = "auto";
                });
            }
        };

        const editorInstance = ref?.current?.getEditor?.();

        if (editorInstance) {
            resizeImages();
            editorInstance.on("text-change", resizeImages);
        }

        return () => {
            if (editorInstance) {
                editorInstance.off("text-change", resizeImages);
            }
        };
    }, [ref, value]);

    return (
        <Box sx={{ opacity: isDisabled ? 0.7 : 1, pointerEvents: isDisabled ? "none" : "auto" }}>
            <Box
                sx={{
                    ".ql-toolbar": {
                        backgroundColor: theme.vars.palette.secondary.light,
                        border: `1px solid ${theme.vars.palette.primary.light}`,
                        borderTopLeftRadius: "8px",
                        borderTopRightRadius: "8px",
                        "& .ql-stroke": {
                            stroke: theme.vars.palette.primary.main,
                        },
                        "& .ql-fill": {
                            fill: theme.vars.palette.primary.main,
                        },
                        "& .ql-picker": {
                            color: theme.vars.palette.primary.main,
                        },
                        "& .ql-picker-options": {
                            backgroundColor: theme.vars.palette.secondary.light,
                            border: `1px solid ${theme.vars.palette.primary.light}`,
                        },
                        "& button:hover .ql-stroke": {
                            stroke: theme.vars.palette.blue.main,
                        },
                        "& button:hover .ql-fill": {
                            fill: theme.vars.palette.blue.main,
                        },
                        "& .ql-picker-label:hover": {
                            color: theme.vars.palette.blue.main,
                        },
                    },
                    ".ql-container": {
                        backgroundColor: theme.vars.palette.secondary.light,
                        border: `1px solid ${theme.vars.palette.primary.light}`,
                        borderBottomLeftRadius: "8px",
                        borderBottomRightRadius: "8px",
                        fontSize: "16px",
                        minHeight: "200px",
                    },
                    ".ql-editor": {
                        color: theme.vars.palette.primary.main,
                        padding: "20px",
                        "&.ql-blank::before": {
                            color: theme.vars.palette.primary.main,
                            opacity: 0.6,
                            fontStyle: "normal",
                            fontSize: "16px",
                            left: "20px",
                            right: "20px",
                        },
                        "p, h1, h2, h3": {
                            color: theme.vars.palette.primary.main,
                            margin: "0 0 0.5em 0",
                        },
                        h1: { fontSize: "2em" },
                        h2: { fontSize: "1.5em" },
                        h3: { fontSize: "1.17em" },
                        a: {
                            color: theme.vars.palette.blue.main,
                            textDecoration: "underline",
                        },
                        blockquote: {
                            borderLeft: `4px solid ${theme.vars.palette.primary.main}`,
                            color: theme.vars.palette.primary.main,
                            opacity: 0.9,
                            margin: "0.5em 0",
                            padding: "0.5em 1em",
                        },
                        ul: {
                            color: theme.vars.palette.primary.main,
                        },
                        ol: {
                            color: theme.vars.palette.primary.main,
                        },
                    },
                }}
            >
                <ReactQuill
                    theme="snow"
                    value={value}
                    onChange={onChange}
                    modules={modules}
                    formats={formats}
                    readOnly={isDisabled}
                    // @ts-expect-error - Quill does not accept ref as a prop
                    ref={ref}
                />
            </Box>
            <Box
                sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "flex-start",
                    mt: 2,
                }}
            >
                <Typography
                    variant="body2"
                    fontSize={16}
                    fontWeight={700}
                    sx={{
                        mr: 1,
                        color: theme.vars.palette.primary.main,
                    }}
                >
                    {rating?.toFixed(1)}
                </Typography>
                <Rating
                    name="review-rating"
                    value={rating}
                    onChange={(event, newValue) => {
                        setRating(newValue);
                    }}
                    size="medium"
                    max={10}
                    precision={0.5}
                    readOnly={isDisabled}
                />
            </Box>
        </Box>
    );
};

export default TextEditor;
