import { Metadata } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import CreatePlaylistForm from "./_components/CreatePlaylistForm";

export const metadata: Metadata = {
    title: "Create Playlist | MovieLandia24",
    description: "Create a new playlist for your favorite content",
};

export default async function CreatePlaylistPage() {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
        redirect("/auth/signin");
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-2xl font-bold mb-6">Create New Playlist</h1>
            <CreatePlaylistForm userId={Number(session.user.id)} />
        </div>
    );
}