import { render, screen } from "@testing-library/react";
import { ThemeProvider, createTheme } from "@mui/material";
import DraggableListItem from "./DraggableListItem";
import { vi, expect, describe, it } from "vitest";

// Mock the useSortable hook
vi.mock("@dnd-kit/sortable", () => ({
    useSortable: () => ({
        attributes: {},
        listeners: {},
        setNodeRef: vi.fn(),
        transform: null,
        transition: null,
        isDragging: false,
    }),
}));

// Mock the ListDetailCardItem component
vi.mock("../listDetailCardItem/ListDetailCardItem", () => ({
    default: ({ data, type, listId, userId, showActions }: any) => (
        <div data-testid="list-detail-card-item">
            <span data-testid="item-type">{type}</span>
            <span data-testid="show-actions">{showActions.toString()}</span>
        </div>
    ),
}));

describe("DraggableListItem", () => {
    const theme = createTheme();
    const mockProps = {
        id: 1,
        data: { movie: { id: 1, title: "Test Movie" } },
        type: "movie" as const,
        listId: 1,
        userId: 1,
        isEditMode: true,
    };

    // Helper function to render with ThemeProvider
    const renderWithTheme = (component: React.ReactElement) => {
        return render(<ThemeProvider theme={theme}>{component}</ThemeProvider>);
    };

    it("renders the ListDetailCardItem with correct props", () => {
        renderWithTheme(<DraggableListItem {...mockProps} />);

        const listDetailCardItem = screen.getByTestId("list-detail-card-item");
        expect(listDetailCardItem).toBeDefined();

        const itemType = screen.getByTestId("item-type");
        expect(itemType.textContent).toBe("movie");

        const showActions = screen.getByTestId("show-actions");
        expect(showActions.textContent).toBe("false"); // showActions should be false in edit mode
    });

    it("renders the drag handle when in edit mode", () => {
        renderWithTheme(<DraggableListItem {...mockProps} />);

        const dragHandle = screen.getByTestId("DragIndicatorIcon");
        expect(dragHandle).toBeDefined();
    });

    it("does not render the drag handle when not in edit mode", () => {
        renderWithTheme(<DraggableListItem {...mockProps} isEditMode={false} />);

        expect(screen.queryByTestId("DragIndicatorIcon")).toBeNull();
    });
});
