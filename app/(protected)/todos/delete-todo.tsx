import { createClient } from "@/lib/supabase/server";
import { Database } from "@/lib/sb_types";
import { revalidatePath } from "next/cache";

type Todo = Database["public"]["Tables"]["todos"]["Row"];

export default async function DeleteTodo({ todo }: { todo: Todo }) {
  const updateTodo = async (formData: FormData) => {
    "use server";

    todo.is_complete = true;

    const supabase = createClient();
    const { data } = await supabase.from("todos").delete().eq("id", todo.id);

    revalidatePath("/todos");
  };

  return (
    <form action={updateTodo}>
      {/*
      <p>
        {todo.id} -- {todo.task}
      </p>
      <input name="fs_path" className="bg-yellow-50" />
      */}
      <button name="update" className="bg-red-200">
        delete
      </button>
    </form>
  );
}
