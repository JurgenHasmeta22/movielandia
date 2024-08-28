"use client";

import React, { useState } from "react";
import {
    Button,
    TextField,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    Drawer,
    Typography,
    Step,
    StepLabel,
    Stepper,
    StepButton,
    IconButton,
    SxProps,
    FormLabel,
    InputAdornment,
} from "@mui/material";
import { Formik, Form, FormikProps } from "formik";
import CloseIcon from "@mui/icons-material/Close";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import * as CONSTANTS from "@/constants/Constants";
import type {} from "@mui/material/themeCssVarsAugmentation";
import Grid from "@mui/material-pigment-css/Grid";
import { useTheme } from "@mui/material-pigment-css";
import Box from "@mui/material-pigment-css/Box";

type FieldConfig = {
    name: string;
    label: string;
    type?: string;
    options?: Array<{ label: string; value: any }>;
    variant?: any;
    disabled?: boolean;
    hidden?: boolean;
    sx: {
        gridColumn: string;
    };
};

type DrawerProps = {
    onClose?: () => void;
    onSave?: (values: any) => void;
    onDataChange?: (values: any) => void;
    initialValues?: any;
    fields?: FieldConfig[];
    validationSchema?: any;
    title?: string;
    actions?: ActionConfig[];
    formRef?: React.Ref<FormikProps<any>>;
    subTitle?: string;
    steps?: StepConfig[];
};

type ActionConfig = {
    onClick: () => void;
    label: string;
    type?: string;
    color?: "inherit" | "primary" | "secondary" | "success" | "error" | "info" | "warning" | "default";
    variant?: "text" | "outlined" | "contained";
    icon?: React.ReactNode;
    sx?: SxProps;
};

type StepConfig = {
    title: string;
    fields: FieldConfig[];
    validationSchema: any;
    actions?: ActionConfig[];
};

const RightPanel: React.FC<DrawerProps> = ({
    onClose,
    initialValues,
    fields,
    validationSchema,
    onSave,
    actions,
    formRef,
    subTitle,
    steps,
    title,
}) => {
    const [activeStep, setActiveStep] = useState(0);
    const [showPassword, setShowPassword] = useState(false);

    const theme = useTheme();

    const handleClickShowPassword = () => setShowPassword(!showPassword);
    const handleMouseDownPassword = () => setShowPassword(!showPassword);

    const isLastStep = () => activeStep === (steps ? steps.length - 1 : 0);

    const handleNext = () => {
        setActiveStep((prevActiveStep: any) => prevActiveStep + 1);
    };

    const handleBack = () => {
        setActiveStep((prevActiveStep: any) => prevActiveStep - 1);
    };

    const handleStep = (step: any) => () => {
        setActiveStep(step);
    };

    return (
        <Drawer variant={"temporary"} component={"aside"} anchor={"right"} open={true} onClose={onClose}>
            <Box
                sx={{
                    width: "100%",
                    height: "100%",
                    paddingTop: 2,
                    paddingBottom: 2,
                    paddingRight: 1,
                    paddingLeft: 1,
                    backgroundColor: theme.vars.palette.background.default,
                }}
            >
                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginBottom: 2,
                    }}
                >
                    {title && <Typography variant="h3">{title}</Typography>}
                    <IconButton onClick={() => onClose && onClose()}>
                        <CloseIcon color="action" />
                    </IconButton>
                </Box>
                {subTitle && (
                    <Typography
                        variant="subtitle1"
                        color="textSecondary"
                        sx={{
                            marginBottom: 4,
                        }}
                    >
                        {subTitle}
                    </Typography>
                )}
                {steps && (
                    <Stepper activeStep={activeStep} alternativeLabel>
                        {steps.map((stepConfig, index) => (
                            <Step key={index}>
                                <StepButton onClick={handleStep(index)}>
                                    <StepLabel>{stepConfig.title}</StepLabel>
                                </StepButton>
                            </Step>
                        ))}
                    </Stepper>
                )}
                <Formik
                    initialValues={initialValues}
                    validationSchema={steps ? steps[activeStep].validationSchema : validationSchema}
                    onSubmit={(values: any) => {
                        if (isLastStep()) {
                            onSave && onSave(values);
                            onClose && onClose();
                        } else {
                            handleNext();
                        }
                    }}
                    innerRef={formRef}
                >
                    {({ errors, touched, values, handleBlur, handleChange, dirty }: any) => {
                        return (
                            <Form>
                                <Grid
                                    container
                                    sx={{
                                        gap: 3,
                                        marginTop: 3,
                                    }}
                                >
                                    {(steps! ? steps[activeStep].fields : fields!).map((field, index: number) => (
                                        <Grid size={{ xs: 6 }} key={index}>
                                            {field.type === "select" ? (
                                                <FormControl>
                                                    <InputLabel id={`${field.name}-label`}>{field.label}</InputLabel>
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
                                            ) : field.type === "password" ? (
                                                <Box
                                                    sx={{
                                                        display: "flex",
                                                        flexDirection: "column",
                                                        rowGap: 1,
                                                    }}
                                                >
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
                                            ) : (
                                                <Box
                                                    sx={{
                                                        display: "flex",
                                                        flexDirection: "column",
                                                        rowGap: 1,
                                                    }}
                                                >
                                                    <FormLabel>{field.label}</FormLabel>
                                                    <TextField
                                                        key={index}
                                                        name={field.name}
                                                        type={field.type}
                                                        onBlur={handleBlur}
                                                        onChange={handleChange}
                                                        hidden={field.hidden}
                                                        value={values[field.name]}
                                                        variant={field.variant}
                                                        disabled={field.disabled}
                                                        sx={{ ...field.sx }}
                                                        size="small"
                                                        helperText={touched[field.name] && errors[field.name]}
                                                        error={touched[field.name] && !!errors[field.name]}
                                                    />
                                                </Box>
                                            )}
                                        </Grid>
                                    ))}
                                </Grid>
                                <Box
                                    sx={{
                                        display: "flex",
                                        justifyContent: "end",
                                        gap: "10px",
                                        marginTop: 3,
                                    }}
                                >
                                    {(steps ? steps[activeStep].actions! : actions!).map((action, index) => (
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
                                </Box>
                                {steps && (
                                    <Box
                                        sx={{
                                            display: "flex",
                                            justifyContent: "space-between",
                                            marginTop: 12,
                                        }}
                                    >
                                        <Button disabled={activeStep === 0} onClick={handleBack} variant="contained">
                                            Mbrapa
                                        </Button>
                                        {!isLastStep() && (
                                            <Button variant="contained" color="primary" type="submit">
                                                Tjetra
                                            </Button>
                                        )}
                                    </Box>
                                )}
                            </Form>
                        );
                    }}
                </Formik>
            </Box>
        </Drawer>
    );
};

export default RightPanel;
