import { Link as MuiLink } from "@mui/material";
import NextLink from "next/link";

type MuiLinkProps = Parameters<typeof MuiLink>[0] & {
    href: string;
    prefetch?: boolean;
    ref: any;
};

const MuiNextLink = (props: MuiLinkProps) => {
    return <MuiLink component={NextLink} {...props}></MuiLink>;
};

export default MuiNextLink;
