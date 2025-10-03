"use client";

import React, { useEffect, useRef } from "react";
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

function guessVideoType(url: string) {
  const ext = url.split("?")[0].split(".").pop()?.toLowerCase();
  if (!ext) return undefined;
  if (ext === "mp4") return "video/mp4";
  if (ext === "webm") return "video/webm";
  if (ext === "ogv") return "video/ogg";
  return undefined;
}

export default function TrailerModal({ open, onClose, trailerSrc }: ITrailerModalProps) {
  const embed = toYouTubeEmbed(trailerSrc || undefined);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const iframeRef = useRef<HTMLIFrameElement | null>(null);

  // Stop playback when modal closes
  useEffect(() => {
    if (!open) {
      // pause HTML5 video
      if (videoRef.current) {
        try {
          videoRef.current.pause();
          // explicitly clear src to stop network and playback
          try { videoRef.current.src = ""; } catch (err) {}
          videoRef.current.removeAttribute("src");
          // load to reset
          videoRef.current.load();
        } catch (e) {
          // ignore
        }
      }

      // clear iframe src to stop YouTube playback
      if (iframeRef.current) {
        try {
          iframeRef.current.src = "";
        } catch (e) {
          // ignore
        }
      }
    }
  }, [open]);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <IconButton
        aria-label="close trailer"
        onClick={onClose}
        sx={{ position: "absolute", right: 8, top: 8, zIndex: 10 }}
      >
        <CloseIcon />
      </IconButton>
      <DialogContent sx={{ p: 0, background: "#000" }}>
        {embed ? (
          <iframe
            ref={iframeRef}
            title="Trailer"
            width="100%"
            height={480}
            src={`${embed}?rel=0&enablejsapi=1&autoplay=1&mute=1`}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; autoplay"
            allowFullScreen
            style={{ display: "block" }}
          />
        ) : trailerSrc ? (
          <video
            ref={videoRef}
            controls
            playsInline
            preload="metadata"
            style={{ width: "100%", height: "100%" }}
          >
            <source src={trailerSrc} type={guessVideoType(trailerSrc) ?? "video/mp4"} />
            Your browser does not support the video tag.
          </video>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}
