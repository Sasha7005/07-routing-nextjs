import css from "./NoteForm.module.css";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import toast from "react-hot-toast";
import { createNote } from "@/lib/api";
import type { NoteForm } from "../../types/note";

interface NoteFormProps {
  onCloseModal: () => void;
}

const NoteFormSchema = Yup.object({
  title: Yup.string()
    .min(3, "Title is too short")
    .max(50, "Title is too long")
    .required("Title required"),
  content: Yup.string().max(500, "Content is too long"),
  tag: Yup.string()
    .oneOf(["Work", "Personal", "Meeting", "Shopping", "Todo"])
    .required("Tag is required"),
});

export default function NoteForm({ onCloseModal }: NoteFormProps) {
  const queryClient = useQueryClient();

  const createNoteMutation = useMutation({
    mutationFn: createNote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
      toast.success("Note created");
      onCloseModal();
    },
    onError: () => {
      toast.error("Failed to create note");
    },
  });

  const initialValues: NoteForm = {
    title: "",
    content: "",
    tag: "Todo",
  };

  function handleSubmit(values: NoteForm) {
    createNoteMutation.mutate(values);
  }

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={NoteFormSchema}
      onSubmit={handleSubmit}
    >
      <Form className={css.form}>
        <div className={css.formGroup}>
          <label htmlFor="title">Title</label>
          <Field id="title" type="text" name="title" className={css.input} />
          <ErrorMessage name="title" component="span" className={css.error} />
        </div>

        <div className={css.formGroup}>
          <label htmlFor="content">Content</label>
          <Field
            as="textarea"
            id="content"
            name="content"
            rows={8}
            className={css.textarea}
          />
          <ErrorMessage name="content" component="span" className={css.error} />
        </div>

        <div className={css.formGroup}>
          <label htmlFor="tag">Tag</label>
          <Field as="select" id="tag" name="tag" className={css.select}>
            <option value="Todo">Todo</option>
            <option value="Work">Work</option>
            <option value="Personal">Personal</option>
            <option value="Meeting">Meeting</option>
            <option value="Shopping">Shopping</option>
          </Field>
          <ErrorMessage name="tag" component="span" className={css.error} />
        </div>

        <div className={css.actions}>
          <button
            type="button"
            className={css.cancelButton}
            onClick={onCloseModal}
            disabled={createNoteMutation.isPending}
          >
            Cancel
          </button>
          <button
            type="submit"
            className={css.submitButton}
            disabled={createNoteMutation.isPending}
          >
            Create note
          </button>
        </div>
      </Form>
    </Formik>
  );
}
