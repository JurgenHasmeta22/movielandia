import { useState, useRef, useEffect } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { useStore } from "~/store/store";
import { useSorting } from "./useSorting";
import { useModal } from "~/services/providers/ModalContext";

export function useDetailsPageData() {
    const [review, setReview] = useState<string>("");
    const [rating, setRating] = useState<number | null>(0);
    const [open, setOpen] = useState<boolean>(false);
    const [isEditMode, setIsEditMode] = useState<boolean>(false);
    const [openVotesModal, setIsOpenVotesModal] = useState(false);

    const textEditorRef = useRef<any>(null);
    const reviewRef = useRef<any>(null);

    const {
        user,
        setUser,
        selectedReview,
        setSelectedReview,
        upvotesPageModal,
        setUpvotesPageModal,
        setHasMoreUpvotesModal,
        downvotesPageModal,
        setDownvotesPageModal,
        setHasMoreDownvotesModal,
        listModalDataType,
        setListModalDataType,
    } = useStore();

    const params = useParams();
    const [searchParams, setSearchParams] = useSearchParams();
    const { openModal } = useModal();
    const handleChangeSorting = useSorting();

    const page = searchParams.get("page") || 1;
    const sortBy = searchParams.get("sortBy");
    const ascOrDesc = searchParams.get("ascOrDesc");

    useEffect(() => {
        setUpvotesPageModal(1);
        setDownvotesPageModal(1);
    }, []);

    return {
        rating,
        setRating,
        review,
        setReview,
        open,
        setOpen,
        isEditMode,
        setIsEditMode,
        openVotesModal,
        setIsOpenVotesModal,
        textEditorRef,
        reviewRef,
        params,
        searchParams,
        setSearchParams,
        openModal,
        handleChangeSorting,
        page,
        sortBy,
        ascOrDesc,
        user,
        setUser,
        selectedReview,
        setSelectedReview,
        upvotesPageModal,
        setUpvotesPageModal,
        setHasMoreUpvotesModal,
        downvotesPageModal,
        setDownvotesPageModal,
        setHasMoreDownvotesModal,
        listModalDataType,
        setListModalDataType,
    };
}
