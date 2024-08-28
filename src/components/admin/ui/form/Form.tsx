"use client";

import React, { useState } from "react";
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
import { Formik, FormikProps, Form } from "formik";
import * as yup from "yup";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import * as CONSTANTS from "@/constants/Constants";

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
    onBlur?: React.FocusEventHandler<HTMLInputElement | HTMLTextAreaElement> | undefined;
    onChange?: React.ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement> | undefined;
};

type FormProps = {
    initialValues: any;
    validationSchema: yup.ObjectSchema<any>;
    resetTrigger?: boolean;
    fields: FieldConfig[];
    formRef: React.RefObject<FormikProps<any>>;
    actions?: ActionConfig[];
    onDataChange?: (values: any) => void;
    onSubmit: (values: any) => void;
    onFormChange?: (values: any, formikHelpers: any) => void;
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

const FormAdvanced: React.FC<FormProps> = ({ initialValues, onSubmit, validationSchema, fields, formRef, actions }) => {
    const [showPassword, setShowPassword] = useState(false);

    const handleClickShowPassword = () => setShowPassword(!showPassword);
    const handleMouseDownPassword = () => setShowPassword(!showPassword);

    return (
        <Formik
            innerRef={formRef}
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={(values: any) => {
                onSubmit(values);
            }}
            enableReinitialize
        >
            {({ values, errors, touched, handleBlur, handleChange, dirty }) => {
                return (
                    <Form>
                        <Grid container direction="column" rowSpacing={{ xs: 4, md: 6, lg: 8 }}>
                            <Grid container alignItems={"center"}>
                                <Stack rowGap={4} columnGap={2} flexDirection={"row"} flexWrap={"wrap"}>
                                    {fields.map((field: FieldConfig, index: number) => {
                                        switch (field.type) {
                                            case "select":
                                                return (
                                                    <FormControl>
                                                        <InputLabel id={`${field.name}-label`}>
                                                            {field.label}
                                                        </InputLabel>
                                                        <Select
                                                            key={index}
                                                            name={field.name}
                                                            labelId={`${field.name}-label`}
                                                            variant={field.variant}
                                                            size="small"
                                                            onBlur={handleBlur}
                                                            onChange={handleChange}
                                                            value={values[field.name]}
                                                            sx={field.sx}
                                                        >
                                                            {field.options?.map((option, index: number) => (
                                                                <MenuItem key={index} value={option.value}>
                                                                    {option.label}
                                                                </MenuItem>
                                                            ))}
                                                        </Select>
                                                    </FormControl>
                                                );
                                            case "multiselect":
                                                return (
                                                    <FormControl>
                                                        <InputLabel id={`${field.name}-label`}>
                                                            {field.label}
                                                        </InputLabel>
                                                        <Select
                                                            key={index}
                                                            name={field.name}
                                                            labelId={`${field.name}-label`}
                                                            variant={field.variant}
                                                            size="small"
                                                            onBlur={handleBlur}
                                                            onChange={handleChange}
                                                            value={values[field.name]}
                                                            multiple
                                                            sx={field.sx}
                                                        >
                                                            {field.options?.map((option, index: number) => (
                                                                <MenuItem key={index} value={option.value}>
                                                                    {option.label}
                                                                </MenuItem>
                                                            ))}
                                                        </Select>
                                                    </FormControl>
                                                );
                                            case "date":
                                                return (
                                                    <TextField
                                                        key={index}
                                                        name={field.name}
                                                        label={field.label}
                                                        variant={field.variant}
                                                        onBlur={handleBlur}
                                                        onChange={handleChange}
                                                        sx={field.sx}
                                                        size="small"
                                                        value={values[field.name]}
                                                        type={field.type}
                                                        // @ts-expect-error nono
                                                        helperText={touched[field.name] && errors[field.name]}
                                                        error={touched[field.name] && !!errors[field.name]}
                                                        InputLabelProps={
                                                            field.type === "date" ? { shrink: true } : undefined
                                                        }
                                                    />
                                                );
                                            case "password":
                                                return (
                                                    <Box display={"flex"} flexDirection={"column"} rowGap={1}>
                                                        <FormLabel>{field.label}</FormLabel>
                                                        <TextField
                                                            key={index}
                                                            name={field.name}
                                                            variant={field.variant}
                                                            onBlur={handleBlur}
                                                            onChange={handleChange}
                                                            size="small"
                                                            sx={field.sx}
                                                            value={values[field.name]}
                                                            type={showPassword ? "text" : "password"}
                                                            autoComplete={"on"}
                                                            // @ts-expect-error nono
                                                            helperText={touched[field.name] && errors[field.name]}
                                                            error={touched[field.name] && !!errors[field.name]}
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
                                                    </Box>
                                                );
                                            default:
                                                return (
                                                    <Box display={"flex"} flexDirection={"column"} rowGap={1}>
                                                        <FormLabel>{field.label}</FormLabel>
                                                        <TextField
                                                            key={index}
                                                            name={field.name}
                                                            type={field.type}
                                                            onBlur={handleBlur}
                                                            onChange={handleChange}
                                                            value={values[field.name]}
                                                            variant={field.variant}
                                                            disabled={field.disabled}
                                                            sx={{ ...field.sx }}
                                                            size="small"
                                                            // @ts-expect-error nono
                                                            helperText={touched[field.name] && errors[field.name]}
                                                            error={touched[field.name] && !!errors[field.name]}
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
                                    {actions!.map((action, index) => (
                                        <Button
                                            key={index}
                                            onClick={action.onClick}
                                            // @ts-expect-error nono
                                            color={action.color || "primary"}
                                            variant={action.variant || "text"}
                                            sx={action.sx}
                                            type={action.type}
                                            endIcon={action.icon}
                                            disabled={
                                                dirty || action.label === CONSTANTS.FORM__DELETE__BUTTON ? false : true
                                            }
                                        >
                                            <Typography
                                                fontSize={16}
                                                fontWeight={500}
                                                sx={{ textTransform: "capitalize" }}
                                            >
                                                {action.label}
                                            </Typography>
                                        </Button>
                                    ))}
                                </Stack>
                            </Grid>
                        </Grid>
                    </Form>
                );
            }}
        </Formik>
    );
};

export default FormAdvanced;
