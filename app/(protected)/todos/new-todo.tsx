import { createClient } from "@/lib/supabase/server";
import { Database } from "@/lib/sb_types.ts";
import { revalidatePath } from "next/cache";

import { Button } from "@/components/ui/button";

export default async function NewTodo({ user }: { user: any }) {
  const addTodo = async (formData: formData) => {
    "use server";
    let fd = {
      task: String(formData.get("task")),
      user_id: user.id,
    };

    const supabase = createClient();
    await supabase.from("todos").insert(fd);

    revalidatePath("/todos");
  };

  return (
    <form action={addTodo}>
      <input name="task" className="bg-yellow-100" />

      <Button variant="outline" type="submit">
        clicky
      </Button>
    </form>
  );
}
