"use client";

import AppStoreState from "@/types/IStore";
import { create } from "zustand";
import { devtools } from "zustand/middleware";

export const useStore = create<AppStoreState>()(
	devtools(
		(set): AppStoreState => ({
			isOpenSidebarAdmin: true,
			setIsOpenSidebarAdmin: (data) => set({ isOpenSidebarAdmin: data }),

			isDrawerOpen: false,
			setIsDrawerOpen: (data) => set({ isDrawerOpen: data }),

			isEditModeReview: false,
			setIsEditModeReview: (data) => set({ isEditModeReview: data }),
		}),
	),
);
