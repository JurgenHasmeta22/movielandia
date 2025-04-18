import { Suspense } from "react";
import { Metadata } from "next";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getCategoryById } from "@/actions/forum/forumCategory.actions";
import { getTopics } from "@/actions/forum/forumTopic.actions";
import { notFound } from "next/navigation";
import CategoryPageContent from "./_components/CategoryPageContent";
import LoadingSpinner from "@/components/root/loadingSpinner/LoadingSpinner";

interface ICategoryPageProps {
  params: {
    categoryId: string;
    categorySlug: string;
  };
  searchParams?: Promise<{
    page?: string;
    sortBy?: string;
    order?: string;
  }>;
}

export async function generateMetadata({ params }: ICategoryPageProps): Promise<Metadata> {
  const category = await getCategoryById(Number(params.categoryId));

  if (!category) {
    return {
      title: "Category Not Found | MovieLandia24",
      description: "The requested forum category could not be found.",
    };
  }

  return {
    title: `${category.name} | Forum | MovieLandia24`,
    description: category.description,
    openGraph: {
      title: `${category.name} | Forum | MovieLandia24`,
      description: category.description,
      url: `/forum/categories/${category.id}/${category.slug}`,
      siteName: "MovieLandia24",
      locale: "en_US",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      site: "@movieLandia24",
      creator: "movieLandia24",
      title: `${category.name} | Forum | MovieLandia24`,
      description: category.description,
    },
  };
}

export default async function CategoryPage(props: ICategoryPageProps) {
  const session = await getServerSession(authOptions);
  const category = await getCategoryById(Number(props.params.categoryId));

  if (!category) {
    return notFound();
  }

  const searchParams = await props.searchParams;
  const searchParamsKey = JSON.stringify(searchParams);

  const currentPage = searchParams?.page ? parseInt(searchParams.page) : 1;
  const currentSortBy = searchParams?.sortBy || "lastPostAt";
  const currentOrder = searchParams?.order || "desc";
  const limit = 10;

  // Fetch topics in the server component
  const topics = await getTopics(category.id, currentPage, limit);

  return (
    <Suspense key={searchParamsKey} fallback={<LoadingSpinner />}>
      <CategoryPageContent
        category={category}
        searchParams={searchParams}
        session={session}
        topics={topics}
        currentPage={currentPage}
        currentSortBy={currentSortBy}
        currentOrder={currentOrder}
      />
    </Suspense>
  );
}
