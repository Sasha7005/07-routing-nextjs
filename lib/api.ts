import axios from "axios";
import type { Note, NoteForm } from "../types/note";

const API_KEY = process.env.NEXT_PUBLIC_NOTEHUB_TOKEN;

const instance = axios.create({
  baseURL: "https://notehub-public.goit.study/api",
  headers: {
    Authorization: `Bearer ${API_KEY}`,
  },
});

interface GetNotesResponse {
  notes: Note[];
  totalPages: number;
}

async function getNotes(
  page: number = 1,
  search?: string,
  tag?: string,
): Promise<GetNotesResponse> {
  const { data } = await instance.get<GetNotesResponse>("/notes", {
    params: {
      search,
      page,
      perPage: 12,
      tag,
    },
  });
  return data;
}

async function getNoteById(id: string): Promise<Note> {
  const { data } = await instance.get<Note>(`/notes/${id}`);
  return data;
}

async function createNote(newNote: NoteForm): Promise<Note> {
  const { data } = await instance.post<Note>("/notes", newNote);
  return data;
}

async function deleteNote(id: string): Promise<Note> {
  const { data } = await instance.delete<Note>(`/notes/${id}`);
  return data;
}
export { getNoteById, deleteNote, createNote, getNotes };
