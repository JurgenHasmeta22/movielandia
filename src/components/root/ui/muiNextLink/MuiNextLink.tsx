import { Link as MuiLink } from "@mui/material";
import NextLink from "next/link";
import { forwardRef } from "react";

type MuiLinkProps = Parameters<typeof MuiLink>[0] & {
    href: string;
    prefetch?: boolean;
};

const MuiNextLink = forwardRef((props: MuiLinkProps, ref: any) => {
    return <MuiLink component={NextLink} ref={ref} {...props}></MuiLink>;
});

MuiNextLink.displayName = "MuiNextLink";

export default MuiNextLink;
