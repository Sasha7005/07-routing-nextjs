"use client";

import css from "./NotesPage.module.css";
import { useState, useEffect } from "react";
import SearchBox from "@/components/SearchBox/SearchBox";
import { useDebouncedCallback } from "use-debounce";
import NoteList from "@/components/NoteList/NoteList";
import toast from "react-hot-toast";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { getNotes } from "@/lib/api";
import Modal from "@/components/Modal/Modal";
import Pagination from "@/components/Pagination/Pagination";
import NoteForm from "@/components/NoteForm/NoteForm";

type NoteDetailsClientProps = {
  page: number;
  query: string;
};

export default function NoteClient({ page, query }: NoteDetailsClientProps) {
  const [currentQuery, setCurrentQuery] = useState(query);
  const [currentPage, setCurrentPage] = useState(page);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data, isSuccess } = useQuery({
    queryKey: ["notes", currentPage, currentQuery],
    queryFn: () => getNotes(currentPage, currentQuery),
    placeholderData: keepPreviousData,
  });

  const notes = data?.notes ?? [];
  const totalPage = data?.totalPages ?? 0;

  useEffect(() => {
    if (isSuccess && notes.length === 0) {
      toast.error("No notes");
    }
  }, [isSuccess, notes.length]);

  const handleChangeQuery = useDebouncedCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setCurrentPage(1);
      setCurrentQuery(event.target.value);
    },
    600
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
    </div>
  );
}
