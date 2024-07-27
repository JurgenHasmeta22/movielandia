"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";
import RightPanel from "@/components/admin/ui/rightPanel/RightPanel";

type RightPanelContextType = {
    rightPanelProps: any;
    openRightPanel: (props: any) => void;
    closeRightPanel: () => void;
};

type RightPanelProviderProps = {
    children: ReactNode;
};

const RightPanelContext = createContext<RightPanelContextType | undefined>(undefined);

export const useRightPanel = () => {
    const context = useContext(RightPanelContext);

    if (!context) {
        throw new Error("useRightPanel must be used within a RightPanelProvider");
    }

    return context;
};

export const RightPanelProvider: React.FC<RightPanelProviderProps> = ({ children }) => {
    const [rightPanelProps, setRightPanelProps] = useState<any | null>(null);

    const openRightPanel = (props: any) => {
        setRightPanelProps(props);
    };

    const closeRightPanel = () => {
        setRightPanelProps(null);
    };

    return (
        <RightPanelContext.Provider value={{ rightPanelProps, openRightPanel, closeRightPanel }}>
            {children}
            {rightPanelProps && <RightPanel {...rightPanelProps} onClose={closeRightPanel} />}
        </RightPanelContext.Provider>
    );
};
