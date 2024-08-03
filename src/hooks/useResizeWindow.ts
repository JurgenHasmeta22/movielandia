"use client";

import { useStore } from "@/store/store";
import { useEffect } from "react";

export function useResizeWindow() {
    const { isPageShrunk, setIsPageShrunk } = useStore();

    useEffect(() => {
        const handleResize = () => {
            if (typeof window !== "undefined") {
                setIsPageShrunk(window.innerWidth < 768);
            }
        };

        handleResize();

        window.addEventListener("resize", handleResize);

        return () => {
            window.removeEventListener("resize", handleResize);
        };
    }, [setIsPageShrunk]);

    return isPageShrunk;
}
