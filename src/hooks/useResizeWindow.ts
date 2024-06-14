import { useEffect } from "react";
import { useStore } from "~/store/store";

export function useResizeWindow() {
    const { isPageShrunk, setIsPageShrunk } = useStore();

    useEffect(() => {
        const handleResize = () => {
            setIsPageShrunk(window.innerWidth < 768);
        };

        window.addEventListener("resize", handleResize);

        return () => {
            window.removeEventListener("resize", handleResize);
        };
    }, []);

    return isPageShrunk;
}
