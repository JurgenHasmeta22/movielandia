import { IS_SERVER } from "./utils";

export function localStorageGet(name: string, defaultValue: any = ""): string {
    if (IS_SERVER) {
        return defaultValue;
    }

    const valueFromStore = localStorage.getItem(name);

    if (valueFromStore === null) return defaultValue;

    try {
        const jsonParsed = JSON.parse(valueFromStore);

        if (["boolean", "number", "bigint", "string", "object"].includes(typeof jsonParsed)) {
            return jsonParsed;
        }
    } catch (error) {
        console.error(error);
    }

    return valueFromStore;
}

export function localStorageSet(name: string, value: any) {
    if (IS_SERVER) {
        return;
    }

    if (typeof value === "undefined") {
        return;
    }

    let valueAsString: string;

    if (typeof value === "object") {
        valueAsString = JSON.stringify(value);
    } else {
        valueAsString = String(value);
    }

    localStorage.setItem(name, valueAsString);
}

export function localStorageDelete(name: string) {
    if (IS_SERVER) {
        return;
    }

    if (name) {
        localStorage.removeItem(name);
    } else {
        localStorage.clear();
    }
}
