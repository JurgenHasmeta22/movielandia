"use client";

import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    Box,
    Button,
    CssVarsTheme,
    IconButton,
    Stack,
    Tab,
    Tabs,
    TextField,
    Typography,
    useTheme,
} from "@mui/material";
import { useEffect, useState } from "react";
import TabPanel from "@/components/root/ui/tab/Tab";
import { useRouter } from "next/navigation";

import FavoritesTab from "./FavoritesTab";
import { acceptFollowRequest, follow, refuseFollowRequest, unfollow, updateUserById } from "@/lib/actions/user.actions";
import { showToast } from "@/lib/toast/toast";
import Image from "next/image";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import DescriptionIcon from "@mui/icons-material/Description";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Cancel";
import EditIcon from "@mui/icons-material/Edit";
import PersonIcon from "@mui/icons-material/Person";
import EmailIcon from "@mui/icons-material/Email";

interface IUserPageProps {
    userLoggedIn: any | null;
    userInPage: any | null;
    tabValue: string;
}

export default function UserPage({ tabValue, userLoggedIn, userInPage }: IUserPageProps) {
    // #region "State, hooks, router, theme usage call"
    const [followersExpanded, setFollowersExpanded] = useState<boolean>(
        userInPage?.followers?.filter((userFollow: any) => userFollow.state === "pending").length > 0 ? true : false,
    );

    const [bio, setBio] = useState<string>(userInPage?.bio || "");
    const [isBioEditing, setIsBioEditing] = useState<boolean>(false);

    const [userName, setUserName] = useState<string>(userInPage?.userName || "");
    const [isUserNameEditing, setIsUserNameEditing] = useState<boolean>(false);

    const [email, setEmail] = useState<string>(userInPage?.email || "");
    const [isEmailEditing, setIsEmailEditing] = useState<boolean>(false);

    const router = useRouter();

    const theme: CssVarsTheme = useTheme();

    // useEffect(() => {
    //     setBio(userInPage?.bio || "");
    //     setUserName(userInPage?.userName || "");
    //     setEmail(userInPage?.email || "");
    // }, [userInPage]);
    // #endregion

    // #region "Tab logic"
    const tabValueFinal = ["favMovies", "favSeries", "favActors", "favSeasons", "favEpisodes"].indexOf(tabValue);

    const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
        const tabRoutes = ["favMovies", "favSeries", "favActors", "favSeasons", "favEpisodes"];

        if (newValue >= 0 && newValue < tabRoutes.length) {
            router.push(`/users/${userInPage.id}/${userInPage.userName}?tab=${tabRoutes[newValue]}`);
        } else {
            console.warn("Unknown tab index:", newValue);
        }
    };
    // #endregion

    // #region "Edit bio, username, email handlers"
    const handleBioChange = (event: any) => {
        setBio(event.target.value);
    };

    const handleUserNameChange = (event: any) => {
        setUserName(event.target.value);
    };

    const handleEmailChange = (event: any) => {
        setEmail(event.target.value);
    };

    async function handleSaveEditBio() {
        try {
            await updateUserById({ bio }, Number(userInPage?.id));
            showToast("success", "Bio updated succesfully");
            setIsBioEditing(false);
        } catch (error) {
            if (error instanceof Error) {
                console.error(`Error updating the bio of user: ${error.message}`);
                showToast("error", `An error occurred: ${error.message}`);
            } else {
                console.error("Unknown error updating bio of user.");
                showToast("error", "An unexpected error occurred while updating bio of user.");
            }
        }
    }

    async function handleSaveEditUserName() {
        try {
            await updateUserById({ userName }, Number(userInPage?.id));
            showToast("success", "Username updated succesfully");
            setIsUserNameEditing(false);
        } catch (error) {
            if (error instanceof Error) {
                console.error(`Error updating the username of user: ${error.message}`);
                showToast("error", `An error occurred: ${error.message}`);
            } else {
                console.error("Unknown error updating username of user.");
                showToast("error", "An unexpected error occurred while updating username of user.");
            }
        }
    }

    async function handleSaveEditEmail() {
        try {
            await updateUserById({ email }, Number(userInPage?.id));
            showToast("success", "Email updated succesfully");
            setIsEmailEditing(false);
        } catch (error) {
            if (error instanceof Error) {
                console.error(`Error updating the email of user: ${error.message}`);
                showToast("error", `An error occurred: ${error.message}`);
            } else {
                console.error("Unknown error updating email of user.");
                showToast("error", "An unexpected error occurred while updating email of user.");
            }
        }
    }
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

    async function onUnfollowUser() {
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
                            backgroundColor: theme.vars.palette.background,
                            borderRadius: "18px",
                            padding: 4,
                            display: "flex",
                            flexDirection: "column",
                            boxShadow: 6,
                            width: ["100%", "100%", "30%", "30%"],
                        }}
                    >
                        <Box>
                            {isUserNameEditing ? (
                                <>
                                    <TextField
                                        variant="outlined"
                                        fullWidth
                                        value={userName}
                                        onChange={handleUserNameChange}
                                        multiline
                                        rows={2}
                                        sx={{ marginTop: 2, color: theme.vars.palette.primary.main }}
                                    />
                                    <Box display="flex" flexDirection="row">
                                        <IconButton
                                            onClick={handleSaveEditUserName}
                                            sx={{
                                                color: theme.vars.palette.primary.main,
                                                "&:hover": {
                                                    color: theme.vars.palette.secondary[100],
                                                },
                                            }}
                                        >
                                            <SaveIcon sx={{ pr: 1 }} />
                                            Save
                                        </IconButton>
                                        <IconButton
                                            onClick={() => {
                                                setIsUserNameEditing(false);
                                                setUserName(userInPage?.userName);
                                            }}
                                            sx={{
                                                color: theme.vars.palette.primary.main,
                                                "&:hover": {
                                                    color: theme.vars.palette.secondary[100],
                                                },
                                            }}
                                        >
                                            <CancelIcon sx={{ pr: 1 }} />
                                            Discard
                                        </IconButton>
                                    </Box>
                                </>
                            ) : (
                                <Box display="flex" justifyContent="space-between" alignItems="center">
                                    <Box
                                        display="flex"
                                        flexDirection="row"
                                        alignItems="center"
                                        columnGap={0.5}
                                        flexWrap="wrap"
                                    >
                                        <PersonIcon sx={{ fontSize: 18, color: theme.vars.palette.primary.main }} />
                                        <Typography variant="body2" sx={{ color: theme.vars.palette.primary.main }}>
                                            Username: {userName}
                                        </Typography>
                                    </Box>
                                    {Number(userLoggedIn.id) === userInPage.id && (
                                        <Button
                                            variant="text"
                                            onClick={() => setIsUserNameEditing(true)}
                                            sx={{
                                                "&:hover": {
                                                    bgcolor: theme.vars.palette.secondary[100],
                                                },
                                                ml: 2,
                                            }}
                                        >
                                            <EditIcon sx={{ fontSize: 18, color: theme.vars.palette.primary.main }} />
                                        </Button>
                                    )}
                                </Box>
                            )}
                        </Box>
                        <Box>
                            {Number(userLoggedIn.id) !== userInPage.id && (
                                <Button
                                    variant="outlined"
                                    onClick={!userInPage.isFollowed ? onFollowUser : onUnfollowUser}
                                    sx={{
                                        color: theme.vars.palette.primary.main,
                                        bgcolor: !userInPage.isFollowed
                                            ? theme.vars.palette.secondary[300]
                                            : theme.vars.palette.secondary[900],
                                        "&:hover": {
                                            bgcolor: theme.vars.palette.secondary[300],
                                        },
                                        textTransform: "capitalize",
                                        fontSize: 18,
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
                        <Box>
                            {isEmailEditing ? (
                                <>
                                    <TextField
                                        variant="outlined"
                                        fullWidth
                                        value={email}
                                        onChange={handleEmailChange}
                                        multiline
                                        rows={2}
                                        sx={{ marginTop: 2, color: theme.vars.palette.primary.main }}
                                    />
                                    <Box display="flex" flexDirection="row">
                                        <IconButton
                                            onClick={handleSaveEditEmail}
                                            sx={{
                                                color: theme.vars.palette.primary.main,
                                                "&:hover": {
                                                    color: theme.vars.palette.secondary[100],
                                                },
                                            }}
                                        >
                                            <SaveIcon sx={{ pr: 1 }} />
                                            Save
                                        </IconButton>
                                        <IconButton
                                            onClick={() => {
                                                setIsEmailEditing(false);
                                                setEmail(userInPage?.email);
                                            }}
                                            sx={{
                                                color: theme.vars.palette.primary.main,
                                                "&:hover": {
                                                    color: theme.vars.palette.secondary[100],
                                                },
                                            }}
                                        >
                                            <CancelIcon sx={{ pr: 1 }} />
                                            Discard
                                        </IconButton>
                                    </Box>
                                </>
                            ) : (
                                <Box display="flex" justifyContent="space-between" alignItems="center">
                                    <Box
                                        display="flex"
                                        flexDirection="row"
                                        alignItems="center"
                                        columnGap={0.5}
                                        flexWrap="wrap"
                                    >
                                        <EmailIcon sx={{ fontSize: 18, color: theme.vars.palette.primary.main }} />
                                        <Typography variant="body2" sx={{ color: theme.vars.palette.primary.main }}>
                                            Email: {email}
                                        </Typography>
                                    </Box>
                                    {Number(userLoggedIn.id) === userInPage.id && (
                                        <Button
                                            variant="text"
                                            onClick={() => setIsEmailEditing(true)}
                                            sx={{
                                                "&:hover": {
                                                    bgcolor: theme.vars.palette.secondary[100],
                                                },
                                                ml: 2,
                                            }}
                                        >
                                            <EditIcon sx={{ fontSize: 18, color: theme.vars.palette.primary.main }} />
                                        </Button>
                                    )}
                                </Box>
                            )}
                        </Box>
                        <Box>
                            {isBioEditing ? (
                                <>
                                    <TextField
                                        variant="outlined"
                                        fullWidth
                                        value={bio}
                                        onChange={handleBioChange}
                                        multiline
                                        rows={2}
                                        sx={{ marginTop: 2, color: theme.vars.palette.primary.main }}
                                    />
                                    <Box display="flex" flexDirection="row">
                                        <IconButton
                                            onClick={handleSaveEditBio}
                                            sx={{
                                                color: theme.vars.palette.primary.main,
                                                "&:hover": {
                                                    color: theme.vars.palette.secondary[100],
                                                },
                                            }}
                                        >
                                            <SaveIcon sx={{ pr: 1 }} />
                                            Save
                                        </IconButton>
                                        <IconButton
                                            onClick={() => {
                                                setIsBioEditing(false);
                                                setBio(userInPage?.bio);
                                            }}
                                            sx={{
                                                color: theme.vars.palette.primary.main,
                                                "&:hover": {
                                                    color: theme.vars.palette.secondary[100],
                                                },
                                            }}
                                        >
                                            <CancelIcon sx={{ pr: 1 }} />
                                            Discard
                                        </IconButton>
                                    </Box>
                                </>
                            ) : (
                                <Box display="flex" justifyContent="space-between" alignItems="center">
                                    <Box
                                        display="flex"
                                        flexDirection="row"
                                        alignItems="center"
                                        columnGap={0.5}
                                        flexWrap="wrap"
                                    >
                                        <DescriptionIcon
                                            sx={{ fontSize: 18, color: theme.vars.palette.primary.main }}
                                        />
                                        <Typography variant="body2" sx={{ color: theme.vars.palette.primary.main }}>
                                            Bio: {bio}
                                        </Typography>
                                    </Box>
                                    {Number(userLoggedIn.id) === userInPage.id && (
                                        <Button
                                            variant="text"
                                            onClick={() => setIsBioEditing(true)}
                                            sx={{
                                                "&:hover": {
                                                    bgcolor: theme.vars.palette.secondary[100],
                                                },
                                                ml: 2,
                                            }}
                                        >
                                            <EditIcon sx={{ fontSize: 18, color: theme.vars.palette.primary.main }} />
                                        </Button>
                                    )}
                                </Box>
                            )}
                        </Box>
                        <Box mt={2} display={"flex"} rowGap={2} flexDirection={"column"}>
                            <Accordion>
                                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                    <Typography variant="h5">Bookmarks</Typography>
                                </AccordionSummary>
                                <AccordionDetails>
                                    <Typography variant="body2" sx={{ color: theme.vars.palette.primary.main }}>
                                        <strong>Favorite Movies:</strong> {userInPage?.favMovies?.length}
                                    </Typography>
                                    <Typography variant="body2" sx={{ color: theme.vars.palette.primary.main }}>
                                        <strong>Favorite Series:</strong> {userInPage?.favSeries?.length}
                                    </Typography>
                                    <Typography variant="body2" sx={{ color: theme.vars.palette.primary.main }}>
                                        <strong>Favorite Actors:</strong> {userInPage?.favActors?.length}
                                    </Typography>
                                    <Typography variant="body2" sx={{ color: theme.vars.palette.primary.main }}>
                                        <strong>Favorite Episodes:</strong> {userInPage?.favEpisodes?.length}
                                    </Typography>
                                    <Typography variant="body2" sx={{ color: theme.vars.palette.primary.main }}>
                                        <strong>Favorite Seasons:</strong> {userInPage?.favSeasons?.length}
                                    </Typography>
                                </AccordionDetails>
                            </Accordion>
                            <Accordion>
                                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                    <Typography variant="h5">Reviews</Typography>
                                </AccordionSummary>
                                <AccordionDetails>
                                    <Typography variant="body2" sx={{ color: theme.vars.palette.primary.main }}>
                                        <strong>Movie Reviews:</strong> {userInPage?.movieReviews?.length}
                                    </Typography>
                                    <Typography variant="body2" sx={{ color: theme.vars.palette.primary.main }}>
                                        <strong>Series Reviews:</strong> {userInPage?.serieReviews?.length}
                                    </Typography>
                                    <Typography variant="body2" sx={{ color: theme.vars.palette.primary.main }}>
                                        <strong>Actor Reviews:</strong> {userInPage?.actorReviews?.length}
                                    </Typography>
                                    <Typography variant="body2" sx={{ color: theme.vars.palette.primary.main }}>
                                        <strong>Season Reviews:</strong> {userInPage?.seasonReviews?.length}
                                    </Typography>
                                    <Typography variant="body2" sx={{ color: theme.vars.palette.primary.main }}>
                                        <strong>Episode Reviews:</strong> {userInPage?.episodeReviews?.length}
                                    </Typography>
                                </AccordionDetails>
                            </Accordion>
                            <Accordion>
                                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                    <Typography variant="h5">Upvotes</Typography>
                                </AccordionSummary>
                                <AccordionDetails>
                                    <Typography variant="body2" sx={{ color: theme.vars.palette.primary.main }}>
                                        <strong>Upvoted Movies:</strong> {userInPage?.movieReviewsUpvoted?.length}
                                    </Typography>
                                    <Typography variant="body2" sx={{ color: theme.vars.palette.primary.main }}>
                                        <strong>Upvoted Series:</strong> {userInPage?.serieReviewsUpvoted?.length}
                                    </Typography>
                                    <Typography variant="body2" sx={{ color: theme.vars.palette.primary.main }}>
                                        <strong>Upvoted Actors:</strong> {userInPage?.actorReviewsUpvoted?.length}
                                    </Typography>
                                    <Typography variant="body2" sx={{ color: theme.vars.palette.primary.main }}>
                                        <strong>Upvoted Episodes:</strong> {userInPage?.episodeReviewsUpvoted?.length}
                                    </Typography>
                                    <Typography variant="body2" sx={{ color: theme.vars.palette.primary.main }}>
                                        <strong>Upvoted Seasons:</strong> {userInPage?.seasonReviewsUpvoted?.length}
                                    </Typography>
                                </AccordionDetails>
                            </Accordion>
                            <Accordion>
                                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                    <Typography variant="h5">Downvotes</Typography>
                                </AccordionSummary>
                                <AccordionDetails>
                                    <Typography variant="body2" sx={{ color: theme.vars.palette.primary.main }}>
                                        <strong>Downvoted Movies:</strong> {userInPage?.movieReviewsDownvoted?.length}
                                    </Typography>
                                    <Typography variant="body2" sx={{ color: theme.vars.palette.primary.main }}>
                                        <strong>Downvoted Series:</strong> {userInPage?.serieReviewsDownvoted?.length}
                                    </Typography>
                                    <Typography variant="body2" sx={{ color: theme.vars.palette.primary.main }}>
                                        <strong>Downvoted Actors:</strong> {userInPage?.actorReviewsDownvoted?.length}
                                    </Typography>
                                    <Typography variant="body2" sx={{ color: theme.vars.palette.primary.main }}>
                                        <strong>Downvoted Episodes:</strong>{" "}
                                        {userInPage?.episodeReviewsDownvoted?.length}
                                    </Typography>
                                    <Typography variant="body2" sx={{ color: theme.vars.palette.primary.main }}>
                                        <strong>Downvoted Seasons:</strong> {userInPage?.seasonReviewsDownvoted?.length}
                                    </Typography>
                                </AccordionDetails>
                            </Accordion>
                            <Accordion>
                                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                    <Typography variant="h5">Social</Typography>
                                </AccordionSummary>
                                <AccordionDetails>
                                    <Typography variant="body2" sx={{ color: theme.vars.palette.primary.main }}>
                                        <strong>Followers:</strong> {userInPage?.followers?.length}
                                    </Typography>
                                    <Typography variant="body2" sx={{ color: theme.vars.palette.primary.main }}>
                                        <strong>Following:</strong> {userInPage?.following?.length}
                                    </Typography>
                                </AccordionDetails>
                            </Accordion>
                            {Number(userLoggedIn.id) === userInPage.id && (
                                <Box>
                                    <Accordion
                                        expanded={followersExpanded}
                                        onClick={() => setFollowersExpanded(!followersExpanded)}
                                    >
                                        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                            <Typography variant="h5">
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
                    </Stack>
                    <Box
                        component="section"
                        sx={{
                            backgroundColor: theme.vars.palette.background,
                            borderRadius: "18px",
                            padding: 4,
                            boxShadow: 6,
                            width: ["100%", "100%", "65%", "65%"],
                        }}
                    >
                        <Tabs value={tabValueFinal} onChange={handleTabChange} variant="fullWidth">
                            <Tab
                                label="Favorite Movies"
                                sx={{
                                    backgroundColor: theme.vars.palette.secondary[200],
                                    color: theme.vars.palette.primary.main,
                                    fontWeight: "bold",
                                    fontSize: 14,
                                    textTransform: "capitalize",
                                }}
                            />
                            <Tab
                                label="Favorite Series"
                                sx={{
                                    backgroundColor: theme.vars.palette.secondary[200],
                                    color: theme.vars.palette.primary.main,
                                    fontWeight: "bold",
                                    fontSize: 14,
                                    textTransform: "capitalize",
                                }}
                            />
                            <Tab
                                label="Favorite Actors"
                                sx={{
                                    backgroundColor: theme.vars.palette.secondary[200],
                                    color: theme.vars.palette.primary.main,
                                    fontWeight: "bold",
                                    fontSize: 14,
                                    textTransform: "capitalize",
                                }}
                            />
                            <Tab
                                label="Favorite Seasons"
                                sx={{
                                    backgroundColor: theme.vars.palette.secondary[200],
                                    color: theme.vars.palette.primary.main,
                                    fontWeight: "bold",
                                    fontSize: 14,
                                    textTransform: "capitalize",
                                }}
                            />
                            <Tab
                                label="Favorite Episodes"
                                sx={{
                                    backgroundColor: theme.vars.palette.secondary[200],
                                    color: theme.vars.palette.primary.main,
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
                        {userInPage?.avatar?.photoSrc ? (
                            <Image
                                alt={userInPage?.userName}
                                height={50}
                                width={50}
                                style={{
                                    borderRadius: 20,
                                }}
                                src={userInPage?.avatar?.photoSrc}
                            />
                        ) : (
                            <PersonIcon
                                sx={{
                                    fontSize: 18,
                                    color: theme.vars.palette.primary.main,
                                }}
                            />
                        )}
                        <Typography variant="h3" component="span" sx={{ color: theme.vars.palette.primary.main }}>
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
                        <EmailIcon sx={{ fontSize: 18, color: theme.vars.palette.primary.main }} />
                        <Typography variant="body1" sx={{ color: theme.vars.palette.primary.main }}>
                            {userInPage?.email}
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
                        <DescriptionIcon sx={{ fontSize: 18, color: theme.vars.palette.primary.main }} />
                        <Typography variant="body1">{userInPage?.bio}</Typography>
                    </Box>
                    <Typography variant="body1">
                        You cannot see anything from this user, you have to follow him first
                    </Typography>
                    <Button
                        variant="outlined"
                        onClick={!userInPage.isFollowed ? onFollowUser : onUnfollowUser}
                        sx={{
                            color: theme.vars.palette.primary.main,
                            bgcolor: !userInPage.isFollowed
                                ? theme.vars.palette.secondary[300]
                                : theme.vars.palette.secondary[900],
                            "&:hover": {
                                bgcolor: theme.vars.palette.secondary[300],
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
