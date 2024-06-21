"use client";

import "react-toastify/dist/ReactToastify.css";
import "../../app/globals.css";
import { ToastContainer } from "react-toastify";

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
