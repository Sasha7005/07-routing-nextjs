"use client";

import css from "./NotesPage.module.css";
import { useState, useEffect } from "react";
import SearchBox from "@/components/SearchBox/SearchBox";
import { useDebouncedCallback } from "use-debounce";
import NoteList from "@/components/NoteList/NoteList";
import toast, { Toaster } from "react-hot-toast";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { getNotes } from "@/lib/api";
import Modal from "@/components/Modal/Modal";
import Pagination from "@/components/Pagination/Pagination";
import NoteForm from "@/components/NoteForm/NoteForm";

type NoteDetailsClientProps = {
  tag?: string;
};

export default function NoteClient({ tag }: NoteDetailsClientProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [currentQuery, setCurrentQuery] = useState<string | undefined>(
    undefined,
  );

  const { data, isSuccess, isPending } = useQuery({
    queryKey: ["notes", currentPage, currentQuery, tag],
    queryFn: () => getNotes(currentPage, currentQuery, tag),
    placeholderData: keepPreviousData,
  });

  const notes = data?.notes ?? [];
  const totalPage = data?.totalPages ?? 0;

  useEffect(() => {
    if (isSuccess && !isPending && data?.notes.length === 0) {
      toast.error("No notes");
    }
  }, [data?.notes.length, isSuccess, isPending]);

  const handleChangeQuery = useDebouncedCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setCurrentPage(1);
      setCurrentQuery(event.target.value);
    },
    600,
  );

  function openModal(): void {
    setIsModalOpen(true);
  }

  function closeModal(): void {
    setIsModalOpen(false);
  }

  return (
    <div className={css.app}>
      <header className={css.toolbar}>
        <SearchBox onChange={handleChangeQuery} />
        {totalPage > 1 && (
          <Pagination
            page={currentPage}
            totalPages={totalPage}
            setPage={setCurrentPage}
          />
        )}
        <button className={css.button} onClick={openModal}>
          Create note +
        </button>
      </header>
      {notes.length > 0 && <NoteList notes={notes} />}
      {isModalOpen && (
        <Modal onClose={closeModal}>
          <NoteForm onCloseModal={closeModal} />
        </Modal>
      )}
      <Toaster />
    </div>
  );
}
