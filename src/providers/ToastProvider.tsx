"use client";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { defaultToastOptions } from "@/utils/helpers/toast";

interface IToastProviderProps {
    children: React.ReactNode;
}

const ToastProvider = ({ children }: IToastProviderProps) => {
    return (
        <>
            {children}
            <ToastContainer {...defaultToastOptions} />
        </>
    );
};

export default ToastProvider;
