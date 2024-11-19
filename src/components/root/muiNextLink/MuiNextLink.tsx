import { Link as MuiLink } from "@mui/material";
import NextLink from "next/link";

type MuiLinkProps = Parameters<typeof MuiLink>[0] & {
    href: string;
    prefetch?: boolean;
    ref: any;
    type?: string;
};

const MuiNextLink = (props: MuiLinkProps) => {
    return (
        <MuiLink
            component={NextLink}
            {...props}
            sx={{
                ":hover":
                    props.type && props.type === "mainLogo"
                        ? {
                              backgroundColor: "transparent",
                              color: "inherit",
                          }
                        : {},
            }}
        ></MuiLink>
    );
};

export default MuiNextLink;
