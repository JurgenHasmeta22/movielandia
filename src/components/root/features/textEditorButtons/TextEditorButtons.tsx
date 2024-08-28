"use client";

import { WarningOutlined, CheckOutlined } from "@mui/icons-material";
import { Button, Typography } from "@mui/material";
import * as CONSTANTS from "@/constants/Constants";
import { useModal } from "@/providers/ModalProvider";
import type {} from "@mui/material/themeCssVarsAugmentation";
import { useTheme } from "@mui/material-pigment-css";
import Box from "@mui/material-pigment-css/Box";

interface ITextEditorButtons {
    isEditMode: boolean;
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
    setIsEditMode: React.Dispatch<React.SetStateAction<boolean>>;
    setReview: React.Dispatch<React.SetStateAction<string>>;
    onSubmitReview(): Promise<void>;
    handleFocusReview: () => void;
    onSubmitUpdateReview(): Promise<void>;
}

export function TextEditorButtons({
    isEditMode,
    onSubmitReview,
    setOpen,
    setIsEditMode,
    setReview,
    handleFocusReview,
    onSubmitUpdateReview,
}: ITextEditorButtons) {
    const { openModal } = useModal();

    const theme = useTheme();

    return (
        <>
            {!isEditMode ? (
                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "end",
                        marginTop: 2,
                    }}
                >
                    <Button
                        onClick={onSubmitReview}
                        variant="contained"
                        sx={{
                            display: "flex",
                            placeSelf: "end",
                            fontSize: 18,
                            fontWeight: 900,
                            padding: 1.5,
                            textTransform: "capitalize",
                            border: "none",
                            backgroundColor: theme.vars.palette.green.light,
                            color: theme.vars.palette.primary.dark,
                            "&:hover": {
                                backgroundColor: theme.vars.palette.green.main,
                                color: theme.vars.palette.greyAccent.main,
                            },
                        }}
                    >
                        <Typography component={"span"}>Submit Review</Typography>
                    </Button>
                </Box>
            ) : (
                <Box
                    sx={{
                        display: "flex",
                        flexDirection: "row",
                        columnGap: 1,
                        justifyContent: "end",
                        alignItems: "center",
                        marginTop: 2,
                    }}
                >
                    <Button
                        onClick={() => {
                            openModal({
                                onClose: () => setOpen(false),
                                title: "Discard Changes",
                                actions: [
                                    {
                                        label: CONSTANTS.MODAL__DELETE__NO,
                                        onClick: () => setOpen(false),
                                        color: "error",
                                        variant: "contained",
                                        sx: {
                                            bgcolor: "#ff5252",
                                        },
                                        icon: <WarningOutlined />,
                                    },
                                    {
                                        label: CONSTANTS.MODAL__DELETE__YES,
                                        onClick: async () => {
                                            setIsEditMode(false);
                                            setReview("");
                                            handleFocusReview();
                                        },
                                        type: "submit",
                                        color: "success",
                                        variant: "contained",
                                        sx: {
                                            bgcolor: "#30969f",
                                        },
                                        icon: <CheckOutlined />,
                                    },
                                ],
                                subTitle: "Are you sure that you want to discard changes on this review ?",
                            });
                        }}
                        color="error"
                        variant="contained"
                        sx={{
                            display: "flex",
                            placeSelf: "end",
                            fontSize: 18,
                            fontWeight: 900,
                            padding: 1.5,
                            textTransform: "capitalize",
                        }}
                    >
                        <Typography component={"span"}>Discard Changes</Typography>
                    </Button>
                    <Button
                        onClick={onSubmitUpdateReview}
                        color="success"
                        variant="contained"
                        sx={{
                            display: "flex",
                            placeSelf: "end",
                            fontSize: 18,
                            fontWeight: 900,
                            padding: 1.5,
                            textTransform: "capitalize",
                        }}
                    >
                        <Typography component={"span"}>Save Changes</Typography>
                    </Button>
                </Box>
            )}
        </>
    );
}

export default TextEditorButtons;
