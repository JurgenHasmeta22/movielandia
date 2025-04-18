import { getCategoryById } from "@/actions/forum/forumCategory.actions";
import { redirect } from "next/navigation";

interface ICreateTopicPageProps {
    searchParams?: Promise<{
        categoryId?: string;
    }>;
}

export default async function CreateTopicRedirectPage(props: ICreateTopicPageProps) {
    const searchParams = await props.searchParams;
    const categoryId = searchParams?.categoryId;

    if (!categoryId) {
        // If no category ID is provided, redirect to the forum home
        redirect("/forum");
    }

    const category = await getCategoryById(Number(categoryId));

    // Redirect to the new URL structure
    redirect(`/forum/categories/${category.id}/${category.slug}/topics/create`);
}
