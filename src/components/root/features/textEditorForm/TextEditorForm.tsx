"use client";

import { Box } from "@mui/material";
import TextEditor from "../textEditor/TextEditor";
import { TextEditorButtons } from "../textEditorButtons/TextEditorButtons";

interface ITextEditorForm {
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
}: ITextEditorForm) {
    return (
        <Box marginTop={4} px={4}>
            <Box marginBottom={1}>
                <TextEditor
                    value={review}
                    onChange={setReview}
                    ref={textEditorRef}
                    rating={rating}
                    setRating={setRating}
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
            />
        </Box>
    );
}

export default TextEditorForm;
