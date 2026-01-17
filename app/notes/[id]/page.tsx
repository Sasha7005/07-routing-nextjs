import {
  QueryClient,
  HydrationBoundary,
  dehydrate,
} from "@tanstack/react-query";
import { getNoteById } from "@/lib/api";
import NoteDetailsClient from "./NoteDetails.client";

type NoteDetailsProps = {
  readonly params: Promise<{ id: string }>;
};

async function Note({ params }: NoteDetailsProps) {
  const { id } = await params;
  const queryClient = new QueryClient();

  queryClient.prefetchQuery({
    queryKey: ["note", id],
    queryFn: () => getNoteById(id),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NoteDetailsClient />
    </HydrationBoundary>
  );
}

export default Note;
