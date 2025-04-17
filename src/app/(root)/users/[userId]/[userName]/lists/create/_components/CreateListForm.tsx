"use client";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Box, Button, TextField, FormControl, InputLabel, Select, MenuItem, FormHelperText } from "@mui/material";
import { createList } from "@/actions/list/list.actions";
import { showToast } from "@/utils/helpers/toast";
import { listSchema, type ListFormData } from "@/schemas/list.schema";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import { useRouter, usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { formatTitleForUrl } from "@/utils/helpers/formatUrl";

interface CreateListFormProps {
    userId: number;
}

export default function CreateListForm({ userId }: CreateListFormProps) {
    const router = useRouter();
    const pathname = usePathname();
    const { data: session } = useSession();
    const {
        control,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<ListFormData>({
        resolver: zodResolver(listSchema),
        defaultValues: {
            name: "",
            description: "",
            isPrivate: false,
        },
    });

    const onSubmit = async (data: ListFormData) => {
        try {
            const result = await createList({
                ...data,
                userId,
            });

            if (!result) {
                throw new Error("Failed to create list");
            }

            // Extract the username from the pathname or session
            const pathParts = pathname.split("/");
            const userIdIndex = pathParts.findIndex(part => part === userId.toString());
            const userName = userIdIndex >= 0 && userIdIndex + 1 < pathParts.length ?
                pathParts[userIdIndex + 1] :
                session?.user?.name?.replace(/\s+/g, "") || "user";

            showToast("success", "List created successfully!");
            router.push(`/users/${userId}/${userName}/lists/${formatTitleForUrl(result.id, result.name)}/add-items`);
        } catch (error) {
            showToast("error", "Failed to create list. Please try again.");
            console.error("Failed to create list:", error);
        }
    };

    return (
        <Box
            sx={{
                width: "100%",
                maxWidth: 600,
                mx: "auto",
                bgcolor: "background.paper",
                borderRadius: 1,
                p: { xs: 2, sm: 3 },
                boxShadow: 1,
            }}
        >
            <form onSubmit={handleSubmit(onSubmit)}>
                <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
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
                    <Button
                        type="submit"
                        variant="contained"
                        color="secondary"
                        fullWidth
                        disabled={isSubmitting}
                        startIcon={<AddCircleOutlineIcon />}
                        sx={{
                            textTransform: "none",
                            transition: "all 0.2s ease-in-out",
                        }}
                    >
                        Create List
                    </Button>
                </Box>
            </form>
        </Box>
    );
}
