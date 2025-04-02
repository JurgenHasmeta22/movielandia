import { describe, it, expect, vi, beforeEach } from "vitest";
import { defaultToastOptions, showToast } from "@/utils/helpers/toast";
import { toast, Slide } from "react-toastify";

// Mock react-toastify
vi.mock("react-toastify", () => ({
    toast: vi.fn(() => "default-id"),
    Slide: "slide-transition",
}));

// Add methods to the toast mock
const toastMock = toast as unknown as {
    success: ReturnType<typeof vi.fn>;
    error: ReturnType<typeof vi.fn>;
    info: ReturnType<typeof vi.fn>;
    warn: ReturnType<typeof vi.fn>;
};

toastMock.success = vi.fn(() => "success-id");
toastMock.error = vi.fn(() => "error-id");
toastMock.info = vi.fn(() => "info-id");
toastMock.warn = vi.fn(() => "warning-id");

describe("Toast helpers", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe("defaultToastOptions", () => {
        it("should have the correct default options", () => {
            expect(defaultToastOptions).toEqual({
                position: "top-right",
                autoClose: 3500,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "colored",
                transition: Slide,
            });
        });
    });

    describe("showToast", () => {
        it("should call toast.success with correct parameters for success type", () => {
            const content = "Success message";
            const result = showToast("success", content);

            expect(toast.success).toHaveBeenCalledTimes(1);
            expect(toast.success).toHaveBeenCalledWith(content, defaultToastOptions);
            expect(result).toBe("success-id");
        });

        it("should call toast.error with correct parameters for error type", () => {
            const content = "Error message";
            const result = showToast("error", content);

            expect(toast.error).toHaveBeenCalledTimes(1);
            expect(toast.error).toHaveBeenCalledWith(content, defaultToastOptions);
            expect(result).toBe("error-id");
        });

        it("should call toast.info with correct parameters for info type", () => {
            const content = "Info message";
            const result = showToast("info", content);

            expect(toast.info).toHaveBeenCalledTimes(1);
            expect(toast.info).toHaveBeenCalledWith(content, defaultToastOptions);
            expect(result).toBe("info-id");
        });

        it("should call toast.warn with correct parameters for warning type", () => {
            const content = "Warning message";
            const result = showToast("warning", content);

            expect(toast.warn).toHaveBeenCalledTimes(1);
            expect(toast.warn).toHaveBeenCalledWith(content, defaultToastOptions);
            expect(result).toBe("warning-id");
        });

        it("should call toast with correct parameters for default type", () => {
            const content = "Default message";
            const result = showToast("default", content);

            expect(toast).toHaveBeenCalledTimes(1);
            expect(toast).toHaveBeenCalledWith(content, defaultToastOptions);
            expect(result).toBe("default-id");
        });

        it("should call toast with correct parameters for unknown type", () => {
            const content = "Unknown type message";
            // @ts-ignore - Testing with an invalid type
            const result = showToast("unknown", content);

            expect(toast).toHaveBeenCalledTimes(1);
            expect(toast).toHaveBeenCalledWith(content, defaultToastOptions);
            expect(result).toBe("default-id");
        });

        it("should merge custom options with default options", () => {
            const content = "Custom options message";
            const customOptions = { autoClose: 5000, position: "bottom-left" as const };

            showToast("success", content, customOptions);

            expect(toast.success).toHaveBeenCalledWith(content, {
                ...defaultToastOptions,
                ...customOptions,
            });
        });
    });
});
