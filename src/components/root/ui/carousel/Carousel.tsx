"use client";

import React from "react";
import Slider from "react-slick";
import { Box, Button, IconButton, Typography, useMediaQuery } from "@mui/material";
import PlayCircleIcon from "@mui/icons-material/PlayCircle";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Link from "next/link";
import Image from "next/image";

interface ICarouselProps {
    data: any;
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
                right: "-25px",
                zIndex: 1,
                transform: "translateY(-50%)",
                fontSize: "1.3rem",
            }}
        >
            <NavigateNextIcon fontSize="inherit" />
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
                left: "-25px",
                zIndex: 1,
                transform: "translateY(-50%)",
                fontSize: "1.3rem",
            }}
        >
            <NavigateBeforeIcon fontSize="inherit" />
        </IconButton>
    );
};

const Carousel = ({ data, type }: ICarouselProps) => {
    const isMobile = useMediaQuery("(max-width:600px)");
    const isTablet = useMediaQuery("(max-width:960px)");
    const settings = {
        dots: false,
        infinite: true,
        speed: 500,
        slidesToShow: isMobile ? 1 : isTablet ? 2 : 3,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 2000,
        nextArrow: <CustomNextArrow />,
        prevArrow: <CustomPrevArrow />,
    };

    return (
        <Box
            sx={{
                px: isMobile ? 2 : 6,
                py: 4,
            }}
        >
            <Slider {...settings}>
                {data.map((element: any, index: number) => (
                    <Box
                        key={index}
                        sx={{
                            position: "relative",
                            px: 2,
                            "&:hover img": {
                                filter: "blur(2px) opacity(0.7)",
                            },
                            "&:hover .carousel-content": {
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                            },
                        }}
                    >
                        <Image src={element.photoSrcProd} alt={`Slide ${index}`} height={400} width={300} />
                        <Box
                            className="carousel-content"
                            sx={{
                                position: "absolute",
                                top: 0,
                                left: 0,
                                width: "100%",
                                height: "100%",
                                display: "none",
                                justifyContent: "center",
                                alignItems: "center",
                                backgroundColor: "rgba(0, 0, 0, 0.5)",
                                color: "white",
                                padding: 2,
                                textAlign: "center",
                            }}
                        >
                            <Typography variant="h6" sx={{ mb: 1 }}>
                                {element.title}
                            </Typography>
                            <Typography variant="body2" sx={{ mb: 2 }}>
                                {element.description}
                            </Typography>
                            <Link
                                href={
                                    `/${type}/${element.title
                                        .split("")
                                        .map((char: string) => (char === " " ? "-" : char))
                                        .join("")}` || "#"
                                }
                            >
                                <Button
                                    variant="text"
                                    color="primary"
                                    className="carousel-button"
                                    size="medium"
                                    sx={{
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        bgcolor: "rgba(0, 0, 0, 0.5)",
                                        borderRadius: "20%",
                                        p: 1.5,
                                    }}
                                >
                                    <PlayCircleIcon fontSize="large" color="secondary" />
                                </Button>
                            </Link>
                        </Box>
                    </Box>
                ))}
            </Slider>
        </Box>
    );
};

export default Carousel;
