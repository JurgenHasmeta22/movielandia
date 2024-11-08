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

const TextEditor: React.FC<ITextEditorProps> = ({ value, onChange, rating, setRating, ref }) => {
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
        <Box>
            <ReactQuill
                theme="snow"
                value={value}
                onChange={onChange}
                modules={modules}
                formats={formats}
                // @ts-expect-error - Quill does not accept ref as a prop
                ref={ref}
                style={{
                    backgroundColor: theme.vars.palette.blue.dark,
                    color: theme.vars.palette.primary.light,
                    marginBottom: "10px",
                }}
            />
            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "flex-start" }}>
                <Typography variant="body2" fontSize={16} fontWeight={700} sx={{ mr: 1 }}>
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
};

export default TextEditor;
