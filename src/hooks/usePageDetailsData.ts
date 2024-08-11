"use client";

import { useState, useRef } from "react";
import { useSession } from "next-auth/react";
import { useModal } from "@/providers/ModalProvider";
import { useStore } from "@/store/store";

export function usePageDetailsData() {
    const { data: session } = useSession();

    const [review, setReview] = useState<string>("");
    const [rating, setRating] = useState<number | null>(null);
    const [isEditMode, setIsEditMode] = useState<boolean>(false);
    const [open, setOpen] = useState<boolean>(false);
    const [openVotesModal, setIsOpenVotesModal] = useState(false);

    const { openModal } = useModal();

    const textEditorRef = useRef<any>(null);
    const reviewRef = useRef<any>(null);

    const {
        setListModalDataType,
        setUpvotesPageModal,
        setDownvotesPageModal,
        setSelectedReview,
        setHasMoreDownvotesModal,
        setHasMoreUpvotesModal,
    } = useStore();

    return {
        session,
        review,
        setReview,
        rating,
        setRating,
        isEditMode,
        setIsEditMode,
        open,
        setOpen,
        openVotesModal,
        setIsOpenVotesModal,
        openModal,
        textEditorRef,
        reviewRef,
        setListModalDataType,
        setUpvotesPageModal,
        setDownvotesPageModal,
        setSelectedReview,
        setHasMoreDownvotesModal,
        setHasMoreUpvotesModal,
    };
}