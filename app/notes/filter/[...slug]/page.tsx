import {
  QueryClient,
  HydrationBoundary,
  dehydrate,
} from "@tanstack/react-query";
import { getNotes } from "@/lib/api";
import NoteClient from "./Notes.client";

interface NotesByCategoryProps {
  params: Promise<{ slug: string[] }>;
  searchParams: Promise<{
    page?: string;
    query?: string;
  }>;
}

const NotesByCategory = async ({
  params,
  searchParams,
}: NotesByCategoryProps) => {
  const { slug } = await params;
  const tag = slug[0] === "all" ? undefined : slug[0];

  const { page, query } = await searchParams;

  const pageNumber = Math.max(1, Number(page) || 1);
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["notes", pageNumber, query, tag],
    queryFn: () => getNotes(pageNumber, query, tag),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NoteClient tag={tag} />
    </HydrationBoundary>
  );
};

export default NotesByCategory;
