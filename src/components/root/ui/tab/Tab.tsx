"use client";

import Box from "@mui/material-pigment-css/Box";

export default function TabPanel(props: any) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`tabpanel-${index}`}
            aria-labelledby={`tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box
                    sx={{
                        padding: 3,
                    }}
                >
                    {children}
                </Box>
            )}
        </div>
    );
}
