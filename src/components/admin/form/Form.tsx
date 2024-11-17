"use client";

import React, { useEffect, useState } from "react";
import {
    TextField,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    Button,
    SxProps,
    InputAdornment,
    IconButton,
    Stack,
    Grid2 as Grid,
    Box,
    FormLabel,
    Typography,
} from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import * as CONSTANTS from "@/constants/Constants";

interface IFormProps {
    defaultValues: any;
    schema: z.ZodSchema<any>;
    fields: FieldConfig[];
    actions?: ActionConfig[];
    formRef: any;
    onSubmit: (values: any) => void;
    onDataChange?: (values: any) => void;
}

type FieldOption = {
    label: string;
    value: string;
};

type FieldConfig = {
    name: string;
    label: string;
    type: "text" | "select" | "multiselect" | "date" | "password";
    options?: FieldOption[];
    disabled?: boolean;
    span?: number;
    helperText?: React.ReactNode;
    error?: boolean | undefined;
    variant?: any;
    sx?: SxProps;
};

type ActionConfig = {
    label: string;
    type?: string;
    color?: "inherit" | "primary" | "secondary" | "success" | "error" | "info" | "warning" | "default";
    variant?: "text" | "outlined" | "contained";
    icon?: React.ReactNode;
    sx?: SxProps;
    onClick?: () => void;
};

const FormAdvanced: React.FC<IFormProps> = ({
    defaultValues,
    schema,
    onSubmit,
    fields,
    actions,
    onDataChange,
    formRef,
}) => {
    const [showPassword, setShowPassword] = useState(false);

    const {
        control,
        handleSubmit,
        watch,
        reset,
        formState: { errors, isDirty },
    } = useForm({
        values: defaultValues,
        resolver: zodResolver(schema),
        mode: "all",
    });

    useEffect(() => {
        const { unsubscribe } = watch(() => {
            if (onDataChange) {
                onDataChange(watch());
            }
        });

        return () => unsubscribe();
    }, [watch]);

    const handleClickShowPassword = () => setShowPassword(!showPassword);
    const handleMouseDownPassword = () => setShowPassword(!showPassword);

    return (
        <form onSubmit={handleSubmit(onSubmit)} ref={formRef}>
            <Grid container direction="column" rowSpacing={{ xs: 4, md: 6, lg: 8 }}>
                <Grid container alignItems={"center"}>
                    <Stack rowGap={4} columnGap={2} flexDirection={"row"} flexWrap={"wrap"}>
                        {fields.map((field: FieldConfig, index: number) => {
                            const error = !!errors[field.name];
                            const helperText = errors[field.name]?.message as string | undefined;

                            switch (field.type) {
                                case "select":
                                    return (
                                        <FormControl key={index} fullWidth>
                                            <InputLabel id={`${field.name}-label`}>{field.label}</InputLabel>
                                            <Controller
                                                name={field.name}
                                                control={control}
                                                render={({ field: controllerField }) => (
                                                    <Select
                                                        labelId={`${field.name}-label`}
                                                        variant={field.variant}
                                                        size="small"
                                                        {...controllerField}
                                                        sx={field.sx}
                                                    >
                                                        {field.options?.map((option, idx) => (
                                                            <MenuItem key={idx} value={option.value}>
                                                                {option.label}
                                                            </MenuItem>
                                                        ))}
                                                    </Select>
                                                )}
                                            />
                                        </FormControl>
                                    );
                                case "multiselect":
                                    return (
                                        <FormControl key={index} fullWidth>
                                            <InputLabel id={`${field.name}-label`}>{field.label}</InputLabel>
                                            <Controller
                                                name={field.name}
                                                control={control}
                                                render={({ field: controllerField }) => (
                                                    <Select
                                                        labelId={`${field.name}-label`}
                                                        variant={field.variant}
                                                        size="small"
                                                        multiple
                                                        {...controllerField}
                                                        sx={field.sx}
                                                    >
                                                        {field.options?.map((option, idx) => (
                                                            <MenuItem key={idx} value={option.value}>
                                                                {option.label}
                                                            </MenuItem>
                                                        ))}
                                                    </Select>
                                                )}
                                            />
                                        </FormControl>
                                    );
                                case "date":
                                    return (
                                        <Controller
                                            key={index}
                                            name={field.name}
                                            control={control}
                                            render={({ field: controllerField }) => (
                                                <TextField
                                                    label={field.label}
                                                    variant={field.variant}
                                                    {...controllerField}
                                                    sx={field.sx}
                                                    size="small"
                                                    type="date"
                                                    InputLabelProps={{ shrink: true }}
                                                    helperText={helperText}
                                                    error={error}
                                                />
                                            )}
                                        />
                                    );
                                case "password":
                                    return (
                                        <Box display={"flex"} flexDirection={"column"} rowGap={1} key={index}>
                                            <FormLabel>{field.label}</FormLabel>
                                            <Controller
                                                name={field.name}
                                                control={control}
                                                render={({ field: controllerField }) => (
                                                    <TextField
                                                        {...controllerField}
                                                        variant={field.variant}
                                                        size="small"
                                                        sx={field.sx}
                                                        type={showPassword ? "text" : "password"}
                                                        autoComplete={"on"}
                                                        helperText={helperText}
                                                        error={error}
                                                        InputProps={{
                                                            endAdornment: (
                                                                <InputAdornment position="end">
                                                                    <IconButton
                                                                        aria-label="toggle password visibility"
                                                                        onClick={handleClickShowPassword}
                                                                        onMouseDown={handleMouseDownPassword}
                                                                    >
                                                                        {showPassword ? (
                                                                            <Visibility color="primary" />
                                                                        ) : (
                                                                            <VisibilityOff color="primary" />
                                                                        )}
                                                                    </IconButton>
                                                                </InputAdornment>
                                                            ),
                                                        }}
                                                    />
                                                )}
                                            />
                                        </Box>
                                    );
                                default:
                                    return (
                                        <Box display={"flex"} flexDirection={"column"} rowGap={1} key={index}>
                                            <FormLabel>{field.label}</FormLabel>
                                            <Controller
                                                name={field.name}
                                                control={control}
                                                render={({ field: controllerField }) => (
                                                    <TextField
                                                        {...controllerField}
                                                        type={field.type}
                                                        variant={field.variant}
                                                        disabled={field.disabled}
                                                        sx={{ ...field.sx }}
                                                        size="small"
                                                        helperText={helperText}
                                                        error={error}
                                                    />
                                                )}
                                            />
                                        </Box>
                                    );
                            }
                        })}
                    </Stack>
                </Grid>
                <Grid
                    container
                    justifyContent={"end"}
                    sx={{
                        mt: 2,
                    }}
                >
                    <Stack
                        columnGap={2}
                        flexDirection={"row"}
                        flexWrap={"wrap"}
                        sx={{
                            mt: "20px",
                        }}
                    >
                        {actions?.map((action, index) => (
                            <Button
                                key={index}
                                onClick={action.onClick}
                                // @ts-expect-error color
                                color={action.color || "primary"}
                                variant={action.variant || "text"}
                                sx={action.sx}
                                type={action.type}
                                endIcon={action.icon}
                                disabled={!isDirty && action.label !== CONSTANTS.FORM__DELETE__BUTTON}
                            >
                                <Typography fontSize={16} fontWeight={500} sx={{ textTransform: "capitalize" }}>
                                    {action.label}
                                </Typography>
                            </Button>
                        ))}
                    </Stack>
                </Grid>
            </Grid>
        </form>
    );
};

export default FormAdvanced;
