import { describe, it, expect } from "vitest";
import { tryCatch } from "@/utils/helpers/tryCatch";

describe("tryCatch helper", () => {
    it("should return data and null error on successful promise resolution", async () => {
        const testData = { id: 1, name: "Test" };
        const successPromise = Promise.resolve(testData);
        const result = await tryCatch(successPromise);

        expect(result).toEqual({
            data: testData,
            error: null,
        });
    });

    it("should return null data and error on promise rejection", async () => {
        const testError = new Error("Test error");
        const failingPromise = Promise.reject(testError);
        const result = await tryCatch(failingPromise);

        expect(result).toEqual({
            data: null,
            error: testError,
        });
    });

    it("should handle async functions that throw errors", async () => {
        const asyncFunctionThatThrows = async () => {
            throw new Error("Async function error");
        };

        const result = await tryCatch(asyncFunctionThatThrows());

        expect(result.data).toBeNull();
        expect(result.error).toBeInstanceOf(Error);
        expect(result.error?.message).toBe("Async function error");
    });

    it("should handle complex data types", async () => {
        const complexData = {
            id: 1,
            nested: {
                array: [1, 2, 3],
                object: { key: "value" },
            },
            date: new Date(),
        };

        const result = await tryCatch(Promise.resolve(complexData));

        expect(result.data).toEqual(complexData);
        expect(result.error).toBeNull();
    });

    it("should handle custom error types", async () => {
        class CustomError extends Error {
            code: string;

            constructor(message: string, code: string) {
                super(message);
                this.code = code;
            }
        }

        const customError = new CustomError("Custom error", "ERR_CUSTOM");
        const failingPromise = Promise.reject(customError);
        const result = await tryCatch<any, CustomError>(failingPromise);

        expect(result.data).toBeNull();
        expect(result.error).toBeInstanceOf(CustomError);
        expect(result.error?.message).toBe("Custom error");
        expect(result.error?.code).toBe("ERR_CUSTOM");
    });
});
