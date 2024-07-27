"use client";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface IToastProviderProps {
    children: React.ReactNode;
}

const ToastProvider = ({ children }: IToastProviderProps) => {
    return (
        <>
            {children}
            <ToastContainer position="bottom-left" autoClose={3000} />
        </>
    );
};

export default ToastProvider;
