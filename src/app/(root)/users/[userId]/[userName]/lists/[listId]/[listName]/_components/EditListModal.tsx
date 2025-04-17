"use client";

import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    FormHelperText,
    IconButton,
    Box,
    Typography,
    alpha,
    useTheme,
    InputAdornment,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import SaveIcon from "@mui/icons-material/Save";
import TitleIcon from "@mui/icons-material/Title";
import DescriptionIcon from "@mui/icons-material/Description";
import LockIcon from "@mui/icons-material/Lock";
import PublicIcon from "@mui/icons-material/Public";
import { updateList } from "@/actions/list/list.actions";
import { showToast } from "@/utils/helpers/toast";
import { listSchema, type ListFormData } from "@/schemas/list.schema";
import { useRouter } from "next/navigation";

interface EditListModalProps {
    open: boolean;
    onClose: () => void;
    listId: number;
    userId: number;
    initialValues: {
        name: string;
        description: string;
        isPrivate: boolean;
    };
}

export default function EditListModal({ open, onClose, listId, userId, initialValues }: EditListModalProps) {
    const router = useRouter();
    const [isPending, setIsPending] = useState(false);

    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useForm<ListFormData>({
        resolver: zodResolver(listSchema),
        defaultValues: initialValues,
    });

    const onSubmit = async (data: ListFormData) => {
        setIsPending(true);
        try {
            await updateList(listId, userId, {
                name: data.name,
                description: data.description,
                isPrivate: data.isPrivate,
            });

            showToast("success", "List updated successfully!");
            router.refresh(); // Refresh the page to show updated data
            onClose();
        } catch (error) {
            showToast("error", error instanceof Error ? error.message : "Failed to update list");
        } finally {
            setIsPending(false);
        }
    };

    const theme = useTheme();

    return (
        <Dialog
            open={open}
            onClose={onClose}
            fullWidth
            maxWidth="sm"
            PaperProps={{
                sx: {
                    borderRadius: 1,
                    bgcolor: "#1e2330", // Dark background matching the screenshot
                    boxShadow: 3,
                    overflow: "hidden",
                    "& .MuiDialogContent-root": {
                        p: 3,
                    },
                },
            }}
        >
            <DialogTitle
                sx={{
                    fontSize: "1.1rem",
                    fontWeight: 500,
                    bgcolor: "#2c3347", // Darker header background
                    color: "#fff",
                    py: 2,
                    px: 3,
                    borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
                }}
            >
                <Box sx={{ display: "flex", alignItems: "center" }}>
                    <SaveIcon sx={{ mr: 1.5, color: "#fff", fontSize: "1.2rem" }} />
                    <Typography variant="h6" component="span" fontWeight={500} fontSize="1.1rem">
                        Edit List
                    </Typography>
                </Box>
                <IconButton
                    aria-label="close"
                    onClick={onClose}
                    sx={{
                        position: "absolute",
                        right: 8,
                        top: 8,
                        color: "rgba(255, 255, 255, 0.7)",
                        "&:hover": {
                            color: "#fff",
                        },
                    }}
                >
                    <CloseIcon />
                </IconButton>
            </DialogTitle>
            <form onSubmit={handleSubmit(onSubmit)}>
                <DialogContent sx={{ bgcolor: "#1e2330", p: "24px !important" }}>
                    <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
                        <Box>
                            <Typography
                                variant="subtitle2"
                                component="label"
                                sx={{
                                    display: "block",
                                    mb: 1,
                                    color: "rgba(255, 255, 255, 0.7)",
                                    fontWeight: 400,
                                    fontSize: "0.9rem",
                                }}
                            >
                                List Name
                            </Typography>
                            <Controller
                                name="name"
                                control={control}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        placeholder="Enter list name"
                                        error={!!errors.name}
                                        helperText={errors.name?.message}
                                        fullWidth
                                        variant="outlined"
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    <TitleIcon
                                                        sx={{ color: "rgba(255, 255, 255, 0.7)" }}
                                                        fontSize="small"
                                                    />
                                                </InputAdornment>
                                            ),
                                        }}
                                        sx={{
                                            "& .MuiOutlinedInput-root": {
                                                borderRadius: 1,
                                                bgcolor: "#2c3347",
                                                color: "#fff",
                                                "& fieldset": {
                                                    borderColor: "rgba(255, 255, 255, 0.2)",
                                                },
                                                "&:hover fieldset": {
                                                    borderColor: "rgba(255, 255, 255, 0.3)",
                                                },
                                                "&.Mui-focused fieldset": {
                                                    borderColor: "rgba(255, 255, 255, 0.5)",
                                                },
                                            },
                                            "& .MuiFormHelperText-root": {
                                                color: theme.palette.error.main,
                                            },
                                        }}
                                    />
                                )}
                            />
                        </Box>

                        <Box>
                            <Typography
                                variant="subtitle2"
                                component="label"
                                sx={{
                                    display: "block",
                                    mb: 1,
                                    color: "rgba(255, 255, 255, 0.7)",
                                    fontWeight: 400,
                                    fontSize: "0.9rem",
                                }}
                            >
                                Description
                            </Typography>
                            <Controller
                                name="description"
                                control={control}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        placeholder="Add a description (optional)"
                                        multiline
                                        rows={3}
                                        error={!!errors.description}
                                        helperText={errors.description?.message}
                                        fullWidth
                                        variant="outlined"
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment
                                                    position="start"
                                                    sx={{ alignSelf: "flex-start", mt: 1 }}
                                                >
                                                    <DescriptionIcon
                                                        sx={{ color: "rgba(255, 255, 255, 0.7)" }}
                                                        fontSize="small"
                                                    />
                                                </InputAdornment>
                                            ),
                                        }}
                                        sx={{
                                            "& .MuiOutlinedInput-root": {
                                                borderRadius: 1,
                                                bgcolor: "#2c3347",
                                                color: "#fff",
                                                "& fieldset": {
                                                    borderColor: "rgba(255, 255, 255, 0.2)",
                                                },
                                                "&:hover fieldset": {
                                                    borderColor: "rgba(255, 255, 255, 0.3)",
                                                },
                                                "&.Mui-focused fieldset": {
                                                    borderColor: "rgba(255, 255, 255, 0.5)",
                                                },
                                            },
                                            "& .MuiFormHelperText-root": {
                                                color: theme.palette.error.main,
                                            },
                                        }}
                                    />
                                )}
                            />
                        </Box>

                        <Box>
                            <Typography
                                variant="subtitle2"
                                component="label"
                                sx={{
                                    display: "block",
                                    mb: 1,
                                    color: "rgba(255, 255, 255, 0.7)",
                                    fontWeight: 400,
                                    fontSize: "0.9rem",
                                }}
                            >
                                Privacy Setting
                            </Typography>
                            <Controller
                                name="isPrivate"
                                control={control}
                                render={({ field: { onChange, value, ...field } }) => (
                                    <FormControl error={!!errors.isPrivate} fullWidth>
                                        <Select
                                            {...field}
                                            value={value ? "private" : "public"}
                                            onChange={(e) => onChange(e.target.value === "private")}
                                            displayEmpty
                                            sx={{
                                                borderRadius: 1,
                                                bgcolor: "#2c3347",
                                                color: "#fff",
                                                "& .MuiOutlinedInput-notchedOutline": {
                                                    borderColor: "rgba(255, 255, 255, 0.2)",
                                                },
                                                "&:hover .MuiOutlinedInput-notchedOutline": {
                                                    borderColor: "rgba(255, 255, 255, 0.3)",
                                                },
                                                "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                                                    borderColor: "rgba(255, 255, 255, 0.5)",
                                                },
                                                "& .MuiSelect-select": {
                                                    display: "flex",
                                                    alignItems: "center",
                                                },
                                            }}
                                        >
                                            <MenuItem value="public" sx={{ display: "flex", alignItems: "center" }}>
                                                <PublicIcon
                                                    fontSize="small"
                                                    sx={{ mr: 1, color: "rgba(255, 255, 255, 0.7)" }}
                                                />
                                                <Typography>Public</Typography>
                                            </MenuItem>
                                            <MenuItem value="private" sx={{ display: "flex", alignItems: "center" }}>
                                                <LockIcon
                                                    fontSize="small"
                                                    sx={{ mr: 1, color: "rgba(255, 255, 255, 0.7)" }}
                                                />
                                                <Typography>Private</Typography>
                                            </MenuItem>
                                        </Select>
                                        {errors.isPrivate && (
                                            <FormHelperText sx={{ color: theme.palette.error.main }}>
                                                {errors.isPrivate.message}
                                            </FormHelperText>
                                        )}
                                    </FormControl>
                                )}
                            />
                        </Box>
                    </Box>
                </DialogContent>
                <DialogActions
                    sx={{
                        p: 0,
                        m: 0,
                        bgcolor: "#1e2330",
                        borderTop: "1px solid rgba(255, 255, 255, 0.1)",
                        justifyContent: "flex-end",
                        height: 56,
                    }}
                >
                    <Box sx={{ display: "flex", justifyContent: "flex-end", width: "100%", pr: 2 }}>
                        <Button
                            type="submit"
                            variant="contained"
                            disabled={isPending}
                            startIcon={<SaveIcon />}
                            sx={{
                                textTransform: "none",
                                borderRadius: 1,
                                fontWeight: 500,
                                px: 2,
                                bgcolor: "#495057",
                                color: "#fff",
                                "&:hover": {
                                    bgcolor: "#343a40",
                                },
                            }}
                        >
                            Save Changes
                        </Button>
                    </Box>
                </DialogActions>
            </form>
        </Dialog>
    );
}
