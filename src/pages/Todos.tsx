import { FormEvent, useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import type { Tables } from "../lib/database.types";

type Todo = Tables<"todos">;

export default function Todos() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(true);

  async function load() {
    const { data, error } = await supabase
      .from("todos")
      .select("*")
      .order("completed", { ascending: true })
      .order("due_date", { ascending: true, nullsFirst: false })
      .order("created_at", { ascending: false });
    if (!error) setTodos(data ?? []);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  async function addTodo(e: FormEvent) {
    e.preventDefault();
    if (!title.trim()) return;
    const { error } = await supabase.from("todos").insert({ title: title.trim() });
    if (!error) {
      setTitle("");
      load();
    }
  }

  async function toggleComplete(todo: Todo) {
    await supabase
      .from("todos")
      .update({ completed: !todo.completed, completed_at: !todo.completed ? new Date().toISOString() : null })
      .eq("id", todo.id);
    load();
  }

  async function remove(id: string) {
    await supabase.from("todos").delete().eq("id", id);
    load();
  }

  return (
    <div className="max-w-2xl">
      <h1 className="mb-4 text-2xl font-semibold">To-Do List</h1>

      <form onSubmit={addTodo} className="mb-6 flex gap-2">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Add a task..."
          className="flex-1 rounded-lg border border-slate-300 bg-transparent px-3 py-2 text-sm outline-none focus:border-brand-500 dark:border-slate-700"
        />
        <button
          type="submit"
          className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700"
        >
          Add
        </button>
      </form>

      {loading ? (
        <p className="text-sm text-slate-400">Loading...</p>
      ) : todos.length === 0 ? (
        <p className="text-sm text-slate-400">Nothing on the list yet.</p>
      ) : (
        <ul className="space-y-2">
          {todos.map((todo) => (
            <li
              key={todo.id}
              className="flex items-center gap-3 rounded-lg border border-slate-200 px-3 py-2 dark:border-slate-800"
            >
              <input
                type="checkbox"
                checked={todo.completed}
                onChange={() => toggleComplete(todo)}
                className="h-4 w-4 accent-brand-600"
              />
              <span className={`flex-1 text-sm ${todo.completed ? "text-slate-400 line-through" : ""}`}>
                {todo.title}
              </span>
              {todo.due_date && (
                <span className="text-xs text-slate-400">{todo.due_date}</span>
              )}
              <button
                onClick={() => remove(todo.id)}
                className="text-xs text-slate-400 hover:text-red-500"
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
