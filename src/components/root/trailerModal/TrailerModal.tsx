"use client";

import React, { useEffect, useState } from "react";
import { Dialog, DialogContent, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

interface ITrailerModalProps {
  open: boolean;
  onClose: () => void;
  trailerSrc?: string | null;
}

export default function TrailerModal({ open, onClose, trailerSrc }: ITrailerModalProps) {
  // Keep src only while modal is open to avoid premature clearing behavior
  const [src, setSrc] = useState<string | null>(null);

  useEffect(() => {
    if (open) {
      setSrc(trailerSrc ?? null);
    } else {
      setSrc(null);
    }
  }, [open, trailerSrc]);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <IconButton aria-label="close trailer" onClick={onClose} sx={{ position: "absolute", right: 8, top: 8, zIndex: 10 }}>
        <CloseIcon />
      </IconButton>
      <DialogContent sx={{ p: 0, background: "#000" }}>
        {src ? (
          <iframe
            title="Trailer"
            width="100%"
            height={480}
            src={src}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
            allowFullScreen
            style={{ display: "block" }}
          />
        ) : null}
      </DialogContent>
    </Dialog>
  );
}
