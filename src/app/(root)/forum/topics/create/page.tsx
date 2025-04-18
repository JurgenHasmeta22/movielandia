import { Suspense } from "react";
import { Metadata } from "next";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import CreateTopicPageContent from "./_components/CreateTopicPageContent";
import LoadingSpinner from "@/components/root/loadingSpinner/LoadingSpinner";
import { getCategories } from "@/actions/forum/forumCategory.actions";

interface ICreateTopicPageProps {
  searchParams?: Promise<{
    categoryId?: string;
  }>;
}

export const metadata: Metadata = {
  title: "Create Topic | Forum | MovieLandia24",
  description: "Create a new discussion topic in the MovieLandia24 forum.",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function CreateTopicPage(props: ICreateTopicPageProps) {
  const session = await getServerSession(authOptions);
  
  if (!session?.user) {
    redirect("/api/auth/signin?callbackUrl=/forum");
  }
  
  const categories = await getCategories(1, 100);
  const searchParams = await props.searchParams;
  
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <CreateTopicPageContent 
        categories={categories.items} 
        initialCategoryId={searchParams?.categoryId ? Number(searchParams.categoryId) : undefined}
        session={session} 
      />
    </Suspense>
  );
}
