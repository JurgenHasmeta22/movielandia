"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Box, IconButton } from "@mui/material";
import DragIndicatorIcon from "@mui/icons-material/DragIndicator";
import { forwardRef } from "react";
import ListDetailCardItem from "../listDetailCardItem/ListDetailCardItem";
import { CardItemType } from "../cardItem/CardItem";
import { ContentType } from "@prisma/client";

interface DraggableListItemProps {
	id: number;
	data: any;
	type: CardItemType | ContentType | null;
	listId: number;
	userId: number;
	isEditMode: boolean;
}

const DraggableListItem = forwardRef<HTMLDivElement, DraggableListItemProps>(
	function DraggableListItem(
		{ id, data, type, listId, userId, isEditMode },
		ref,
	) {
		const {
			attributes,
			listeners,
			setNodeRef,
			transform,
			transition,
			isDragging,
		} = useSortable({ id });

		const style = {
			transform: CSS.Transform.toString(transform),
			transition,
			opacity: isDragging ? 0.5 : 1,
			position: "relative",
			zIndex: isDragging ? 1 : 0,
		};

		return (
			<Box
				ref={(node) => {
					// Forward the ref to both the parent component and dnd-kit
					if (typeof ref === "function") {
						ref(node);
					} else if (ref) {
						ref.current = node;
					}
					setNodeRef(node);
				}}
				style={style}
				sx={{
					position: "relative",
					cursor: isEditMode ? "grab" : "default",
					"&:hover .drag-handle": {
						opacity: isEditMode ? 1 : 0,
					},
				}}
			>
				<ListDetailCardItem
					data={data}
					type={type}
					listId={listId}
					userId={userId}
					showActions={!isEditMode}
				/>
				{isEditMode && (
					<IconButton
						className="drag-handle"
						{...attributes}
						{...listeners}
						sx={{
							position: "absolute",
							top: 8,
							right: 8,
							bgcolor: "background.paper",
							opacity: 0,
							transition: "opacity 0.2s",
							"&:hover": {
								bgcolor: "primary.main",
								"& .MuiSvgIcon-root": {
									color: "common.white",
								},
							},
							zIndex: 2,
						}}
						size="small"
					>
						<DragIndicatorIcon
							fontSize="small"
							data-testid="DragIndicatorIcon"
						/>
					</IconButton>
				)}
			</Box>
		);
	},
);

export default DraggableListItem;
