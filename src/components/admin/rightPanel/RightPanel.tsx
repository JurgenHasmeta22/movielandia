"use client";

import React, { useState } from "react";
import {
    Button,
    Grid2 as Grid,
    TextField,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    Drawer,
    Box,
    Typography,
    Step,
    StepLabel,
    useTheme,
    Stepper,
    StepButton,
    IconButton,
    SxProps,
    FormLabel,
    InputAdornment,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import * as CONSTANTS from "@/constants/Constants";
import type {} from "@mui/material/themeCssVarsAugmentation";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

interface IDrawerProps {
    onClose?: () => void;
    onSave?: (values: any) => void;
    onDataChange?: (values: any) => void;
    defaultValues?: any;
    fields?: FieldConfig[];
    schema?: any;
    title?: string;
    actions?: ActionConfig[];
    formRef?: React.Ref<any>;
    subTitle?: string;
    steps?: StepConfig[];
}

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

const RightPanel: React.FC<IDrawerProps> = ({
    onClose,
    defaultValues,
    fields,
    schema,
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

    // const handleNext = () => {
    //     setActiveStep((prevActiveStep: any) => prevActiveStep + 1);
    // };

    const handleBack = () => {
        setActiveStep((prevActiveStep: any) => prevActiveStep - 1);
    };

    const handleStep = (step: any) => () => {
        setActiveStep(step);
    };

    const {
        control,
        handleSubmit,
        // watch,
        // reset,
        formState: { errors, isDirty },
    } = useForm({
        defaultValues,
        resolver: zodResolver(schema),
        mode: "onBlur",
    });

    return (
        <Drawer variant={"temporary"} component={"aside"} anchor={"right"} open={true} onClose={onClose}>
            <Box
                sx={{
                    width: "100%",
                    height: "100%",
                    px: 2,
                    py: 4,
                    bgcolor: theme.vars.palette.background.default,
                }}
            >
                <Box
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                    sx={{
                        mb: 2,
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
                            mb: 4,
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
                <form onSubmit={handleSubmit(onSave!)} ref={formRef}>
                    <Grid
                        container
                        spacing={3}
                        sx={{
                            mt: 3,
                        }}
                    >
                        {(steps! ? steps[activeStep].fields : fields!).map((field, index: number) => (
                            <Grid size={{ xs: 6 }} key={index}>
                                {field.type === "select" ? (
                                    <FormControl>
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
                                                    {field.options?.map((option, index: number) => (
                                                        <MenuItem key={index} value={option.value}>
                                                            {option.label}
                                                        </MenuItem>
                                                    ))}
                                                </Select>
                                            )}
                                        />
                                    </FormControl>
                                ) : field.type === "password" ? (
                                    <Box display={"flex"} flexDirection={"column"} rowGap={1}>
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
                                                    helperText={errors[field.name]?.message as string | undefined}
                                                    error={!!errors[field.name]}
                                                    slotProps={{input: {
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
                                                    }}}
                                                />
                                            )}
                                        />
                                    </Box>
                                ) : (
                                    <Box display={"flex"} flexDirection={"column"} rowGap={1}>
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
                                                    helperText={errors[field.name]?.message as string | undefined}
                                                    error={!!errors[field.name]}
                                                />
                                            )}
                                        />
                                    </Box>
                                )}
                            </Grid>
                        ))}
                    </Grid>
                    <Box
                        display={"flex"}
                        gap={"10px"}
                        justifyContent={"end"}
                        sx={{
                            mt: 3,
                        }}
                    >
                        {(steps ? steps[activeStep].actions! : actions!).map((action, index) => (
                            <Button
                                key={index}
                                onClick={action.onClick}
                                // @ts-expect-error color
                                color={action.color || "primary"}
                                variant={action.variant || "text"}
                                sx={action.sx}
                                type={action.type}
                                endIcon={action.icon}
                                disabled={isDirty || action.label === CONSTANTS.FORM__DELETE__BUTTON ? false : true}
                            >
                                <Typography fontSize={16} fontWeight={500} sx={{ textTransform: "capitalize" }}>
                                    {action.label}
                                </Typography>
                            </Button>
                        ))}
                    </Box>
                    {steps && (
                        <Box
                            display="flex"
                            justifyContent="space-between"
                            sx={{
                                mt: 12,
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
                </form>
            </Box>
        </Drawer>
    );
};

export default RightPanel;
