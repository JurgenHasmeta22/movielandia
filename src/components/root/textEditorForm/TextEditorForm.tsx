"use client";

import { Box } from "@mui/material";
import TextEditor from "../textEditor/TextEditor";
import { TextEditorButtons } from "../textEditorButtons/TextEditorButtons";
import { useState } from "react";

interface ITextEditorFormProps {
    review: string;
    rating: number | null;
    isEditMode: boolean;
    textEditorRef: React.MutableRefObject<any>;
    setIsEditMode: React.Dispatch<React.SetStateAction<boolean>>;
    setRating: React.Dispatch<React.SetStateAction<number | null>>;
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
    setReview: React.Dispatch<React.SetStateAction<string>>;
    onSubmitReview(): Promise<void>;
    onSubmitUpdateReview(): Promise<void>;
    handleFocusReview: () => void;
}

export function TextEditorForm({
    review,
    setReview,
    textEditorRef,
    rating,
    setIsEditMode,
    onSubmitReview,
    handleFocusReview,
    setRating,
    isEditMode,
    setOpen,
    onSubmitUpdateReview,
}: ITextEditorFormProps) {
    const [isSubmitting, setIsSubmitting] = useState(false);

    return (
        <Box marginTop={4} px={4}>
            <Box marginBottom={1}>
                <TextEditor
                    value={review}
                    onChange={setReview}
                    ref={textEditorRef}
                    rating={rating}
                    setRating={setRating}
                    isDisabled={isSubmitting}
                    type="review"
                />
            </Box>
            <TextEditorButtons
                isEditMode={isEditMode}
                setOpen={setOpen}
                setIsEditMode={setIsEditMode}
                setReview={setReview}
                onSubmitReview={onSubmitReview}
                handleFocusReview={handleFocusReview}
                onSubmitUpdateReview={onSubmitUpdateReview}
                setIsSubmitting={setIsSubmitting}
            />
        </Box>
    );
}

export default TextEditorForm;
