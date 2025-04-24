"use client";

import { Box } from "@mui/material";
import { motion } from "framer-motion";

interface ITabPanelProps {
	index: number;
	value: number;
	children: React.ReactNode;
}

export default function TabPanel(props: ITabPanelProps) {
	const { children, value, index } = props;

	return (
		<Box
			role="tabpanel"
			hidden={value !== index}
			id={`tabpanel-${index}`}
			aria-labelledby={`tab-${index}`}
			sx={{
				width: "100%",
			}}
		>
			{value === index && (
				<motion.div
					initial={{ opacity: 0, y: 10 }}
					animate={{ opacity: 1, y: 0 }}
					exit={{ opacity: 0, y: -10 }}
					transition={{ duration: 0.2 }}
				>
					<Box>{children}</Box>
				</motion.div>
			)}
		</Box>
	);
}
