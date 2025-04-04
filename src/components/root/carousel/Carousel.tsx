"use client";

import React, { useState } from "react";
import Slider from "react-slick";
import { Box, Button, Typography, IconButton } from "@mui/material";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import type {} from "@mui/material/themeCssVarsAugmentation";

interface CarouselItem {
    id: string | number;
    title?: string;
    fullname?: string;
    description: string;
    photoSrcProd: string;
}

interface CarouselProps {
    data: CarouselItem[];
    type: string;
}

interface ArrowProps {
    onClick?: React.MouseEventHandler<HTMLButtonElement>;
}

const CustomNextArrow = ({ onClick }: ArrowProps) => {
    return (
        <IconButton
            onClick={onClick}
            aria-label="Next slide"
            sx={{
                position: "absolute",
                top: "50%",
                right: { xs: "16px", sm: "24px", md: "32px" },
                transform: "translateY(-50%)",
                zIndex: 2,
                color: "white",
                backgroundColor: "rgba(0, 0, 0, 0.7)",
                width: { xs: 32, sm: 36, md: 40 },
                height: { xs: 32, sm: 36, md: 40 },
                transition: "all 0.2s ease-in-out",
                "&:hover": {
                    backgroundColor: "#4cceac",
                    transform: "translateY(-50%) scale(1.05)",
                },
                "&:focus-visible": {
                    outline: "2px solid #4cceac",
                    outlineOffset: 2,
                },
            }}
        >
            <NavigateNextIcon sx={{ fontSize: { xs: 20, sm: 24, md: 28 } }} />
        </IconButton>
    );
};

const CustomPrevArrow = ({ onClick }: ArrowProps) => {
    return (
        <IconButton
            onClick={onClick}
            aria-label="Previous slide"
            sx={{
                position: "absolute",
                top: "50%",
                left: { xs: "16px", sm: "24px", md: "32px" },
                transform: "translateY(-50%)",
                zIndex: 2,
                color: "white",
                backgroundColor: "rgba(0, 0, 0, 0.7)",
                width: { xs: 32, sm: 36, md: 40 },
                height: { xs: 32, sm: 36, md: 40 },
                transition: "all 0.2s ease-in-out",
                "&:hover": {
                    backgroundColor: "#4cceac",
                    transform: "translateY(-50%) scale(1.05)",
                },
                "&:focus-visible": {
                    outline: "2px solid #4cceac",
                    outlineOffset: 2,
                },
            }}
        >
            <NavigateBeforeIcon sx={{ fontSize: { xs: 20, sm: 24, md: 28 } }} />
        </IconButton>
    );
};

const Carousel = ({ data, type }: CarouselProps) => {
    const [currentSlide, setCurrentSlide] = useState(0);

    const settings = {
        dots: false,
        infinite: true,
        speed: 800,
        slidesToShow: 1,
        slidesToScroll: 1,
        nextArrow: <CustomNextArrow />,
        prevArrow: <CustomPrevArrow />,
        fade: true,
        cssEase: "cubic-bezier(0.87, 0, 0.13, 1)",
        responsive: [
            {
                breakpoint: 960,
                settings: {
                    arrows: true,
                    dots: true,
                },
            },
            {
                breakpoint: 600,
                settings: {
                    arrows: true,
                    dots: true,
                },
            },
        ],
        beforeChange: (_: number, next: number) => setCurrentSlide(next),
    };

    const getTitleOrName = (type: string, element: CarouselItem): string => {
        return type === "actors" || type === "crew" ? element.fullname || "" : element.title || "";
    };

    const generateSlug = (text: string): string => {
        return encodeURIComponent(text.split(" ").join("-"));
    };

    return (
        <Box
            sx={{
                position: "relative",
                height: {
                    xs: "100vh",
                    sm: "90vh",
                    md: "80vh",
                },
                overflow: "hidden",
                mt: 4,
                mb: 2,
                borderRadius: { xs: 0, sm: 2 },
                boxShadow: { xs: "none", sm: "rgba(0, 0, 0, 0.1) 0px 8px 24px" },
                "& .slick-slider": {
                    height: "100%",
                },
                "& .slick-list": {
                    height: "100%",
                },
                "& .slick-track": {
                    height: "100%",
                },
                "& .slick-slide": {
                    height: "100%",
                    "& > div": {
                        height: "100%",
                    },
                },
                "& .slick-dots": {
                    bottom: { xs: "32px", sm: "40px", md: "48px" },
                },
            }}
        >
            <Slider {...settings}>
                {data.map((element, index) => (
                    <Box
                        key={index}
                        sx={{
                            position: "relative",
                            height: {
                                xs: "100vh",
                                sm: "90vh",
                                md: "80vh",
                            },
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            p: { xs: 2, sm: 3, md: 4 },
                            backgroundColor: "rgba(20, 20, 20, 0.05)",
                        }}
                    >
                        <Box
                            sx={{
                                position: "relative",
                                width: "100%",
                                height: "100%",
                                display: "flex",
                                flexDirection: { xs: "column", md: "row" },
                                alignItems: "center",
                                justifyContent: { xs: "flex-start", md: "center" },
                                gap: { xs: 3, sm: 4, md: 6 },
                                pt: { xs: 4, sm: 0 },
                            }}
                        >
                            <Box
                                sx={{
                                    position: "relative",
                                    zIndex: 2,
                                    flexShrink: 0,
                                }}
                            >
                                <Image
                                    src={element.photoSrcProd}
                                    alt={getTitleOrName(type, element)}
                                    height={400}
                                    width={280}
                                    priority
                                    style={{
                                        objectFit: "cover",
                                        objectPosition: "center",
                                        borderRadius: "16px",
                                        boxShadow: "0 16px 32px rgba(20, 20, 20, 0.25)",
                                    }}
                                />
                            </Box>

                            <Box
                                sx={{
                                    position: { xs: "relative", md: "static" },
                                    zIndex: 2,
                                    width: "100%",
                                    maxWidth: { xs: "100%", md: "50%" },
                                    px: { xs: 2, sm: 3, md: 0 },
                                }}
                            >
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{
                                        opacity: currentSlide === index ? 1 : 0,
                                        y: currentSlide === index ? 0 : 20,
                                    }}
                                    transition={{ duration: 0.5, ease: "easeOut" }}
                                >
                                    <Typography
                                        variant="h1"
                                        component="h2"
                                        gutterBottom
                                        sx={{
                                            fontSize: { xs: "2rem", sm: "2.5rem", md: "3rem" },
                                            fontWeight: 700,
                                            color: "#e0e0e0",
                                            textShadow: "1px 1px 2px rgba(20, 20, 20, 0.3)",
                                            mb: 2,
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
                                            color: "rgba(224, 224, 224, 0.9)",
                                            display: "-webkit-box",
                                            WebkitLineClamp: { xs: 3, sm: 4, md: 5 },
                                            WebkitBoxOrient: "vertical",
                                            overflow: "hidden",
                                            textOverflow: "ellipsis",
                                        }}
                                    >
                                        {element.description}
                                    </Typography>
                                    <Link
                                        href={`/${type}/${element.id}/${generateSlug(getTitleOrName(type, element))}`}
                                        passHref
                                    >
                                        <Button
                                            variant="contained"
                                            aria-label={`See details for ${getTitleOrName(type, element)}`}
                                            sx={{
                                                bgcolor: "#db4f4a",
                                                color: "#e0e0e0",
                                                fontSize: { xs: 14, sm: 16 },
                                                fontWeight: 600,
                                                px: { xs: 3, sm: 4 },
                                                py: 1.5,
                                                borderRadius: "8px",
                                                boxShadow: "0 4px 12px rgba(20, 20, 20, 0.2)",
                                                textTransform: "none",
                                                transition: "all 0.3s ease",
                                                "&:hover": {
                                                    bgcolor: "#4cceac",
                                                    color: "#040509",
                                                    transform: "translateY(-2px)",
                                                    boxShadow: "0 6px 16px rgba(20, 20, 20, 0.3)",
                                                },
                                                "&:active": {
                                                    transform: "translateY(0)",
                                                },
                                                "&:focus-visible": {
                                                    outline: "2px solid #4cceac",
                                                    outlineOffset: 2,
                                                },
                                            }}
                                        >
                                            See Details
                                        </Button>
                                    </Link>
                                </motion.div>
                            </Box>
                            <Box
                                sx={{
                                    position: "absolute",
                                    top: 0,
                                    left: 0,
                                    right: 0,
                                    bottom: 0,
                                    zIndex: 1,
                                    background: {
                                        xs: "linear-gradient(to bottom, rgba(20, 20, 20, 0.1), rgba(20, 20, 20, 0.4))",
                                        md: "linear-gradient(to right, rgba(20, 20, 20, 0.1), rgba(20, 20, 20, 0.4))",
                                    },
                                    pointerEvents: "none",
                                }}
                            />
                        </Box>
                    </Box>
                ))}
            </Slider>
        </Box>
    );
};

export default Carousel;
