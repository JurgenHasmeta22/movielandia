"use client";

import { Box } from "@mui/material";
import { useEffect, useState } from "react";

interface RichTextDisplayProps {
    content: string;
    type?: "post" | "topic" | "review" | "comment";
}

export default function RichTextDisplay({ content, type = "post" }: RichTextDisplayProps) {
    const [processedContent, setProcessedContent] = useState(content);

    useEffect(() => {
        // Regular expression to find @username mentions
        const mentionRegex = /(@\w+)/g;

        const highlightedContent = content.replace(
            mentionRegex,
            (match, username) => {
                const usernameWithoutAt = username.substring(1);
                return `<a href="/users/search?username=${usernameWithoutAt}" style="color: #1976d2; font-weight: bold; text-decoration: none; display: inline-block; margin-right: 4px;">${match}</a>`;
            }
        );

        setProcessedContent(highlightedContent);
    }, [content]);
    return (
        <Box
            className="rich-text-display"
            sx={(theme) => ({
                fontSize: type === "topic" ? "1rem" : "0.95rem",
                lineHeight: 1.6,
                "& .ql-editor": {
                    padding: 0,
                },
                "& p": {
                    margin: "0.5em 0",
                },
                "& h1, & h2, & h3, & h4, & h5, & h6": {
                    marginTop: "0.75em",
                    marginBottom: "0.5em",
                    fontWeight: 600,
                    lineHeight: 1.2,
                },
                "& h1": {
                    fontSize: "1.75rem",
                },
                "& h2": {
                    fontSize: "1.5rem",
                },
                "& h3": {
                    fontSize: "1.25rem",
                },
                "& h4": {
                    fontSize: "1.125rem",
                },
                "& ul, & ol": {
                    paddingLeft: "1.5em",
                    marginBottom: "0.5em",
                },
                "& li": {
                    marginBottom: "0.25em",
                },
                "& a": {
                    color: theme.vars.palette.primary.main,
                    textDecoration: "underline",
                    "&:hover": {
                        textDecoration: "none",
                    },
                },
                "& blockquote": {
                    borderLeft: `4px solid ${theme.vars.palette.divider}`,
                    paddingLeft: "1em",
                    margin: "1em 0",
                    color: theme.vars.palette.text.secondary,
                    backgroundColor: theme.vars.palette.background.default,
                    padding: "0.5em 1em",
                    borderRadius: "4px",
                },
                "& code": {
                    backgroundColor: theme.vars.palette.background.default,
                    padding: "0.2em 0.4em",
                    borderRadius: "3px",
                    fontFamily: "monospace",
                },
                "& pre": {
                    backgroundColor: theme.vars.palette.background.default,
                    padding: "1em",
                    borderRadius: "4px",
                    overflow: "auto",
                    "& code": {
                        backgroundColor: "transparent",
                        padding: 0,
                    },
                },
                "& img": {
                    maxWidth: "100%",
                    height: "auto",
                    borderRadius: "4px",
                },
                "& table": {
                    borderCollapse: "collapse",
                    width: "100%",
                    marginBottom: "1em",
                },
                "& th, & td": {
                    border: `1px solid ${theme.vars.palette.divider}`,
                    padding: "0.5em",
                    textAlign: "left",
                },
                "& th": {
                    backgroundColor: theme.vars.palette.background.default,
                    fontWeight: 600,
                },
            })}
            dangerouslySetInnerHTML={{ __html: processedContent }}
        />
    );
}
