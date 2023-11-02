import { createClient } from "@/lib/supabase/server";
import { Database } from "@/lib/sb_types.ts";
import { revalidatePath } from "next/cache";

type Todo = Database["public"]["Tables"]["todos"]["Row"];

export default async function UpdateTodo({ todo }: { todo: Todo }) {
  const updateTodo = async (formData: formData) => {
    "use server";

    todo.is_complete = true;
    //todo.task = formData.task;
    todo.task = String(formData.get("task"));

    const supabase = createClient();
    const { data } = await supabase
      .from("todos")
      .update(todo)
      .match({ id: todo.id });

    revalidatePath("/todos");
  };

  return (
    <form action={updateTodo}>
      {/*
      <p>
        {todo.id} -- {todo.task}
      </p>
      {todo.task}
      */}
      <input name="task" className="bg-pink-50" defaultValue={todo.task} />
      <button name="update" className="bg-yellow-100">
        update
      </button>
    </form>
  );
}
