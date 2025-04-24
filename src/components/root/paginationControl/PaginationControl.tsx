"use client";

import React from "react";
import { Box, Pagination, PaginationItem } from "@mui/material";
import { useQueryState } from "nuqs";

interface PaginationControlProps {
	currentPage: number;
	pageCount: number;
	urlParamName?: string;
	customUrlHandler?: boolean;
	onPageChange?: (page: number) => void;
}

export default function PaginationControl({
	currentPage,
	pageCount,
	urlParamName = "page",
	customUrlHandler = false,
	onPageChange,
}: PaginationControlProps) {
	const [page, setPage] = useQueryState(urlParamName, {
		defaultValue: "1",
		parse: (value) => value || "1",
		shallow: false,
		history: "push",
	});

	const handleChange = (
		_event: React.ChangeEvent<unknown>,
		value: number,
	) => {
		if (value === currentPage) return;

		if (customUrlHandler && onPageChange) {
			onPageChange(value);
		} else {
			setPage(value.toString());
		}
	};

	return (
		<Box sx={{ display: "flex", justifyContent: "center" }}>
			<Pagination
				page={currentPage}
				onChange={handleChange}
				count={pageCount}
				showLastButton={true}
				showFirstButton={true}
				variant="outlined"
				shape="rounded"
				size="large"
				renderItem={(item) => (
					<PaginationItem
						{...item}
						disabled={item.page === currentPage || item.disabled}
					/>
				)}
			/>
		</Box>
	);
}
