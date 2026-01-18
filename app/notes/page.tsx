import { redirect } from "next/navigation";

function Notes() {
  redirect("/notes/filter/all");

  return null;
}

export default Notes;
