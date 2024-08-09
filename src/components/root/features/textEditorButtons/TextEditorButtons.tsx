"use client";

import { WarningOutlined, CheckOutlined } from "@mui/icons-material";
import { Box, Button, CssVarsTheme, Typography, useTheme } from "@mui/material";
import * as CONSTANTS from "@/constants/Constants";
import { useModal } from "@/providers/ModalProvider";

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

    const theme: CssVarsTheme = useTheme();

    return (
        <>
            {!isEditMode ? (
                <Box display={"flex"} justifyContent={"end"} marginTop={2}>
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
                            backgroundColor: theme.vars.palette.secondary["900"],
                            color: theme.vars.palette.secondary["700"],
                            "&:hover": {
                                backgroundColor: theme.vars.palette.secondary["100"],
                                color: theme.vars.palette.secondary["400"],
                            },
                        }}
                    >
                        <Typography component={"span"}>Submit Review</Typography>
                    </Button>
                </Box>
            ) : (
                <Box
                    display={"flex"}
                    flexDirection={"row"}
                    columnGap={1}
                    justifyContent={"end"}
                    alignItems={"center"}
                    marginTop={2}
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
                                        color: "secondary",
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
                                        color: "secondary",
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
                        color="secondary"
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
