import {
  QueryClient,
  HydrationBoundary,
  dehydrate,
} from "@tanstack/react-query";
import { getNotes } from "@/lib/api";
import NoteClient from "./Notes.client";

type NoteProps = {
  params: {
    page?: string;
    query?: string;
  };
};

const Note = async ({ params }: NoteProps) => {
  const page = params.page ?? "1";
  const query = params.query ?? "";

  const pageNumber = Math.max(1, Number(page) || 1);
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["notes", pageNumber, query],
    queryFn: () => getNotes(pageNumber, query),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NoteClient page={pageNumber} query={query} />
    </HydrationBoundary>
  );
};

export default Note;
