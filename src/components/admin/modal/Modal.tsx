"use client";

import React, { useEffect } from "react";
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    IconButton,
    Grid2 as Grid,
    TextField,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    SxProps,
    Typography,
    List,
    ListItem,
    ListItemAvatar,
    ListItemText,
    CircularProgress,
    Box,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import InfiniteScroll from "react-infinite-scroll-component";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useStore } from "@/store/store";
import { useRouter } from "next/navigation";
import Image from "next/image";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";

interface IModalProps {
    onClose?: () => void;
    onDataChange?: (values: any) => void;
    onSave?: (values: any) => void;
    open: boolean;
    initialValues?: any;
    fields?: FieldConfig[];
    validationSchema?: z.ZodSchema<any>;
    title: string;
    actions?: ActionConfig[];
    subTitle?: string;
    hasList?: boolean;
}

type FieldConfig = {
    name: string;
    label: string;
    type?: string;
    options?: Array<{ label: string; value: any }>;
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

const Modal: React.FC<IModalProps> = ({
    onClose,
    initialValues,
    fields,
    validationSchema,
    onSave,
    title,
    actions,
    onDataChange,
    subTitle,
    hasList,
}) => {
    const {
        selectedReview,
        upvotesPageModal,
        setUpvotesPageModal,
        downvotesPageModal,
        setDownvotesPageModal,
        hasMoreUpvotesModal,
        hasMoreDownvotesModal,
        listModalDataType,
    } = useStore();

    const router = useRouter();

    const {
        control,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm({
        defaultValues: initialValues || {},
        resolver: validationSchema ? zodResolver(validationSchema) : undefined,
    });

    const watchedValues = watch();

    useEffect(() => {
        if (onDataChange) {
            onDataChange(watchedValues);
        }
    }, [watchedValues, onDataChange]);

    const onSubmit = (values: any) => {
        if (onSave) {
            onSave(values);
        }
        if (onClose) {
            onClose();
        }
    };

    return (
        <Dialog open={true} onClose={onClose || (() => {})} fullWidth>
            <DialogTitle fontSize={"22px"}>
                {title}
                <IconButton style={{ position: "absolute", right: 2, top: 2 }} onClick={onClose || (() => {})}>
                    <CloseIcon color="action" />
                </IconButton>
            </DialogTitle>
            <DialogContent>
                <DialogContentText fontSize={"16px"}>{subTitle}</DialogContentText>
                {hasList ? (
                    <Box id="scrollableDiv">
                        <InfiniteScroll
                            dataLength={
                                listModalDataType === "upvotes"
                                    ? selectedReview.upvotes?.length || 0
                                    : selectedReview.downvotes?.length || 0
                            }
                            next={() => {
                                if (listModalDataType === "upvotes") {
                                    setUpvotesPageModal(upvotesPageModal + 1);
                                } else if (listModalDataType === "downvotes") {
                                    setDownvotesPageModal(downvotesPageModal + 1);
                                }
                            }}
                            hasMore={listModalDataType === "upvotes" ? hasMoreUpvotesModal : hasMoreDownvotesModal}
                            loader={
                                <Box display={"flex"} alignItems={"center"} justifyContent={"center"} sx={{ mt: 1 }}>
                                    <CircularProgress size={20} thickness={2} />
                                </Box>
                            }
                            height={"auto"}
                            endMessage={
                                <Typography sx={{ textAlign: "center" }} variant="body1">
                                    You have seen it all
                                </Typography>
                            }
                            scrollableTarget="scrollableDiv"
                        >
                            <List>
                                {(listModalDataType === "upvotes"
                                    ? selectedReview?.upvotes
                                    : selectedReview?.downvotes
                                )?.map((item: any, index: number) => (
                                    <ListItem
                                        key={index}
                                        alignItems="center"
                                        sx={{ justifyContent: "flex-start", cursor: "pointer" }}
                                        onClick={() => {
                                            router.push(`/users/${item.user.id}/${item.user.userName}`);
                                            onClose && onClose();
                                        }}
                                    >
                                        <ListItemAvatar>
                                            {item.user.avatar?.photoSrc ? (
                                                <Image
                                                    alt={item.user.userName}
                                                    height={50}
                                                    width={50}
                                                    style={{ borderRadius: 20 }}
                                                    src={item.user.avatar?.photoSrc}
                                                />
                                            ) : (
                                                <PersonOutlinedIcon sx={{ fontSize: 24, mr: 1 }} />
                                            )}
                                        </ListItemAvatar>
                                        <ListItemText primary={item.user.userName} />
                                    </ListItem>
                                ))}
                            </List>
                        </InfiniteScroll>
                    </Box>
                ) : fields ? (
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <Grid container spacing={4} sx={{ mt: 2 }}>
                            {fields.map((field, index: number) => (
                                <Grid size={{ xs: 6 }} key={index}>
                                    {field.type === "select" ? (
                                        <FormControl fullWidth size="medium">
                                            <InputLabel id={`${field.name}-label`}>{field.label}</InputLabel>
                                            <Controller
                                                name={field.name}
                                                control={control}
                                                render={({ field: selectField }) => (
                                                    <Select {...selectField} labelId={`${field.name}-label`}>
                                                        {field.options?.map((option, idx) => (
                                                            <MenuItem key={idx} value={option.value}>
                                                                {option.label}
                                                            </MenuItem>
                                                        ))}
                                                    </Select>
                                                )}
                                            />
                                        </FormControl>
                                    ) : (
                                        <Controller
                                            name={field.name}
                                            control={control}
                                            render={({ field: textField }) => (
                                                <TextField
                                                    {...textField}
                                                    label={field.label}
                                                    fullWidth
                                                    size="medium"
                                                    type={field.type || "text"}
                                                    error={!!errors[field.name]}
                                                    // @ts-expect-error helper
                                                    helperText={errors[field.name]?.message}
                                                />
                                            )}
                                        />
                                    )}
                                </Grid>
                            ))}
                        </Grid>
                        <DialogActions style={{ marginTop: "15px" }}>
                            {actions?.map((action, index) => (
                                <Button
                                    key={index}
                                    onClick={action.onClick}
                                    // @ts-expect-error color

                                    color={action.color || "secondary"}
                                    variant={action.variant || "text"}
                                    sx={action.sx}
                                    type={action.type}
                                    endIcon={action.icon}
                                >
                                    <Typography sx={{ textTransform: "capitalize" }}>{action.label}</Typography>
                                </Button>
                            ))}
                        </DialogActions>
                    </form>
                ) : (
                    <DialogActions style={{ marginTop: "15px" }}>
                        {actions?.map((action, index) => (
                            <Button
                                key={index}
                                onClick={() => {
                                    action.onClick();
                                    onClose && onClose();
                                }}
                                // @ts-expect-error color

                                color={action.color || "secondary"}
                                variant={action.variant || "text"}
                                sx={action.sx}
                                type={action.type === "submit" || action.type === "reset" ? action.type : ""}
                                endIcon={action.icon}
                            >
                                {action.label}
                            </Button>
                        ))}
                    </DialogActions>
                )}
            </DialogContent>
        </Dialog>
    );
};

export default Modal;
