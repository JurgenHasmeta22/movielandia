"use client";

import React from "react";
import Slider from "react-slick";
import { Box, Button, Typography, IconButton, useTheme, CssVarsTheme } from "@mui/material";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import Link from "next/link";
import Image from "next/image";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

interface ICarouselProps {
    data: any[];
    type: string;
}

const CustomNextArrow = (props: any) => {
    const { onClick } = props;

    return (
        <IconButton
            onClick={onClick}
            sx={{
                position: "absolute",
                top: "50%",
                right: "10px",
                transform: "translateY(-50%)",
                zIndex: 2,
                color: "white",
                backgroundColor: "rgba(0, 0, 0, 0.5)",
                "&:hover": {
                    backgroundColor: "rgba(0, 0, 0, 0.7)",
                },
            }}
        >
            <NavigateNextIcon fontSize="large" />
        </IconButton>
    );
};

const CustomPrevArrow = (props: any) => {
    const { onClick } = props;

    return (
        <IconButton
            onClick={onClick}
            sx={{
                position: "absolute",
                top: "50%",
                left: "10px",
                transform: "translateY(-50%)",
                zIndex: 2,
                color: "white",
                backgroundColor: "rgba(0, 0, 0, 0.5)",
                "&:hover": {
                    backgroundColor: "rgba(0, 0, 0, 0.7)",
                },
            }}
        >
            <NavigateBeforeIcon fontSize="large" />
        </IconButton>
    );
};

const Carousel = ({ data, type }: ICarouselProps) => {
    const theme: CssVarsTheme = useTheme();

    const settings = {
        dots: false,
        infinite: true,
        speed: 1000,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 5000,
        nextArrow: <CustomNextArrow />,
        prevArrow: <CustomPrevArrow />,
    };

    const getTitleOrName = (type: string, element: any) => {
        return type === "actors" ? element.fullname : element.title;
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
                            <Image
                                src={element.photoSrcProd}
                                alt={`Slide ${index}`}
                                height={320}
                                width={220}
                                priority
                                style={{ objectFit: "contain", objectPosition: "center" }}
                            />
                            <Box
                                sx={{
                                    position: "absolute",
                                    bottom: 0,
                                    left: 0,
                                    width: "100%",
                                    height: "40%",
                                    backgroundImage: "linear-gradient(to top, rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0))",
                                    color: "white",
                                    display: "flex",
                                    flexDirection: "column",
                                    justifyContent: "flex-end",
                                    p: 6,
                                }}
                            >
                                <Typography variant="h1" gutterBottom>
                                    {getTitleOrName(type, element)}
                                </Typography>
                                <Typography variant="body1" sx={{ mb: 2 }}>
                                    {element.description}
                                </Typography>
                                <Box>
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
                                                fontSize: 16,
                                                fontWeight: 700,
                                                px: 4,
                                                py: 1,
                                            }}
                                        >
                                            See Details
                                        </Button>
                                    </Link>
                                </Box>
                            </Box>
                        </Box>
                    </Box>
                ))}
            </Slider>
        </Box>
    );
};

export default Carousel;
