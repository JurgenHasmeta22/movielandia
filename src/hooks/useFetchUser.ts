import { useStore } from "@/store/store";
import { useEffect } from "react";
import { useSession } from "next-auth/react";

const fetchUserData = async (userId: number) => {
    const response = await fetch(`/api/user/${userId}/route`);

    if (!response.ok) {
        throw new Error("Failed to fetch user data");
    }

    const data = await response.json();
    return data;
};

const useFetchUser = () => {
    const { data: session } = useSession();
    const { clearUserDetails, setUserDetails } = useStore();

    useEffect(() => {
        if (session?.user?.id) {
            fetchUserData(session.user.id)
                .then((userData) => {
                    setUserDetails(userData);
                })
                .catch((error) => {
                    console.error("Error fetching user data:", error);
                    clearUserDetails();
                });
        }
    }, [session?.user?.id, setUserDetails, clearUserDetails]);
};

export default useFetchUser;
