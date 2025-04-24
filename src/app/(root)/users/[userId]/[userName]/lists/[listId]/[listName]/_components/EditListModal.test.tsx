import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import EditListModal from "./EditListModal";
import { updateList } from "@/actions/list/list.actions";
import { showToast } from "@/utils/helpers/toast";

// Mock the necessary dependencies
vi.mock("next/navigation", () => ({
	useRouter: () => ({
		refresh: vi.fn(),
	}),
}));

vi.mock("@/actions/list/list.actions", () => ({
	updateList: vi.fn(),
}));

vi.mock("@/utils/helpers/toast", () => ({
	showToast: vi.fn(),
}));

describe("EditListModal", () => {
	const mockProps = {
		open: true,
		onClose: vi.fn(),
		listId: 1,
		userId: 1,
		initialValues: {
			name: "Test List",
			description: "Test Description",
			isPrivate: false,
		},
	};

	beforeEach(() => {
		vi.clearAllMocks();
	});

	it("renders the modal with initial values", () => {
		render(<EditListModal {...mockProps} />);

		expect(screen.getByText("Edit List")).toBeInTheDocument();
		expect(screen.getByLabelText("List Name")).toHaveValue("Test List");
		expect(screen.getByLabelText("Description")).toHaveValue(
			"Test Description",
		);
		expect(screen.getByLabelText("Privacy")).toHaveValue("public");
	});

	it("updates list when form is submitted", async () => {
		// Mock successful update
		(updateList as any).mockResolvedValue({ id: 1, name: "Updated List" });

		render(<EditListModal {...mockProps} />);

		// Change form values
		fireEvent.change(screen.getByLabelText("List Name"), {
			target: { value: "Updated List" },
		});
		fireEvent.change(screen.getByLabelText("Description"), {
			target: { value: "Updated Description" },
		});

		// Submit the form
		fireEvent.click(screen.getByText("Save Changes"));

		await waitFor(() => {
			expect(updateList).toHaveBeenCalledWith(1, 1, {
				name: "Updated List",
				description: "Updated Description",
				isPrivate: false,
			});
			expect(showToast).toHaveBeenCalledWith(
				"success",
				"List updated successfully!",
			);
			expect(mockProps.onClose).toHaveBeenCalled();
		});
	});

	it("shows error toast when update fails", async () => {
		// Mock failed update
		const errorMessage = "Failed to update list";
		(updateList as any).mockRejectedValue(new Error(errorMessage));

		render(<EditListModal {...mockProps} />);

		// Submit the form without changes
		fireEvent.click(screen.getByText("Save Changes"));

		await waitFor(() => {
			expect(updateList).toHaveBeenCalled();
			expect(showToast).toHaveBeenCalledWith("error", errorMessage);
			expect(mockProps.onClose).not.toHaveBeenCalled();
		});
	});

	it("closes the modal when cancel button is clicked", () => {
		render(<EditListModal {...mockProps} />);

		fireEvent.click(screen.getByText("Cancel"));

		expect(mockProps.onClose).toHaveBeenCalled();
	});
});
