"use client";

// #region Imports
import {
	Box,
	Button,
	List,
	ListItem,
	Popper,
	Paper,
	Typography,
	useTheme,
} from "@mui/material";
import Link from "next/link";
import { Genre } from "@prisma/client";
import { useStore } from "@/store/store";
import MuiNextLink from "../muiNextLink/MuiNextLink";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState, useEffect, useRef, JSX } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSession } from "next-auth/react";
import { Suspense } from "react";
import CircularProgress from "@mui/material/CircularProgress";

// #region Icons
import MovieIcon from "@mui/icons-material/Movie";
import TvIcon from "@mui/icons-material/Tv";
import CategoryIcon from "@mui/icons-material/Category";
import PersonIcon from "@mui/icons-material/Person";
import GroupIcon from "@mui/icons-material/Group";
import CollectionsBookmarkIcon from "@mui/icons-material/CollectionsBookmark";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import ThumbDownIcon from "@mui/icons-material/ThumbDown";
import RateReviewIcon from "@mui/icons-material/RateReview";
import LocalMoviesIcon from "@mui/icons-material/LocalMovies";
import LiveTvIcon from "@mui/icons-material/LiveTv";
import VideoLibraryIcon from "@mui/icons-material/VideoLibrary";
import OndemandVideoIcon from "@mui/icons-material/OndemandVideo";
import ForumIcon from "@mui/icons-material/Forum";
// #endregion
// #endregion

// #region Types
interface IHeaderLinksProps {
	genres: Genre[];
}
// #endregion

// #region Helper Components
const MyStuffLoadingButton = () => (
	<Button
		variant="text"
		component="div"
		disabled
		sx={{
			minWidth: "120px",
			"& .MuiCircularProgress-root": {
				marginRight: 1,
			},
		}}
		startIcon={<CircularProgress size={20} />}
	>
		My Stuff
	</Button>
);
// #endregion

export function HeaderLinks({ genres }: IHeaderLinksProps) {
	// #region State, Hooks
	const [genresOpen, setGenresOpen] = useState(false);
	const [peopleOpen, setPeopleOpen] = useState(false);
	const [myStuffOpen, setMyStuffOpen] = useState(false);
	const [genresAnchorEl, setGenresAnchorEl] = useState<null | HTMLElement>(
		null,
	);
	const [peopleAnchorEl, setPeopleAnchorEl] = useState<null | HTMLElement>(
		null,
	);
	const [myStuffAnchorEl, setMyStuffAnchorEl] = useState<null | HTMLElement>(
		null,
	);
	const [activeMainTab, setActiveMainTab] = useState<string | null>(null);
	const [isSubMenuHovered, setIsSubMenuHovered] = useState(false);

	const { isDrawerOpen, setIsDrawerOpen } = useStore();
	const { data: session } = useSession();

	const pathname = usePathname();
	const theme = useTheme();
	// #endregion

	// #region Refs
	// @ts-expect-error no parameters
	// eslint-disable-next-line no-undef
	const hoverTimeoutRef = useRef<NodeJS.Timeout>();
	const currentTargetRef = useRef<HTMLElement | null>(null);

	// @ts-expect-error no parameters
	// eslint-disable-next-line no-undef
	const subMenuTimeoutRef = useRef<NodeJS.Timeout>();
	const menuPaperRef = useRef<HTMLDivElement | null>(null);
	// #endregion

	// #region UseEffects
	useEffect(() => {
		handleGenresLeave();
		handlePeopleLeave();
		handleSubMenuLeave();
	}, [pathname]);

	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (
				myStuffOpen &&
				myStuffAnchorEl &&
				!myStuffAnchorEl.contains(event.target as Node) &&
				menuPaperRef.current &&
				!menuPaperRef.current.contains(event.target as Node)
			) {
				handleSubMenuLeave();
			}
		};

		document.addEventListener("mousedown", handleClickOutside);

		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, [myStuffOpen, myStuffAnchorEl]);
	// #endregion

	// #region Event Handlers
	const handleGenresHover = (event: React.MouseEvent<HTMLElement>) => {
		setGenresAnchorEl(event.currentTarget);
		setGenresOpen(true);
	};

	const handleGenresLeave = () => {
		setGenresOpen(false);
		setGenresAnchorEl(null);
	};

	const handlePeopleHover = (event: React.MouseEvent<HTMLElement>) => {
		setPeopleAnchorEl(event.currentTarget);
		setPeopleOpen(true);
	};

	const handlePeopleLeave = () => {
		setPeopleOpen(false);
		setPeopleAnchorEl(null);
	};

	const handleMyStuffHover = (event: React.MouseEvent<HTMLElement>) => {
		if (session?.user) {
			currentTargetRef.current = event.currentTarget;
			clearTimeout(hoverTimeoutRef.current);
			clearTimeout(subMenuTimeoutRef.current);

			// Open immediately without delay for better responsiveness
			setMyStuffAnchorEl(currentTargetRef.current);
			setMyStuffOpen(true);
		}
	};

	const handleMyStuffLeave = () => {
		clearTimeout(hoverTimeoutRef.current);

		if (!isSubMenuHovered) {
			// Increasing timeout to prevent accidental closures
			subMenuTimeoutRef.current = setTimeout(() => {
				setMyStuffOpen(false);
				setMyStuffAnchorEl(null);
				setActiveMainTab(null);
			}, 200);
		}
	};

	const handleSubMenuEnter = () => {
		clearTimeout(hoverTimeoutRef.current);
		clearTimeout(subMenuTimeoutRef.current);
		setIsSubMenuHovered(true);
	};

	const handleSubMenuLeave = () => {
		clearTimeout(hoverTimeoutRef.current);
		clearTimeout(subMenuTimeoutRef.current);

		// Adding a small delay before closing to improve user experience
		subMenuTimeoutRef.current = setTimeout(() => {
			setIsSubMenuHovered(false);
			setMyStuffOpen(false);
			setMyStuffAnchorEl(null);
			setActiveMainTab(null);
		}, 150);
	};

	const handleMainTabHover = (param: string) => {
		const tab = myStuffTabs.find((t) => t.param === param);

		if (!tab?.noSubMenu) {
			setActiveMainTab(param);
		}
	};
	// #endregion

	// #region Helper Functions
	const isActive = (path: string) => {
		if (path === "/") return pathname === "/";

		if (path === "/people") {
			return (
				pathname.startsWith("/actors") || pathname.startsWith("/crew")
			);
		}

		return pathname.startsWith(path);
	};

	const getButtonStyle = (path: string) => ({
		display: "flex",
		alignItems: "center",
		gap: 0.5,
		fontSize: "0.9rem",
		textTransform: "none",
		color: isActive(path)
			? // @ts-expect-error Color
				theme.vars.palette.green.main
			: theme.vars.palette.primary.main,
		borderBottom: isActive(path)
			? // @ts-expect-error Color
				`2px solid ${theme.vars.palette.green.main}`
			: "none",
		borderRadius: 0,
		fontWeight: 500,
		letterSpacing: "0.01em",
		height: 42,
		px: 1.5,
		minWidth: "auto",
		"&:hover": {
			backgroundColor: "transparent",
			// @ts-expect-error Color
			color: theme.vars.palette.green.main,
		},
	});

	const peopleLinks = [
		{ path: "/actors", name: "Actors", icon: <PersonIcon /> },
		{ path: "/crew", name: "Crew", icon: <GroupIcon /> },
	];

	const myStuffTabs = [
		{
			label: "Lists",
			icon: <CollectionsBookmarkIcon />,
			param: "lists",
			href: session?.user
				? `/users/${session.user.id}/${session.user.userName}/lists`
				: undefined,
			noSubMenu: true,
		},
		{ label: "Bookmarks", icon: <BookmarkIcon />, param: "bookmarks" },
		{ label: "Upvotes", icon: <ThumbUpIcon />, param: "upvotes" },
		{ label: "Downvotes", icon: <ThumbDownIcon />, param: "downvotes" },
		{ label: "Reviews", icon: <RateReviewIcon />, param: "reviews" },
	];

	const subTabs: Record<
		string,
		Array<{ label: string; icon: JSX.Element }>
	> = {
		bookmarks: [
			{ label: "Movies", icon: <LocalMoviesIcon /> },
			{ label: "Series", icon: <LiveTvIcon /> },
			{ label: "Seasons", icon: <VideoLibraryIcon /> },
			{ label: "Episodes", icon: <OndemandVideoIcon /> },
			{ label: "Actors", icon: <PersonIcon /> },
			{ label: "Crew", icon: <GroupIcon /> },
		],
		upvotes: [
			{ label: "Movies", icon: <LocalMoviesIcon /> },
			{ label: "Series", icon: <LiveTvIcon /> },
			{ label: "Seasons", icon: <VideoLibraryIcon /> },
			{ label: "Episodes", icon: <OndemandVideoIcon /> },
			{ label: "Actors", icon: <PersonIcon /> },
			{ label: "Crew", icon: <GroupIcon /> },
		],
		downvotes: [
			{ label: "Movies", icon: <LocalMoviesIcon /> },
			{ label: "Series", icon: <LiveTvIcon /> },
			{ label: "Seasons", icon: <VideoLibraryIcon /> },
			{ label: "Episodes", icon: <OndemandVideoIcon /> },
			{ label: "Actors", icon: <PersonIcon /> },
			{ label: "Crew", icon: <GroupIcon /> },
		],
		reviews: [
			{ label: "Movies", icon: <LocalMoviesIcon /> },
			{ label: "Series", icon: <LiveTvIcon /> },
			{ label: "Seasons", icon: <VideoLibraryIcon /> },
			{ label: "Episodes", icon: <OndemandVideoIcon /> },
			{ label: "Actors", icon: <PersonIcon /> },
			{ label: "Crew", icon: <GroupIcon /> },
		],
	};
	// #endregion

	// #region Render JSX
	return (
		<>
			{
				//#region Logo
			}
			<Box
				sx={{
					display: "flex",
					alignItems: "center",
					flex: "0 0 auto",
				}}
			>
				<Button
					LinkComponent={MuiNextLink}
					href={"/"}
					type="button"
					sx={{
						padding: 0,
						mr: { xs: 1, sm: 2 },
						minWidth: "auto",
						"&:hover": { backgroundColor: "transparent" },
					}}
					onClick={() => {
						if (isDrawerOpen) setIsDrawerOpen(false);
					}}
				>
					<Image
						src={"/icons/movielandia24-logo.png"}
						alt="MovieLandia24"
						height={55}
						width={170}
						priority
					/>
				</Button>
			</Box>
			{
				//#endregion
			}

			{
				//#region Navigation
			}
			<Box
				sx={{
					display: "flex",
					alignItems: "center",
					flex: "0 0 auto",
					flexWrap: { xs: "wrap", md: "nowrap" },
				}}
			>
				{
					//#region Navigation Links
				}
				<List
					sx={{
						display: "flex",
						flexDirection: "row",
						flexWrap: { xs: "wrap", md: "nowrap" },
						gap: { xs: 0.5, sm: 1 },
						m: 0,
						p: 0,
					}}
				>
					{
						//#region Movies Link
					}
					<ListItem
						sx={{ width: "auto", p: { xs: 0.125, sm: 0.25 } }}
					>
						<Button
							LinkComponent={MuiNextLink}
							href="/movies"
							variant="text"
							sx={{
								display: "flex",
								alignItems: "center",
								gap: 0.5,
								fontSize: "0.9rem",
								textTransform: "none",
								color: isActive("/movies")
									? "#4caf50"
									: theme.vars.palette.primary.main,
								borderBottom: isActive("/movies")
									? `2px solid #4caf50`
									: "none",
								borderRadius: 0,
								fontWeight: 500,
								letterSpacing: "0.01em",
								height: 42,
								px: 1.5,
								minWidth: "auto",
								"&:hover": {
									backgroundColor: "transparent",
									color: "#4caf50",
								},
							}}
							onClick={() => {
								if (isDrawerOpen) setIsDrawerOpen(false);
							}}
							startIcon={<MovieIcon />}
						>
							Movies
						</Button>
					</ListItem>
					{
						//#endregion Movies Link
					}

					{
						//#region TV Series Link
					}
					<ListItem
						sx={{ width: "auto", p: { xs: 0.125, sm: 0.25 } }}
					>
						<Button
							LinkComponent={MuiNextLink}
							href="/series"
							variant="text"
							sx={{
								display: "flex",
								alignItems: "center",
								gap: 0.5,
								fontSize: "0.9rem",
								textTransform: "none",
								color: isActive("/series")
									? "#4caf50"
									: theme.vars.palette.primary.main,
								borderBottom: isActive("/series")
									? `2px solid #4caf50`
									: "none",
								borderRadius: 0,
								fontWeight: 500,
								letterSpacing: "0.01em",
								height: 42,
								px: 1.5,
								minWidth: "auto",
								"&:hover": {
									backgroundColor: "transparent",
									color: "#4caf50",
								},
							}}
							onClick={() => {
								if (isDrawerOpen) setIsDrawerOpen(false);
							}}
							startIcon={<TvIcon />}
						>
							TV Series
						</Button>
					</ListItem>
					{
						//#endregion TV Series Link
					}

					{
						//#region Forum Link
					}
					<ListItem
						sx={{ width: "auto", p: { xs: 0.125, sm: 0.25 } }}
					>
						<Button
							LinkComponent={MuiNextLink}
							href="/forum"
							variant="text"
							sx={{
								display: "flex",
								alignItems: "center",
								gap: 0.5,
								fontSize: "0.9rem",
								textTransform: "none",
								color: isActive("/forum")
									? "#4caf50"
									: theme.vars.palette.primary.main,
								borderBottom: isActive("/forum")
									? `2px solid #4caf50`
									: "none",
								borderRadius: 0,
								fontWeight: 500,
								letterSpacing: "0.01em",
								height: 42,
								px: 1.5,
								minWidth: "auto",
								"&:hover": {
									backgroundColor: "transparent",
									color: "#4caf50",
								},
							}}
							onClick={() => {
								if (isDrawerOpen) setIsDrawerOpen(false);
							}}
							startIcon={<ForumIcon />}
						>
							Forum
						</Button>
					</ListItem>
					{
						//#endregion Forum Link
					}

					{
						//#region Cast & Crew Dropdown
					}
					<ListItem
						sx={{ width: "auto", p: { xs: 0.125, sm: 0.25 } }}
					>
						<Box
							onMouseEnter={handlePeopleHover}
							onMouseLeave={handlePeopleLeave}
						>
							<Button
								variant="text"
								component="div"
								disableRipple
								sx={{
									...getButtonStyle("/people"),
									cursor: "default",
									pointerEvents: "none",
								}}
								startIcon={<PersonIcon />}
							>
								Cast & Crew
							</Button>
							<Popper
								open={peopleOpen}
								anchorEl={peopleAnchorEl}
								placement={
									isDrawerOpen
										? "right-start"
										: "bottom-start"
								}
								sx={{
									zIndex: 1300,
									...(isDrawerOpen && {
										position: "fixed",
										left: "240px",
									}),
								}}
							>
								<AnimatePresence>
									{peopleOpen && (
										<motion.div
											initial={{ opacity: 0, y: -20 }}
											animate={{ opacity: 1, y: 0 }}
											exit={{ opacity: 0, y: -20 }}
											transition={{
												type: "spring",
												stiffness: 260,
												damping: 20,
											}}
											style={{ transformOrigin: "top" }}
										>
											<Paper
												sx={{ mt: 1, minWidth: 180 }}
											>
												{peopleLinks.map(
													(link, index) => (
														<motion.div
															key={link.path}
															initial={{
																opacity: 0,
																x: -20,
															}}
															animate={{
																opacity: 1,
																x: 0,
																transition: {
																	delay:
																		index *
																		0.1,
																},
															}}
														>
															<Link
																href={link.path}
																style={{
																	textDecoration:
																		"none",
																	color: theme
																		.vars
																		.palette
																		.primary
																		.main,
																}}
																onClick={() => {
																	if (
																		isDrawerOpen
																	)
																		setIsDrawerOpen(
																			false,
																		);
																	handlePeopleLeave();
																}}
															>
																<Box
																	sx={{
																		display:
																			"flex",
																		alignItems:
																			"center",
																		gap: 1,
																		p: 1.5,
																		"&:hover":
																			{
																				backgroundColor:
																					theme
																						.vars
																						.palette
																						.action
																						.hover,
																				color: theme
																					.vars
																					.palette
																					.primary
																					.main,
																			},
																	}}
																>
																	{link.icon}
																	<Typography
																		sx={{
																			fontSize:
																				"0.875rem",
																		}}
																	>
																		{
																			link.name
																		}
																	</Typography>
																</Box>
															</Link>
														</motion.div>
													),
												)}
											</Paper>
										</motion.div>
									)}
								</AnimatePresence>
							</Popper>
						</Box>
					</ListItem>
					{
						//#endregion Cast & Crew Dropdown
					}

					{
						//#region Genres Dropdown
					}
					<ListItem
						sx={{ width: "auto", p: { xs: 0.125, sm: 0.25 } }}
					>
						<Box
							onMouseEnter={handleGenresHover}
							onMouseLeave={handleGenresLeave}
						>
							<Button
								LinkComponent={MuiNextLink}
								href="/genres"
								variant="text"
								sx={getButtonStyle("/genres")}
								onClick={() => {
									if (isDrawerOpen) setIsDrawerOpen(false);
									handleGenresLeave();
								}}
								startIcon={<CategoryIcon />}
							>
								Genres
							</Button>
							<Popper
								open={genresOpen}
								anchorEl={genresAnchorEl}
								placement={
									isDrawerOpen
										? "right-start"
										: "bottom-start"
								}
								sx={{
									zIndex: 1300,
									...(isDrawerOpen && {
										position: "fixed",
										left: "240px",
									}),
								}}
							>
								<AnimatePresence>
									{genresOpen && (
										<motion.div
											initial={{
												opacity: 0,
												scale: 0.6,
												y: -40,
											}}
											animate={{
												opacity: 1,
												scale: 1,
												y: 0,
												transition: {
													type: "spring",
													stiffness: 200,
													damping: 20,
												},
											}}
											exit={{
												opacity: 0,
												scale: 0.6,
												y: -20,
												transition: {
													duration: 0.2,
												},
											}}
											style={{ transformOrigin: "top" }}
										>
											<Paper
												sx={{
													mt: 1,
													display: "grid",
													gridTemplateColumns:
														isDrawerOpen
															? "repeat(2, 1fr)"
															: "repeat(4, 1fr)",
													gap: isDrawerOpen ? 0.5 : 1,
													p: isDrawerOpen ? 1 : 2,
												}}
											>
												{genres.map((genre, index) => (
													<motion.div
														key={genre.id}
														initial={{
															opacity: 0,
															y: 20,
														}}
														animate={{
															opacity: 1,
															y: 0,
															transition: {
																delay:
																	index *
																	0.05,
																duration: 0.3,
															},
														}}
														whileHover={{
															scale: 1.1,
															rotate: [
																0, -2, 2, 0,
															],
															transition: {
																rotate: {
																	duration: 0.3,
																	repeat: 0,
																},
															},
														}}
													>
														<Link
															href={`/genres/${genre.id}/${genre.name}`}
															style={{
																textDecoration:
																	"none",
																color: theme
																	.vars
																	.palette
																	.primary
																	.main,
															}}
															onClick={() => {
																if (
																	isDrawerOpen
																) {
																	setIsDrawerOpen(
																		false,
																	);
																}

																handleGenresLeave();
															}}
														>
															<Box
																sx={{
																	cursor: "pointer",
																	padding:
																		isDrawerOpen
																			? 0.75
																			: 1,
																	textAlign:
																		"center",
																	transition:
																		"background-color 0.2s",
																	"&:hover": {
																		backgroundColor:
																			theme
																				.vars
																				.palette
																				.action
																				.hover,
																		color: theme
																			.vars
																			.palette
																			.primary
																			.main,
																	},
																}}
															>
																<Typography
																	component={
																		"span"
																	}
																	sx={{
																		fontSize:
																			"0.8rem",
																		fontWeight: 500,
																		letterSpacing:
																			"0.02em",
																		color: "inherit",
																	}}
																>
																	{genre.name}
																</Typography>
															</Box>
														</Link>
													</motion.div>
												))}
											</Paper>
										</motion.div>
									)}
								</AnimatePresence>
							</Popper>
						</Box>
					</ListItem>
					{
						//#endregion Genres Dropdown
					}

					{
						//#region My Stuff Dropdown
					}
					{session?.user && (
						<ListItem
							sx={{ width: "auto", p: { xs: 0.125, sm: 0.25 } }}
						>
							<Suspense fallback={<MyStuffLoadingButton />}>
								<Box
									onMouseEnter={handleMyStuffHover}
									onMouseLeave={handleMyStuffLeave}
									sx={{
										position: "relative",
										// Add a larger hover area to improve detection
										"&::before": {
											content: '""',
											position: "absolute",
											top: -5,
											left: -5,
											right: -5,
											bottom: -5,
											zIndex: -1,
										},
									}}
								>
									<Button
										variant="text"
										component="div"
										disableRipple
										sx={getButtonStyle("/users")}
										startIcon={<CollectionsBookmarkIcon />}
									>
										My Stuff
									</Button>
									<Popper
										open={myStuffOpen}
										anchorEl={myStuffAnchorEl}
										placement={
											isDrawerOpen
												? "right-start"
												: "bottom-start"
										}
										sx={{
											zIndex: 1300,
											...(isDrawerOpen && {
												position: "fixed",
												left: "240px",
											}),
										}}
										modifiers={[
											{
												name: "offset",
												options: {
													offset: [0, 5], // Add a small gap for better visual separation
												},
											},
											{
												name: "preventOverflow",
												enabled: true,
												options: {
													boundary: document.body,
												},
											},
										]}
									>
										<Paper
											ref={menuPaperRef}
											onMouseEnter={handleSubMenuEnter}
											onMouseLeave={handleSubMenuLeave}
											sx={{
												mt: 0.5,
												width: "auto",
												maxWidth: 450, // Maximum width for both menus combined
												display: "flex",
												boxShadow: 3,
												overflow: "hidden",
												"&::before": {
													content: '""',
													position: "absolute",
													top: -10,
													left: 0,
													right: 0,
													height: 10,
												},
											}}
										>
											<Box sx={{ width: 180 }}>
												{myStuffTabs.map(
													(tab, index) => (
														<motion.div
															key={tab.param}
															initial={{
																opacity: 0,
																x: -20,
															}}
															animate={{
																opacity: 1,
																x: 0,
																transition: {
																	delay:
																		index *
																		0.1,
																},
															}}
														>
															{tab.href ? (
																<Link
																	href={
																		tab.href
																	}
																	style={{
																		textDecoration:
																			"none",
																		color: theme
																			.vars
																			.palette
																			.primary
																			.main,
																	}}
																	onClick={() => {
																		if (
																			isDrawerOpen
																		)
																			setIsDrawerOpen(
																				false,
																			);
																		handleSubMenuLeave();
																		setActiveMainTab(
																			null,
																		);
																		setIsSubMenuHovered(
																			false,
																		);
																	}}
																>
																	<Box
																		onMouseEnter={() => {
																			if (
																				!tab.noSubMenu
																			) {
																				handleMainTabHover(
																					tab.param,
																				);
																			} else {
																				// For Lists, clear any active sub-menu
																				setActiveMainTab(
																					null,
																				);
																			}
																		}}
																		sx={{
																			display:
																				"flex",
																			alignItems:
																				"center",
																			gap: 1,
																			px: 2,
																			py: 1.5,
																			transition:
																				"all 0.2s",
																			bgcolor:
																				activeMainTab ===
																				tab.param
																					? "action.selected"
																					: "transparent",
																			"&:hover":
																				{
																					backgroundColor:
																						theme
																							.vars
																							.palette
																							.action
																							.hover,
																					color: "#4caf50",
																				},
																		}}
																	>
																		{
																			tab.icon
																		}
																		<Typography
																			sx={{
																				fontSize:
																					"0.875rem",
																			}}
																		>
																			{
																				tab.label
																			}
																		</Typography>
																	</Box>
																</Link>
															) : (
																<Box
																	onMouseEnter={() =>
																		handleMainTabHover(
																			tab.param,
																		)
																	}
																	sx={{
																		display:
																			"flex",
																		alignItems:
																			"center",
																		gap: 1,
																		px: 2,
																		py: 1.5,
																		transition:
																			"all 0.2s",
																		bgcolor:
																			activeMainTab ===
																			tab.param
																				? "action.selected"
																				: "transparent",
																		"&:hover":
																			{
																				backgroundColor:
																					theme
																						.vars
																						.palette
																						.action
																						.hover,
																				color: "#4caf50",
																			},
																	}}
																>
																	{tab.icon}
																	<Typography
																		sx={{
																			fontSize:
																				"0.875rem",
																		}}
																	>
																		{
																			tab.label
																		}
																	</Typography>
																</Box>
															)}
														</motion.div>
													),
												)}
											</Box>
											<AnimatePresence>
												{activeMainTab && (
													<motion.div
														initial={{
															opacity: 0,
															x: -10,
														}}
														animate={{
															opacity: 1,
															x: 0,
														}}
														exit={{
															opacity: 0,
															x: -10,
														}}
														transition={{
															duration: 0.2,
														}}
													>
														<Paper
															elevation={0}
															sx={{
																width: 180,
																borderLeft: 1,
																borderColor:
																	"divider",
																backgroundColor:
																	"transparent",
															}}
														>
															{subTabs[
																activeMainTab
															]?.map(
																(
																	subTab,
																	index,
																) => (
																	<motion.div
																		key={`${subTab.label}-${index}`}
																		initial={{
																			opacity: 0,
																			x: -20,
																		}}
																		animate={{
																			opacity: 1,
																			x: 0,
																			transition:
																				{
																					delay:
																						index *
																						0.1,
																				},
																		}}
																	>
																		<Link
																			href={`/users/${session.user.id}/${session.user.userName}?maintab=${activeMainTab}&subtab=${subTab.label.toLowerCase()}`}
																			style={{
																				textDecoration:
																					"none",
																				color: theme
																					.vars
																					.palette
																					.primary
																					.main,
																			}}
																			onClick={() => {
																				if (
																					isDrawerOpen
																				)
																					setIsDrawerOpen(
																						false,
																					);
																				handleSubMenuLeave();
																			}}
																		>
																			<Box
																				sx={{
																					display:
																						"flex",
																					alignItems:
																						"center",
																					gap: 1,
																					px: 2,
																					py: 1.5,
																					transition:
																						"all 0.2s",
																					"&:hover":
																						{
																							backgroundColor:
																								theme
																									.vars
																									.palette
																									.action
																									.hover,
																							color: "#4caf50",
																						},
																				}}
																			>
																				{
																					subTab.icon
																				}
																				<Typography
																					sx={{
																						fontSize:
																							"0.875rem",
																					}}
																				>
																					{
																						subTab.label
																					}
																				</Typography>
																			</Box>
																		</Link>
																	</motion.div>
																),
															)}
														</Paper>
													</motion.div>
												)}
											</AnimatePresence>
										</Paper>
									</Popper>
								</Box>
							</Suspense>
						</ListItem>
					)}
					{
						//#endregion My Stuff Dropdown
					}
				</List>
				{
					//#endregion Navigation Links
				}
			</Box>
			{
				//#endregion Navigation
			}
		</>
	);
	// #endregion
}
