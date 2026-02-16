import { ChangeEvent, useRef, FC, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlusCircle } from "@fortawesome/free-solid-svg-icons";
import { TodoType } from "../types/Todo";

interface TodoFormType {
  inputVal: string;
  setInputVal: (value: string) => void;
  todos: TodoType[];
  setTodos: (todos: TodoType[]) => void;
  alert: boolean;
  setAlert: (alert: boolean) => void;
  alertText: string;
  setAlertText: (text: string) => void;
  alertColor: boolean;
  setAlertColor: (color: boolean) => void;
  exists: boolean;
  setExists: (exists: boolean) => void;
}

export const TodoForm: FC<TodoFormType> = ({
  inputVal,
  setInputVal,
  todos,
  setTodos,
  alert,
  setAlert,
  alertText,
  setAlertText,
  alertColor,
  setAlertColor,
  exists,
  setExists,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const [difficulty, setDifficulty] = useState<"easy" | "medium" | "hard">(
    "easy",
  );

  // ✅ Improved duplicate check (case insensitive + trimmed)
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const normalized = value.trim().toLowerCase();

    const isDuplicate = todos.some(
      (todo) => todo.text.trim().toLowerCase() === normalized,
    );

    setExists(isDuplicate);
    setInputVal(value);
  };

  const handleAddTodo = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (inputVal.trim() === "") {
      setAlertText("⚠ Mission name required...");
      setAlert(true);
      setAlertColor(false);
      inputRef.current?.focus();
      return;
    }

    if (exists) {
      setAlertText("⚠ Mission already exists!");
      setAlert(true);
      setAlertColor(false);
      return;
    }

    const newTodo: TodoType = {
      text: inputVal.trim(),
      completed: false,
      difficulty, // ✅ new feature
    };

    setTodos([...todos, newTodo]);

    setInputVal("");
    setDifficulty("easy");

    setAlertText("✅ Mission added successfully!");
    setAlert(true);
    setAlertColor(true);
  };

  return (
    <div className="w-full max-w-[600px] mb-8">
      {/* ALERT */}
      {exists && (
        <span className="text-xs text-red-500 block mb-2">
          ⚠ Mission already exists
        </span>
      )}

      {alert && (
        <p
          className={`text-sm mb-3 ${
            alertColor ? "text-green-400" : "text-red-400"
          }`}
        >
          {alertText}
        </p>
      )}

      {/* FORM */}
      <form
        onSubmit={handleAddTodo}
        className="flex flex-col md:flex-row items-center gap-3"
      >
        <input
          ref={inputRef}
          type="text"
          className="flex-1 bg-black border border-green-500 text-green-400 
                     p-3 rounded focus:outline-none focus:ring-2 
                     focus:ring-green-400 transition-all"
          placeholder="Enter new mission..."
          onChange={handleChange}
          value={inputVal}
        />

        {/* Difficulty Selector */}
        <select
          value={difficulty}
          onChange={(e) =>
            setDifficulty(e.target.value as "easy" | "medium" | "hard")
          }
          className="bg-black border border-green-500 text-green-400 
                     p-3 rounded focus:outline-none"
        >
          <option value="easy">Easy (+5 XP)</option>
          <option value="medium">Medium (+10 XP)</option>
          <option value="hard">Hard (+20 XP)</option>
        </select>

        <button
          className="bg-green-500 text-black px-4 py-3 rounded 
                     hover:bg-green-400 hover:scale-105 
                     transition-all duration-200 flex items-center gap-2"
          type="submit"
        >
          <FontAwesomeIcon icon={faPlusCircle} />
          <span className="hidden md:block">Deploy</span>
        </button>
      </form>
    </div>
  );
};
