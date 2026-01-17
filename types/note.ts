export interface Note {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  content: string;
  tag: Tag;
}

export type Tag = "Todo" | "Work" | "Personal" | "Meeting" | "Shopping";

export interface NoteForm {
  title: string;
  content: string;
  tag: Tag;
}
