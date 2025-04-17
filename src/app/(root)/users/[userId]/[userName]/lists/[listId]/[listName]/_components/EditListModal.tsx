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
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import SaveIcon from "@mui/icons-material/Save";
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

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
            <DialogTitle sx={{ fontSize: "1.25rem", fontWeight: 500 }}>
                Edit List
                <IconButton
                    aria-label="close"
                    onClick={onClose}
                    sx={{
                        position: "absolute",
                        right: 8,
                        top: 8,
                    }}
                >
                    <CloseIcon />
                </IconButton>
            </DialogTitle>
            <form onSubmit={handleSubmit(onSubmit)}>
                <DialogContent>
                    <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5, mt: 1 }}>
                        <Controller
                            name="name"
                            control={control}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    label="List Name"
                                    error={!!errors.name}
                                    helperText={errors.name?.message}
                                    fullWidth
                                />
                            )}
                        />
                        <Controller
                            name="description"
                            control={control}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    label="Description"
                                    multiline
                                    rows={3}
                                    error={!!errors.description}
                                    helperText={errors.description?.message}
                                    fullWidth
                                />
                            )}
                        />
                        <Controller
                            name="isPrivate"
                            control={control}
                            render={({ field: { onChange, value, ...field } }) => (
                                <FormControl error={!!errors.isPrivate}>
                                    <InputLabel>Privacy</InputLabel>
                                    <Select
                                        {...field}
                                        value={value ? "private" : "public"}
                                        onChange={(e) => onChange(e.target.value === "private")}
                                        label="Privacy"
                                    >
                                        <MenuItem value="public">Public</MenuItem>
                                        <MenuItem value="private">Private</MenuItem>
                                    </Select>
                                    {errors.isPrivate && <FormHelperText>{errors.isPrivate.message}</FormHelperText>}
                                </FormControl>
                            )}
                        />
                    </Box>
                </DialogContent>
                <DialogActions sx={{ px: 3, pb: 3 }}>
                    <Button onClick={onClose} variant="outlined" disabled={isPending}>
                        Cancel
                    </Button>
                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        disabled={isPending}
                        startIcon={<SaveIcon />}
                        sx={{ textTransform: "none" }}
                    >
                        Save Changes
                    </Button>
                </DialogActions>
            </form>
        </Dialog>
    );
}
