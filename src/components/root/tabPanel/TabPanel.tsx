"use client";

import { Box } from "@mui/material";

interface ITabPanelProps {
    index: number;
    value: number;
    children: React.ReactNode;
}

export default function TabPanel(props: ITabPanelProps) {
    const { children, value, index } = props;

    return (
        <div role="tabpanel" hidden={value !== index} id={`tabpanel-${index}`} aria-labelledby={`tab-${index}`}>
            {value === index && <Box p={3}>{children}</Box>}
        </div>
    );
}
