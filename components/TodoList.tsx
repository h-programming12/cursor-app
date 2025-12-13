"use client";

import { Todo } from "@/types/todo";
import TodoItem from "./TodoItem";

interface TodoListProps {
  todos: Todo[];
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

export default function TodoList({
  todos,
  onToggle,
  onDelete,
}: TodoListProps) {
  if (todos.length === 0) {
    return (
      <div className="py-12 text-center">
        <p className="text-zinc-500 dark:text-zinc-400">
          할 일이 없습니다. 새로운 할 일을 추가해보세요!
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {todos.map((todo) => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onToggle={onToggle}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}
