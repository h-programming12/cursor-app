"use client";

import { Todo } from "@/types/todo";

interface TodoItemProps {
  todo: Todo;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

export default function TodoItem({
  todo,
  onToggle,
  onDelete,
}: TodoItemProps) {
  return (
    <div className="group flex items-center gap-3 rounded-lg border border-zinc-200 bg-white p-4 transition-colors hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:bg-zinc-800">
      <input
        type="checkbox"
        checked={todo.completed}
        onChange={() => onToggle(todo.id)}
        className="h-5 w-5 cursor-pointer rounded border-zinc-300 text-blue-600 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:border-zinc-600"
      />
      <span
        className={`flex-1 text-base ${
          todo.completed
            ? "line-through text-zinc-400 dark:text-zinc-500"
            : "text-zinc-900 dark:text-zinc-100"
        }`}
      >
        {todo.text}
      </span>
      <button
        onClick={() => onDelete(todo.id)}
        className="rounded px-3 py-1 text-sm font-medium text-red-600 opacity-0 transition-opacity hover:bg-red-50 group-hover:opacity-100 dark:text-red-400 dark:hover:bg-red-950"
      >
        삭제
      </button>
    </div>
  );
}
