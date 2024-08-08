import { parse, format } from "date-fns";

export function toFirstWordUpperCase(str: string) {
    if (str) {
        const strFinal = str
            .replace(/(?:^\w|[A-Z]|\b\w)/g, (letter, index) => {
                return index === 0 ? letter.toUpperCase() : letter.toLowerCase();
            })
            .replace(/\s+/g, "");

        return strFinal;
    } else {
        return "";
    }
}

export function toCamelCase(str: string) {
    if (str) {
        const strFinal = str
            .replace(/(?:^\w|[A-Z]|\b\w)/g, (letter, index) => {
                return index === 0 ? letter.toLowerCase() : letter.toUpperCase();
            })
            .replace(/\s+/g, "")
            .replace(/^[A-Z]/, (match) => match.toLowerCase());

        return strFinal;
    } else {
        return "";
    }
}

export function getRandomElements<T>(array: T[], count: number): T[] {
    const arr = array.slice();

    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }

    return arr.slice(0, count);
}

export const ensureStartsWith = (stringToCheck: string, startsWith: string) =>
    stringToCheck.startsWith(startsWith) ? stringToCheck : `${startsWith}${stringToCheck}`;

export const formatDate = (dateString: string) => {
    const date = parse(dateString, "dd/MM/yyyy", new Date());
    return format(date, "dd MMMM, yyyy");
};
