"use client";

import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    Box,
    Button,
    IconButton,
    Stack,
    Tab,
    Tabs,
    Typography,
    useTheme,
} from "@mui/material";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import EmailIcon from "@mui/icons-material/Email";
import ClearAllIcon from "@mui/icons-material/ClearAll";
import SaveAsIcon from "@mui/icons-material/SaveAs";
import { useCallback, useRef, useState } from "react";
import { toast } from "react-toastify";
import * as CONSTANTS from "@/constants/Constants";
import * as Yup from "yup";
import { FormikProps } from "formik";
import TabPanel from "@/components/root/ui/tab/Tab";
import { useRightPanel } from "@/providers/RightPanelProvider";
import { useRouter } from "next/navigation";
import { tokens } from "@/utils/theme/theme";
import FavoritesTab from "./FavoritesTab";
import { acceptFollowRequest, follow, refuseFollowRequest, unfollow, updateUserById } from "@/lib/actions/user.actions";
import { showToast } from "@/lib/toast/toast";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import { on } from "stream";

interface IUserPageProps {
    userLoggedIn: any | null;
    userInPage: any | null;
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

export default function UserPage({ tabValue, userLoggedIn, userInPage }: IUserPageProps) {
    const [followersExpanded, setFollowersExpanded] = useState<boolean>(true);

    const router = useRouter();
    const { openRightPanel } = useRightPanel();

    const formikRef = useRef<FormikProps<any>>(null);
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);

    const tabValueFinal = ["favMovies", "favSeries", "favActors", "favSeasons", "favEpisodes"].indexOf(tabValue);

    // #region "Edit profile handler, tab change handler"
    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        const tabRoutes = ["favMovies", "favSeries", "favActors", "favSeasons", "favEpisodes"];

        if (newValue >= 0 && newValue < tabRoutes.length) {
            router.push(`/users/${userInPage.id}/${userInPage.userName}?tab=${tabRoutes[newValue]}`);
        } else {
            console.warn("Unknown tab index:", newValue);
        }
    };

    const handleEditProfile = useCallback(() => {
        openRightPanel({
            formRef: formikRef,
            initialValues: {
                id: userInPage?.id,
                userName: userInPage?.userName,
                email: userInPage?.email,
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
                        formikRef.current?.resetForm();
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
    }, [userInPage, openRightPanel]);

    // #endregion

    // #region "Follow, Unfollow, accept refuse follow handlers"
    async function onFollowUser() {
        if (!userLoggedIn || !userInPage) return;

        try {
            await follow(Number(userLoggedIn.id), Number(userInPage.id));
            showToast("success", "The follow request was succesfully made !");
        } catch (error) {
            if (error instanceof Error) {
                console.error(`Error making the follow request: ${error.message}`);
                showToast("error", `An error occurred: ${error.message}`);
            } else {
                console.error("Unknown error making a follow request.");
                showToast("error", "An unexpected error occurred making the follow request.");
            }
        }
    }

    async function onUnfollowser() {
        if (!userLoggedIn || !userInPage) return;

        try {
            await unfollow(Number(userLoggedIn.id), Number(userInPage.id));
            showToast("success", "The follow was succesfully removed!");
        } catch (error) {
            if (error instanceof Error) {
                console.error(`Error removing the follow request: ${error.message}`);
                showToast("error", `An error occurred: ${error.message}`);
            } else {
                console.error("Unknown error removing a follow request.");
                showToast("error", "An unexpected error occurred removing the follow request.");
            }
        }
    }

    async function onAcceptFollowUser(followerId: number) {
        if (!userLoggedIn || !userInPage) return;

        try {
            await acceptFollowRequest(followerId, Number(userLoggedIn.id));
            showToast("success", "The follow was succesfully accepted!");
            setFollowersExpanded(false);
        } catch (error) {
            if (error instanceof Error) {
                console.error(`Error accepting the follow request: ${error.message}`);
                showToast("error", `An error occurred: ${error.message}`);
            } else {
                console.error("Unknown error accepting the follow request.");
                showToast("error", "An unexpected error occurred accepting the follow request.");
            }
        }
    }

    async function onRefuseFollowUser(followerId: number) {
        if (!userLoggedIn || !userInPage) return;

        try {
            await refuseFollowRequest(followerId, Number(userLoggedIn.id));
            showToast("success", "The follow was succesfully refused!");
            setFollowersExpanded(false);
        } catch (error) {
            if (error instanceof Error) {
                console.error(`Error refusing the follow request: ${error.message}`);
                showToast("error", `An error occurred: ${error.message}`);
            } else {
                console.error("Unknown error refusing the follow request.");
                showToast("error", "An unexpected error occurred regusing the follow request.");
            }
        }
    }
    // #endregion

    return (
        <>
            {Number(userLoggedIn.id) === userInPage.id ||
            (userInPage.isFollowed && userInPage.isFollowedStatus === "accepted") ? (
                <Stack
                    flexDirection="row"
                    px={4}
                    py={10}
                    columnGap={4}
                    rowGap={4}
                    flexWrap={"wrap"}
                    width={"100%"}
                    alignItems="flex-start"
                    justifyContent="center"
                >
                    <Stack
                        component="section"
                        sx={{
                            backgroundColor: colors.primary[400],
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
                                alignItems: "center",
                                flexWrap: "wrap",
                            }}
                        >
                            <PersonOutlinedIcon
                                sx={{
                                    fontSize: 24,
                                    mr: 1,
                                    color: colors.primary[700],
                                }}
                            />
                            <Typography
                                variant="h6"
                                component="span"
                                sx={{ fontWeight: "bold", color: colors.primary[100] }}
                            >
                                {userInPage?.userName}
                            </Typography>
                            {Number(userLoggedIn.id) !== userInPage.id && (
                                <Button
                                    variant="outlined"
                                    onClick={!userInPage.isFollowed ? onFollowUser : onUnfollowser}
                                    // fullWidth={isMobile}
                                    sx={{
                                        color: colors.primary[100],
                                        bgcolor: !userInPage.isFollowed
                                            ? colors.redAccent[500]
                                            : colors.greenAccent[500],
                                        "&:hover": {
                                            bgcolor: colors.redAccent[900],
                                        },
                                        textTransform: "capitalize",
                                        fontSize: 16,
                                        ml: 4,
                                    }}
                                >
                                    {!userInPage.isFollowed
                                        ? "Follow"
                                        : userInPage.isFollowed && userInPage.isFollowedStatus === "pending"
                                          ? "Requested"
                                          : "Unfollow"}
                                </Button>
                            )}
                        </Box>
                        <Box
                            sx={{
                                display: "flex",
                                flexDirection: "row",
                                alignItems: "center",
                                columnGap: 0.5,
                                flexWrap: "wrap",
                            }}
                        >
                            <EmailIcon sx={{ fontSize: 20, color: colors.primary[700] }} />
                            <Typography variant="body2" sx={{ color: colors.primary[100] }}>
                                {userInPage?.email}
                            </Typography>
                        </Box>
                        <Box mt={2} display={"flex"} rowGap={4} flexDirection={"column"}>
                            <Box display={"flex"} rowGap={1} flexDirection={"column"}>
                                <Typography variant="body2" sx={{ color: colors.primary[100] }}>
                                    <strong>Favorite Movies:</strong> {userInPage?.favMovies?.length}
                                </Typography>
                                <Typography variant="body2" sx={{ color: colors.primary[100] }}>
                                    <strong>Favorite Series:</strong> {userInPage?.favSeries?.length}
                                </Typography>
                                <Typography variant="body2" sx={{ color: colors.primary[100] }}>
                                    <strong>Favorite Actors:</strong> {userInPage?.favActors?.length}
                                </Typography>
                                <Typography variant="body2" sx={{ color: colors.primary[100] }}>
                                    <strong>Favorite Episodes:</strong> {userInPage?.favEpisodes?.length}
                                </Typography>
                                <Typography variant="body2" sx={{ color: colors.primary[100] }}>
                                    <strong>Favorite Seasons:</strong> {userInPage?.favSeasons?.length}
                                </Typography>
                            </Box>
                            <Box display={"flex"} rowGap={1} flexDirection={"column"}>
                                <Typography variant="body2" sx={{ color: colors.primary[100] }}>
                                    <strong>Movie Reviews:</strong> {userInPage?.movieReviews?.length}
                                </Typography>
                                <Typography variant="body2" sx={{ color: colors.primary[100] }}>
                                    <strong>Series Reviews:</strong> {userInPage?.serieReviews?.length}
                                </Typography>
                                <Typography variant="body2" sx={{ color: colors.primary[100] }}>
                                    <strong>Actor Reviews:</strong> {userInPage?.actorReviews?.length}
                                </Typography>
                                <Typography variant="body2" sx={{ color: colors.primary[100] }}>
                                    <strong>Season Reviews:</strong> {userInPage?.seasonReviews?.length}
                                </Typography>
                                <Typography variant="body2" sx={{ color: colors.primary[100] }}>
                                    <strong>Episode Reviews:</strong> {userInPage?.episodeReviews?.length}
                                </Typography>
                            </Box>
                            {Number(userLoggedIn.id) === userInPage.id && (
                                <Box>
                                    <Accordion
                                        expanded={followersExpanded}
                                        onClick={() => setFollowersExpanded(!followersExpanded)}
                                    >
                                        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                            <Typography variant="body1">
                                                Follower Requests (
                                                {
                                                    userInPage?.followers.filter(
                                                        (userFollow: any) => userFollow.state === "pending",
                                                    ).length
                                                }
                                                )
                                            </Typography>
                                        </AccordionSummary>
                                        <AccordionDetails>
                                            {userInPage?.followers
                                                .filter((userFollow: any) => userFollow.state === "pending")
                                                .map((userFollow: any, index: number) => (
                                                    <Box
                                                        key={index}
                                                        display="flex"
                                                        alignItems="center"
                                                        justifyContent="space-between"
                                                        mb={1}
                                                    >
                                                        <Typography variant="body1">
                                                            {userFollow.follower.userName}
                                                        </Typography>
                                                        <Box>
                                                            <IconButton
                                                                color="success"
                                                                aria-label="accept"
                                                                onClick={() =>
                                                                    onAcceptFollowUser(userFollow.follower.id)
                                                                }
                                                            >
                                                                <CheckIcon />
                                                            </IconButton>
                                                            <IconButton
                                                                color="error"
                                                                aria-label="refuse"
                                                                onClick={() =>
                                                                    onRefuseFollowUser(userFollow.follower.id)
                                                                }
                                                            >
                                                                <CloseIcon />
                                                            </IconButton>
                                                        </Box>
                                                    </Box>
                                                ))}
                                        </AccordionDetails>
                                    </Accordion>
                                </Box>
                            )}
                        </Box>
                        {Number(userLoggedIn.id) === userInPage.id && (
                            <Button
                                onClick={handleEditProfile}
                                color="secondary"
                                variant="contained"
                                sx={{ mt: 2, textTransform: "capitalize", fontSize: 16, fontWeight: 600 }}
                                size="large"
                            >
                                Edit Profile
                            </Button>
                        )}
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
                        <Tabs value={tabValueFinal} onChange={handleChange} variant="fullWidth">
                            <Tab
                                label="Favorite Movies"
                                sx={{
                                    backgroundColor: colors.blueAccent[700],
                                    color: colors.primary[100],
                                    fontWeight: "bold",
                                    fontSize: 14,
                                    textTransform: "capitalize",
                                }}
                            />
                            <Tab
                                label="Favorite Series"
                                sx={{
                                    backgroundColor: colors.blueAccent[700],
                                    color: colors.primary[100],
                                    fontWeight: "bold",
                                    fontSize: 14,
                                    textTransform: "capitalize",
                                }}
                            />
                            <Tab
                                label="Favorite Actors"
                                sx={{
                                    backgroundColor: colors.blueAccent[700],
                                    color: colors.primary[100],
                                    fontWeight: "bold",
                                    fontSize: 14,
                                    textTransform: "capitalize",
                                }}
                            />
                            <Tab
                                label="Favorite Seasons"
                                sx={{
                                    backgroundColor: colors.blueAccent[700],
                                    color: colors.primary[100],
                                    fontWeight: "bold",
                                    fontSize: 14,
                                    textTransform: "capitalize",
                                }}
                            />
                            <Tab
                                label="Favorite Episodes"
                                sx={{
                                    backgroundColor: colors.blueAccent[700],
                                    color: colors.primary[100],
                                    fontWeight: "bold",
                                    fontSize: 14,
                                    textTransform: "capitalize",
                                }}
                            />
                        </Tabs>
                        <TabPanel value={tabValueFinal} index={0}>
                            <FavoritesTab type="Movies" userInPage={userInPage} userLoggedIn={userLoggedIn} />
                        </TabPanel>
                        <TabPanel value={tabValueFinal} index={1}>
                            <FavoritesTab type="Series" userInPage={userInPage} userLoggedIn={userLoggedIn} />
                        </TabPanel>
                        <TabPanel value={tabValueFinal} index={2}>
                            <FavoritesTab type="Actors" userInPage={userInPage} userLoggedIn={userLoggedIn} />
                        </TabPanel>
                        <TabPanel value={tabValueFinal} index={3}>
                            <FavoritesTab type="Seasons" userInPage={userInPage} userLoggedIn={userLoggedIn} />
                        </TabPanel>
                        <TabPanel value={tabValueFinal} index={4}>
                            <FavoritesTab type="Episodes" userInPage={userInPage} userLoggedIn={userLoggedIn} />
                        </TabPanel>
                    </Box>
                </Stack>
            ) : (
                <Box
                    display={"flex"}
                    justifyContent={"center"}
                    alignItems={"center"}
                    alignContent={"center"}
                    flexDirection="column"
                    rowGap={2}
                    height={"100vh"}
                >
                    <Box
                        sx={{
                            display: "flex",
                            flexDirection: "row",
                            alignItems: "start",
                            flexWrap: "wrap",
                        }}
                    >
                        <PersonOutlinedIcon
                            sx={{
                                fontSize: 24,
                                mr: 1,
                                color: colors.primary[700],
                            }}
                        />
                        <Typography
                            variant="h3"
                            component="span"
                            sx={{ fontWeight: "bold", color: colors.primary[100] }}
                        >
                            {userInPage?.userName}
                        </Typography>
                    </Box>
                    <Box
                        sx={{
                            display: "flex",
                            flexDirection: "row",
                            alignItems: "start",
                            columnGap: 0.5,
                            flexWrap: "wrap",
                        }}
                    >
                        <EmailIcon sx={{ fontSize: 20, color: colors.primary[700] }} />
                        <Typography variant="body1" sx={{ color: colors.primary[100] }}>
                            {userInPage?.email}
                        </Typography>
                    </Box>
                    <Typography variant="body1">
                        You cannot see anything from this user, you have to follow him first
                    </Typography>
                    <Button
                        variant="outlined"
                        onClick={!userInPage.isFollowed ? onFollowUser : onUnfollowser}
                        // fullWidth={isMobile}
                        sx={{
                            color: colors.primary[100],
                            bgcolor: !userInPage.isFollowed ? colors.redAccent[500] : colors.greenAccent[500],
                            "&:hover": {
                                bgcolor: colors.redAccent[900],
                            },
                            textTransform: "capitalize",
                            fontSize: 16,
                        }}
                    >
                        {!userInPage.isFollowed
                            ? "Follow"
                            : userInPage.isFollowed && userInPage.isFollowedStatus === "pending"
                              ? "Requested"
                              : "Unfollow"}
                    </Button>
                </Box>
            )}
        </>
    );
}
