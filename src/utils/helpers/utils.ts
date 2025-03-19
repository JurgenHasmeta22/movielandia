import { format } from "date-fns";
import ImageKit from "imagekit"

export const IS_BROWSER = typeof window !== "undefined" && typeof window?.document !== "undefined";

export const ensureStartsWith = (stringToCheck: string, startsWith: string) =>
    stringToCheck.startsWith(startsWith) ? stringToCheck : `${startsWith}${stringToCheck}`;

export const formatDate = (date: Date) => {
    return format(date, "dd MMMM, yyyy");
};

export const imagekit = new ImageKit({
  publicKey: process.env.NEXT_PUBLIC_PUBLIC_KEY!,
  privateKey: process.env.PRIVATE_KEY!,
  urlEndpoint: process.env.NEXT_PUBLIC_URL_ENDPOINT!,
});