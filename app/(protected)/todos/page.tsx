import { createClient } from "@/lib/supabase/server";

import NewTodo from "./new-todo";
import ShowTodo from "./show-todo";
import UpdateTodo from "./update-todo";
import DeleteTodo from "./delete-todo";

export const dynamic = "force-dynamic";

export default async function Page() {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: todos } = await supabase.from("todos").select();

  return (
    <div>
      <NewTodo user={user} />
      {/*<pre>{JSON.stringify(todos, null, 2)}</pre>;*/}
      <div className="m-8">
        update todos
        {todos?.map((todo: Todo) => {
          return (
            <div key={todo.id} className="p-4 bg-slate-200 mb-2">
              <ShowTodo todo={todo} />
              <UpdateTodo todo={todo} />
              <DeleteTodo todo={todo} />
            </div>
          );
        })}
      </div>

      {/*
      <div className="bg-yellow-300 m-8">
        delete todos
        {todos?.map((todo: Todo) => (
          <DeleteTodo key={todo.id} todo={todo} />
        ))}
      </div>
      */}
    </div>
  );
}
