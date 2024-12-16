import { parse, format } from "date-fns";

export const IS_BROWSER = typeof window !== "undefined" && typeof window?.document !== "undefined";

export const ensureStartsWith = (stringToCheck: string, startsWith: string) => {
    stringToCheck.startsWith(startsWith) ? stringToCheck : `${startsWith}${stringToCheck}`;
};

export const formatDate = (dateString: string) => {
    const date = parse(dateString, "dd/mm/yyyy", new Date());
    return format(date, "dd MMMM, yyyy");
};
