"use client";

import { Box, Button, Stack, Tab, Tabs, Typography, useTheme } from "@mui/material";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import { tokens } from "@/utils/theme/theme";
import EmailIcon from "@mui/icons-material/Email";
import { useCallback, useRef } from "react";
import { toast } from "react-toastify";
import * as CONSTANTS from "@/constants/Constants";
import * as Yup from "yup";
import ClearAllIcon from "@mui/icons-material/ClearAll";
import SaveAsIcon from "@mui/icons-material/SaveAs";
import { FormikProps } from "formik";
import TabPanel from "@/components/root/ui/tab/Tab";
import { useRightPanel } from "@/providers/RightPanelProvider";
import { useRouter } from "next/navigation";
import { updateUserById } from "@/lib/actions/user.actions";
import FavoritesTab from "./FavoritesTab";

interface IProfileProps {
    user: any | null;
    tabValue: string;
}

const userSchema = Yup.object().shape({
    userName: Yup.string()
        .required("Username is a required field")
        .min(3, "Username must be at least 3 characters")
        .max(20, "Username can't be longer than 20 characters")
        .matches(/^[a-zA-Z0-9_]+$/, "Username can only contain letters, numbers, and underscores"),
    email: Yup.string().required("Email is a required field").email("Invalid email format"),
});

export default function Profile({ tabValue, user }: IProfileProps) {
    const router = useRouter();

    const { openRightPanel } = useRightPanel();
    const formikRef = useRef<FormikProps<any>>(null);

    const theme = useTheme();
    const colors = tokens(theme.palette.mode);

    const tabValueFinal =
        tabValue === "favMovies"
            ? 0
            : tabValue === "favSeries"
              ? 1
              : tabValue === "favActors"
                ? 2
                : tabValue === "favSeasons"
                  ? 3
                  : tabValue === "favEpisodes"
                    ? 4
                    : 0;

    const handleChange = (event: any, newValue: number) => {
        switch (newValue) {
            case 0:
                router.push("/profile?tab=favMovies");
                break;
            case 1:
                router.push("/profile?tab=favSeries");
                break;
            case 2:
                router.push("/profile?tab=favActors");
                break;
            case 3:
                router.push("/profile?tab=favSeasons");
                break;
            case 4:
                router.push("/profile?tab=favEpisodes");
                break;
            default:
                console.warn("Unknown tab index:", newValue);
                break;
        }
    };

    const handleResetFromParent = () => {
        formikRef.current?.resetForm();
    };

    const handleEditProfile = useCallback(() => {
        openRightPanel({
            formRef: formikRef,
            initialValues: {
                id: user?.id,
                userName: user?.userName,
                email: user?.email,
            },
            fields: [
                {
                    name: "userName",
                    label: "Username",
                    variant: "filled",
                    type: "text",
                },
                {
                    name: "email",
                    label: "Email",
                    variant: "filled",
                    type: "text",
                },
            ],
            validationSchema: userSchema,
            onSave: async (values: any) => {
                const payload = {
                    userName: values.userName,
                    email: values.email,
                };

                const response = await updateUserById(payload, values.id);

                if (response) {
                    toast.success(CONSTANTS.UPDATE__SUCCESS);
                    router.push("/profile");
                    router.refresh();
                } else {
                    toast.error(CONSTANTS.UPDATE__FAILURE);
                }
            },
            title: "Edit Profile",
            actions: [
                {
                    label: CONSTANTS.FORM__RESET__BUTTON,
                    onClick: () => {
                        handleResetFromParent();
                    },
                    type: "reset",
                    color: "secondary",
                    variant: "contained",
                    sx: {
                        border: "1px solid #000",
                        bgcolor: "#ff5252",
                        fontSize: "15px",
                        fontWeight: "700",
                    },
                    icon: <ClearAllIcon />,
                },
                {
                    label: CONSTANTS.FORM__UPDATE__BUTTON,
                    type: "submit",
                    color: "secondary",
                    variant: "contained",
                    sx: {
                        border: "1px solid #000",
                        bgcolor: "#30969f",
                        fontSize: "15px",
                        fontWeight: "700",
                    },
                    icon: <SaveAsIcon />,
                },
            ],
            subTitle: "Enter the details of the user you want to edit",
        });
    }, [user]);

    return (
        <Stack flexDirection="row" px={4} py={10} columnGap={4} rowGap={4} flexWrap={"wrap"} width={"100%"}>
            <Stack
                component="section"
                sx={{
                    backgroundColor: `${colors.primary[400]}`,
                    borderRadius: "18px",
                    padding: 4,
                    display: "flex",
                    flexDirection: "column",
                    boxShadow: 6,
                    rowGap: 1,
                    width: ["100%", "100%", "30%", "30%"],
                }}
            >
                <Box
                    sx={{
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "start",
                        alignItems: "center",
                        flexWrap: "wrap",
                    }}
                >
                    <PersonOutlinedIcon
                        color="inherit"
                        sx={{
                            fontSize: [12, 14, 16, 18],
                        }}
                    />
                    <Typography
                        color="inherit"
                        component={"span"}
                        sx={{
                            fontSize: [12, 14, 16, 18],
                        }}
                    >
                        {user?.userName}
                    </Typography>
                </Box>
                <Box
                    sx={{
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "start",
                        alignItems: "center",
                        columnGap: 0.5,
                        flexWrap: "wrap",
                    }}
                >
                    <EmailIcon
                        color="inherit"
                        sx={{
                            fontSize: [12, 14, 16, 18],
                        }}
                    />
                    <Typography
                        color="inherit"
                        component={"span"}
                        sx={{
                            fontSize: [12, 14, 16, 18],
                        }}
                    >
                        {user?.email}
                    </Typography>
                </Box>
                <Box>
                    <Typography
                        color="inherit"
                        sx={{
                            fontSize: [12, 14, 16, 18, 22],
                        }}
                        component={"span"}
                    >
                        Favorite Movies: {user?.favMovies?.length}
                    </Typography>
                </Box>
                <Box>
                    <Typography
                        color="inherit"
                        component={"span"}
                        sx={{
                            fontSize: [12, 14, 16, 18],
                        }}
                    >
                        Favorite Series: {user?.favSeries?.length}
                    </Typography>
                </Box>
                <Box>
                    <Typography
                        color="inherit"
                        component={"span"}
                        sx={{
                            fontSize: [12, 14, 16, 18],
                        }}
                    >
                        Favorite Actors: {user?.favActors?.length}
                    </Typography>
                </Box>
                <Box>
                    <Typography
                        color="inherit"
                        component={"span"}
                        sx={{
                            fontSize: [12, 14, 16, 18],
                        }}
                    >
                        Favorite Episodes: {user?.favEpisodes?.length}
                    </Typography>
                </Box>
                <Box>
                    <Typography
                        color="inherit"
                        component={"span"}
                        sx={{
                            fontSize: [12, 14, 16, 18],
                        }}
                    >
                        Favorite Seasons: {user?.favSeasons?.length}
                    </Typography>
                </Box>
                <Box>
                    <Typography
                        color="inherit"
                        component={"span"}
                        sx={{
                            fontSize: [12, 14, 16, 18],
                        }}
                    >
                        Movies Reviews: {user?.movieReviews?.length}
                    </Typography>
                </Box>
                <Box>
                    <Typography
                        color="inherit"
                        component={"span"}
                        sx={{
                            fontSize: [12, 14, 16, 18],
                        }}
                    >
                        Series Reviews: {user?.serieReviews?.length}
                    </Typography>
                </Box>
                <Box>
                    <Typography
                        color="inherit"
                        component={"span"}
                        sx={{
                            fontSize: [12, 14, 16, 18],
                        }}
                    >
                        Actor Reviews: {user?.actorReviews?.length}
                    </Typography>
                </Box>
                <Box>
                    <Typography
                        color="inherit"
                        component={"span"}
                        sx={{
                            fontSize: [12, 14, 16, 18],
                        }}
                    >
                        Season Reviews: {user?.seasonReviews?.length}
                    </Typography>
                </Box>
                <Box>
                    <Typography
                        color="inherit"
                        component={"span"}
                        sx={{
                            fontSize: [12, 14, 16, 18],
                        }}
                    >
                        Episode Reviews: {user?.episodeReviews?.length}
                    </Typography>
                </Box>
                <Box>
                    <Button
                        onClick={() => {
                            handleEditProfile();
                        }}
                        color="error"
                        variant="outlined"
                    >
                        <Typography
                            component={"span"}
                            sx={{
                                fontSize: [12, 14, 16, 18],
                                textTransform: "capitalize",
                            }}
                        >
                            Edit Profile
                        </Typography>
                    </Button>
                </Box>
            </Stack>
            <Box
                component="section"
                sx={{
                    backgroundColor: colors.primary[400],
                    borderRadius: "18px",
                    padding: 4,
                    boxShadow: 6,
                    width: ["100%", "100%", "65%", "65%"],
                }}
            >
                <Tabs value={tabValueFinal} onChange={handleChange} variant="fullWidth" orientation="horizontal">
                    <Tab
                        label="Favorite Movies"
                        tabIndex={0}
                        sx={{
                            backgroundColor: colors.blueAccent[700],
                            color: colors.primary[100],
                            fontWeight: "600",
                            fontSize: 14,
                            textTransform: "capitalize",
                        }}
                    />
                    <Tab
                        label="Favorite Series"
                        // eslint-disable-next-line jsx-a11y/tabindex-no-positive
                        tabIndex={1}
                        sx={{
                            backgroundColor: colors.blueAccent[700],
                            color: colors.primary[100],
                            fontWeight: "600",
                            fontSize: 14,
                            textTransform: "capitalize",
                        }}
                    />
                    <Tab
                        label="Favorite Actors"
                        tabIndex={0}
                        sx={{
                            backgroundColor: colors.blueAccent[700],
                            color: colors.primary[100],
                            fontWeight: "600",
                            fontSize: 14,
                            textTransform: "capitalize",
                        }}
                    />
                    <Tab
                        label="Favorite Seasons"
                        tabIndex={0}
                        sx={{
                            backgroundColor: colors.blueAccent[700],
                            color: colors.primary[100],
                            fontWeight: "600",
                            fontSize: 14,
                            textTransform: "capitalize",
                        }}
                    />
                    <Tab
                        label="Favorite Episodes"
                        tabIndex={0}
                        sx={{
                            backgroundColor: colors.blueAccent[700],
                            color: colors.primary[100],
                            fontWeight: "600",
                            fontSize: 14,
                            textTransform: "capitalize",
                        }}
                    />
                </Tabs>
                <TabPanel value={tabValueFinal} index={0}>
                    <FavoritesTab type={"Movies"} user={user} />
                </TabPanel>
                <TabPanel value={tabValueFinal} index={1}>
                    <FavoritesTab type={"Series"} user={user} />
                </TabPanel>
                <TabPanel value={tabValueFinal} index={2}>
                    <FavoritesTab type={"Actors"} user={user} />
                </TabPanel>
                <TabPanel value={tabValueFinal} index={3}>
                    <FavoritesTab type={"Seasons"} user={user} />
                </TabPanel>
                <TabPanel value={tabValueFinal} index={4}>
                    <FavoritesTab type={"Episodes"} user={user} />
                </TabPanel>
            </Box>
        </Stack>
    );
}
