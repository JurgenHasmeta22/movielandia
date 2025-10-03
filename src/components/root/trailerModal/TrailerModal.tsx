"use client";

import React from "react";
import { Dialog, DialogContent, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

interface ITrailerModalProps {
  open: boolean;
  onClose: () => void;
  trailerSrc?: string | null;
}

function toYouTubeEmbed(url?: string | null) {
  if (!url) return null;
  try {
    const u = new URL(url);
    // handle youtu.be and youtube.com
    if (u.hostname.includes("youtu.be")) {
      const id = u.pathname.replace("/", "");
      return `https://www.youtube.com/embed/${id}`;
    }
    if (u.hostname.includes("youtube.com")) {
      const params = new URLSearchParams(u.search);
      const v = params.get("v");
      if (v) return `https://www.youtube.com/embed/${v}`;
    }
  } catch (e) {
    return null;
  }

  return null;
}

export default function TrailerModal({ open, onClose, trailerSrc }: ITrailerModalProps) {
  const embed = toYouTubeEmbed(trailerSrc || undefined);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <IconButton
        aria-label="close"
        onClick={onClose}
        sx={{ position: "absolute", right: 8, top: 8, zIndex: 10 }}
      >
        <CloseIcon />
      </IconButton>
      <DialogContent sx={{ p: 0, background: "#000" }}>
        {embed ? (
          <iframe
            title="Trailer"
            width="100%"
            height={480}
            src={`${embed}?autoplay=1&rel=0`}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            style={{ display: "block" }}
          />
        ) : trailerSrc ? (
          <video controls style={{ width: "100%", height: "100%" }}>
            <source src={trailerSrc} />
            Your browser does not support the video tag.
          </video>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}
