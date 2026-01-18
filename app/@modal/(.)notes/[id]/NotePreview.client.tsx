"use client";
import css from "./NotePreview.module.css";
import Modal from "@/components/Modal/Modal";
import { useQuery } from "@tanstack/react-query";
import { useParams, useRouter } from "next/navigation";
import { getNoteById } from "@/lib/api";

export default function NotePreviewClient() {
  const router = useRouter();
  const closeModal = (): void => {
    router.back();
  };
  const { id } = useParams<{ id: string }>();
  const {
    data: note,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["notes", id],
    queryFn: () => getNoteById(id),
    refetchOnMount: false,
  });

  if (isLoading) return <p>Loading...</p>;
  if (error || !note) return <p>Something went wrong</p>;

  const formattedDate = note.updatedAt
    ? `Updated at: ${new Date(note.updatedAt).toLocaleDateString()}`
    : `Created at: ${new Date(note.createdAt).toLocaleDateString()}`;

  return (
    <Modal onClose={closeModal}>
      <div className={css.container}>
        <div className={css.item}>
          <div className={css.header}>
            <h2>{note.title}</h2>
          </div>
          <p className={css.content}>{note.content}</p>
          <p className={css.date}>{formattedDate}</p>
          <p className={css.tag}>{note.tag}</p>
          <button className={css.backBtn} type="button" onClick={closeModal}>
            Go back
          </button>
        </div>
      </div>
    </Modal>
  );
}
