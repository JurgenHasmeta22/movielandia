// "use client"

// import { AppBar, Box, IconButton, Menu, MenuItem, Toolbar, Typography, useTheme } from "@mui/material";
// import { useContext, useState } from "react";
// import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
// import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
// import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
// import { tokens, ColorModeContext } from "@/utils/theme";
// import { useStore } from "@/store/store";
// import MenuIcon from "@mui/icons-material/Menu";

// const TopBar = () => {
//     const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
//     const { user, setUser, isOpenSidebarAdmin, setIsOpenSidebarAdmin } = useStore();
//     const navigate = useNavigate();
//     const colorMode = useContext(ColorModeContext);
//     const { removeItem } = useLocalStorage("token");
//     const open = Boolean(anchorEl);
//     const theme = useTheme();
//     const colors = tokens(theme.palette.mode);

//     const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
//         setAnchorEl(event.currentTarget);
//     };

//     const handleClose = () => {
//         setAnchorEl(null);
//     };

//     const handleLogout = () => {
//         setUser(null);
//         removeItem();
//         handleClose();
//         navigate("/login");
//     };

//     const handleRedirectToProfile = () => {
//         navigate("/profile", {
//             state: {
//                 userId: user?.id,
//                 from: "Admin",
//             },
//         });
//     };

//     return (
//         <AppBar position="static" component={"header"}>
//             <Toolbar
//                 sx={{
//                     display: "flex",
//                     justifyContent: "space-between",
//                     backgroundColor: colors.primary[900],
//                 }}
//                 component={"nav"}
//             >
//                 <Box display={"flex"} justifyContent={"start"}>
//                     {!isOpenSidebarAdmin && (
//                         <IconButton
//                             onClick={() => {
//                                 setIsOpenSidebarAdmin(true);
//                             }}
//                         >
//                             <MenuIcon fontSize="medium" />
//                         </IconButton>
//                     )}
//                 </Box>
//                 <Box display={"flex"} flexDirection={"row"}>
//                     <IconButton onClick={colorMode.toggleColorMode}>
//                         {theme.palette.mode === "dark" ? <DarkModeOutlinedIcon /> : <LightModeOutlinedIcon />}
//                     </IconButton>
//                     <IconButton
//                         id="buttonProfile"
//                         aria-controls={open ? "menuProfile" : undefined}
//                         aria-haspopup="true"
//                         aria-expanded={open ? "true" : undefined}
//                         onClick={handleClick}
//                         sx={{ display: "flex", flexDirection: "row", gap: "10px" }}
//                     >
//                         <PersonOutlinedIcon color="action" fontSize="medium" />
//                         <Typography
//                             component={"span"}
//                             style={{
//                                 fontSize: 16,
//                             }}
//                         >
//                             {user?.userName}
//                         </Typography>
//                     </IconButton>
//                     <Menu
//                         id="menuProfile"
//                         anchorEl={anchorEl}
//                         open={open}
//                         onClose={handleClose}
//                         MenuListProps={{
//                             "aria-labelledby": "buttonProfile",
//                         }}
//                     >
//                         <MenuItem onClick={handleRedirectToProfile} style={{ color: colors.primary[100] }}>
//                             My profile
//                         </MenuItem>
//                         {/* <MenuItem>
//                             <Link
//                                 to="/changePassword"
//                                 style={{ color: colors.primary[100], textDecoration: "none" }}
//                             >
//                                 Change password
//                             </Link>
//                         </MenuItem> */}
//                         <MenuItem onClick={handleLogout} style={{ color: colors.primary[100] }}>
//                             Log out
//                         </MenuItem>
//                     </Menu>
//                 </Box>
//             </Toolbar>
//         </AppBar>
//     );
// };

// export default TopBar;
