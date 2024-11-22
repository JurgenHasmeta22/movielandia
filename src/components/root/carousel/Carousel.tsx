"use client";

import React, { useState } from "react";
import Slider from "react-slick";
import { Box, Button, Typography, IconButton, useTheme } from "@mui/material";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import type {} from "@mui/material/themeCssVarsAugmentation";

interface ICarouselProps {
    data: any[];
    type: string;
}

const CustomNextArrow = (props: any) => {
    const { onClick } = props;
    const theme = useTheme();

    return (
        <IconButton
            onClick={onClick}
            sx={{
                position: "absolute",
                top: "50%",
                right: { xs: "20px", sm: "40px" },
                transform: "translateY(-50%)",
                zIndex: 2,
                color: theme.vars.palette.greyAccent.main,
                backgroundColor: "rgba(0, 0, 0, 0.5)",
                width: { xs: 40, sm: 48 },
                height: { xs: 40, sm: 48 },
                "&:hover": {
                    backgroundColor: "rgba(0, 0, 0, 0.7)",
                },
            }}
        >
            <NavigateNextIcon sx={{ fontSize: { xs: 24, sm: 32 } }} />
        </IconButton>
    );
};

const CustomPrevArrow = (props: any) => {
    const { onClick } = props;
    const theme = useTheme();

    return (
        <IconButton
            onClick={onClick}
            sx={{
                position: "absolute",
                top: "50%",
                left: { xs: "20px", sm: "40px" },
                transform: "translateY(-50%)",
                zIndex: 2,
                color: theme.vars.palette.greyAccent.main,
                backgroundColor: "rgba(0, 0, 0, 0.5)",
                width: { xs: 40, sm: 48 },
                height: { xs: 40, sm: 48 },
                "&:hover": {
                    backgroundColor: "rgba(0, 0, 0, 0.7)",
                },
            }}
        >
            <NavigateBeforeIcon sx={{ fontSize: { xs: 24, sm: 32 } }} />
        </IconButton>
    );
};

const Carousel = ({ data, type }: ICarouselProps) => {
    const theme = useTheme();
    const [currentSlide, setCurrentSlide] = useState(0);

    const settings = {
        dots: true,
        infinite: true,
        speed: 800,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 5000,
        pauseOnHover: true,
        nextArrow: <CustomNextArrow />,
        prevArrow: <CustomPrevArrow />,
        beforeChange: (_: any, next: any) => setCurrentSlide(next),
        fade: true,
        cssEase: "cubic-bezier(0.87, 0, 0.13, 1)",
        dotsClass: "slick-dots custom-dots",
        appendDots: (dots: any) => (
            <Box
                component={motion.div}
                sx={{
                    position: "absolute",
                    bottom: "20px",
                    width: "100%",
                    "& .slick-dots": {
                        position: "static",
                    },
                    "& .slick-dots li": {
                        margin: "0 6px",
                    },
                    "& .slick-dots li button": {
                        width: "12px",
                        height: "12px",
                        borderRadius: "50%",
                        backgroundColor: "rgba(255, 255, 255, 0.5)",
                        transition: "all 0.3s ease",
                        "&:before": {
                            display: "none",
                        },
                    },
                    "& .slick-dots li.slick-active button": {
                        backgroundColor: theme.vars.palette.green.main,
                        transform: "scale(1.2)",
                    },
                }}
            >
                <ul>{dots}</ul>
            </Box>
        ),
    };

    const getTitleOrName = (type: string, element: any) => {
        return type === "actors" || type === "crew" ? element.fullname : element.title;
    };

    const generateSlug = (text: string) => {
        return encodeURIComponent(text.split(" ").join("-"));
    };

    return (
        <Box
            sx={{
                position: "relative",
                height: {
                    xs: "140vh",
                    sm: "140vh",
                    md: "90vh",
                },
                overflow: "hidden",
                mt: 6,
            }}
        >
            <Slider {...settings}>
                {data.map((element, index) => (
                    <Box
                        key={index}
                        sx={{
                            position: "relative",
                            height: {
                                xs: "130vh",
                                sm: "130vh",
                                md: "90vh",
                            },
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            p: 2,
                        }}
                    >
                        <Box
                            sx={{
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                                justifyContent: "center",
                                width: "auto",
                                maxWidth: "100%",
                            }}
                        >
                            <motion.div whileHover={{ scale: 1.05 }} transition={{ duration: 0.3 }}>
                                <Image
                                    src={element.photoSrcProd}
                                    alt={`Slide ${index}`}
                                    height={320}
                                    width={220}
                                    priority
                                    style={{
                                        objectFit: "contain",
                                        objectPosition: "center",
                                        borderRadius: "12px",
                                        boxShadow: "0 8px 24px rgba(0,0,0,0.3)",
                                    }}
                                />
                            </motion.div>
                            <Box
                                sx={{
                                    position: "absolute",
                                    bottom: 0,
                                    left: 0,
                                    width: "100%",
                                    backgroundImage: "linear-gradient(to top, rgba(0, 0, 0, 0.9), rgba(0, 0, 0, 0))",
                                    padding: "48px",
                                    display: "flex",
                                    flexDirection: "column",
                                    justifyContent: "flex-end",
                                }}
                            >
                                <motion.div
                                    initial={false}
                                    animate={{ opacity: currentSlide === index ? 1 : 0 }}
                                    transition={{ duration: 0.4 }}
                                >
                                    <Typography
                                        variant="h1"
                                        gutterBottom
                                        sx={{
                                            fontSize: { xs: "2rem", sm: "2.5rem", md: "3rem" },
                                            fontWeight: 700,
                                            textShadow: "2px 2px 4px rgba(0,0,0,0.3)",
                                        }}
                                    >
                                        {getTitleOrName(type, element)}
                                    </Typography>
                                    <Typography
                                        variant="body1"
                                        sx={{
                                            mb: 3,
                                            maxWidth: "800px",
                                            fontSize: { xs: "0.9rem", sm: "1rem", md: "1.1rem" },
                                            lineHeight: 1.6,
                                            textShadow: "1px 1px 2px rgba(0,0,0,0.3)",
                                        }}
                                    >
                                        {element.description}
                                    </Typography>
                                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                        <Link
                                            href={`/${type}/${element.id}/${generateSlug(getTitleOrName(type, element))}`}
                                            passHref
                                        >
                                            <Button
                                                variant="contained"
                                                sx={{
                                                    bgcolor: theme.vars.palette.red.main,
                                                    "&:hover": {
                                                        bgcolor: theme.vars.palette.green.light,
                                                        color: theme.vars.palette.primary.main,
                                                    },
                                                    textTransform: "capitalize",
                                                    color: theme.vars.palette.greyAccent.main,
                                                    fontSize: { xs: 14, sm: 16 },
                                                    fontWeight: 700,
                                                    px: { xs: 3, sm: 4 },
                                                    py: 1.5,
                                                    borderRadius: "8px",
                                                    boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
                                                }}
                                            >
                                                See Details
                                            </Button>
                                        </Link>
                                    </motion.div>
                                </motion.div>
                            </Box>
                        </Box>
                    </Box>
                ))}
            </Slider>
        </Box>
    );
};

export default Carousel;
