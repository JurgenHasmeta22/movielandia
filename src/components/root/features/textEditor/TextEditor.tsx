"use client";

import React, { forwardRef, useEffect } from "react";
import ReactQuill from "react-quill";
import Rating from "@mui/material/Rating";
import { Typography } from "@mui/material";
import "react-quill/dist/quill.snow.css";
import { useTheme } from "@mui/material-pigment-css";
import Box from "@mui/material-pigment-css/Box";

interface ITextEditorProps {
    value: string;
    ref: any;
    rating: number | null;
    setRating: React.Dispatch<React.SetStateAction<number | null>>;
    onChange: (value: string) => void;
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
    "bullet",
    "link",
    "image",
    "video",
];

const TextEditor: React.FC<ITextEditorProps> = forwardRef(({ value, onChange, rating, setRating }, ref) => {
    const theme = useTheme();

    useEffect(() => {
        const resizeImages = () => {
            // @ts-expect-error editorError
            const quillEditor = ref?.current?.getEditor?.();

            if (quillEditor) {
                const images = quillEditor.container.querySelectorAll("img");

                images.forEach((img: HTMLImageElement) => {
                    img.style.maxWidth = "50%";
                    img.style.maxHeight = "auto";
                });
            }
        };

        // @ts-expect-error instanceError
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
        <Box>
            <ReactQuill
                theme="snow"
                value={value}
                onChange={onChange}
                modules={modules}
                formats={formats}
                // @ts-expect-error refError
                ref={ref}
                style={{
                    backgroundColor: theme.vars.palette.blue.dark,
                    color: theme.vars.palette.primary.light,
                    marginBottom: "10px",
                }}
            />
            <Box
                sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "flex-start",
                }}
            >
                <Typography variant="body2" fontSize={16} fontWeight={700} sx={{ marginRight: 1 }}>
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
                />
            </Box>
        </Box>
    );
});

TextEditor.displayName = "TextEditorComponent";

export default TextEditor;
