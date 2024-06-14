import { Box } from "@mui/material";

interface ITextEditorForm {
    review: string;
    rating: number | null;
}

const TextEditorForm = ({ review, rating }: ITextEditorForm) => {
    return (
        <Box marginTop={4}>
            <Box marginBottom={1}>{/* <TextEditor value={review} rating={rating} /> */}</Box>
            {/* <TextEditorButtons /> */}
        </Box>
    );
};

export default TextEditorForm;
