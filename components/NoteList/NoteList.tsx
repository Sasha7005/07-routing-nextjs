import css from "./NoteList.module.css";
import { useState } from "react";
import type { Note } from "../../types/note";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteNote } from "@/lib/api";
import toast from "react-hot-toast";
import Link from "next/link";

interface NoteListProps {
  notes: Note[];
}

export default function NoteList({ notes }: NoteListProps) {
  const queryClient = useQueryClient();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const deleteNoteMutation = useMutation({
    mutationFn: deleteNote,
    onMutate: (id: string) => {
      setDeletingId(id);
    },
    onSettled: () => {
      setDeletingId(null);
      queryClient.invalidateQueries({ queryKey: ["notes"] });
    },
    onSuccess: () => {
      toast.success("Note deleted");
    },
    onError: () => {
      toast.error("Failed to delete");
    },
  });
  return (
    <ul className={css.list}>
      {notes.map(({ id, title, content, tag }) => (
        <li key={id} className={css.listItem}>
          <h2 className={css.title}>{title}</h2>
          <p className={css.content}>{content}</p>
          <div className={css.footer}>
            <span className={css.tag}>{tag}</span>
            <Link className={css.link} href={`/notes/${id}`}>
              View details
            </Link>
            <button
              className={css.button}
              disabled={deletingId === id}
              onClick={() => deleteNoteMutation.mutate(id)}
            >
              {deletingId === id ? "Deleting..." : "Delete"}
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
}
