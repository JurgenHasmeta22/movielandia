"use client";

import React from "react";
import Slider from "react-slick";
import { Box, Button, Typography, IconButton, useTheme } from "@mui/material";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import Link from "next/link";
import Image from "next/image";
import { tokens } from "@/utils/theme/theme";
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
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);

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

    return (
        <Box sx={{ position: "relative", height: "95vh", overflow: "hidden" }}>
            <Slider {...settings}>
                {data.map((element, index) => (
                    <Box key={index} sx={{ position: "relative", height: "95vh" }}>
                        <Image
                            src={element.photoSrcProd}
                            alt={`Slide ${index}`}
                            fill
                            quality={100}
                            priority
                            style={{ objectPosition: "center", objectFit: "fill" }}
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
                                p: 4,
                            }}
                        >
                            <Typography variant="h1" gutterBottom>
                                {element.title}
                            </Typography>
                            <Typography variant="body1" sx={{ mb: 2 }}>
                                {element.description}
                            </Typography>
                            <Box>
                                <Link href={`/${type}/${element.id}`} passHref>
                                    <Button
                                        variant="contained"
                                        color="secondary"
                                        sx={{
                                            bgcolor: colors.redAccent[500],
                                            "&:hover": { bgcolor: colors.greenAccent[500], color: colors.primary[100] },
                                            textTransform: "capitalize",
                                            color: colors.grey[900],
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
                ))}
            </Slider>
        </Box>
    );
};

export default Carousel;
