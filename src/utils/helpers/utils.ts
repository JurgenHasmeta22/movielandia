import { format } from "date-fns";

export const IS_BROWSER = typeof window !== "undefined" && typeof window?.document !== "undefined";

export const ensureStartsWith = (stringToCheck: string, startsWith: string) =>
    stringToCheck.startsWith(startsWith) ? stringToCheck : `${startsWith}${stringToCheck}`;

export const formatDate = (date: Date) => {
    return format(date, "dd MMMM, yyyy");
};
