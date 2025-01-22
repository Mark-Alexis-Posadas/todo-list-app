import { ChangeEvent, useRef, FC } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlusCircle } from "@fortawesome/free-solid-svg-icons";

interface TodoFormType {
  inputVal: string;
  setInputVal: (value: string) => void;
  todos: string[];
  setTodos: (todos: string[]) => void;
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

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    todos.includes(e.target.value) ? setExists(true) : setExists(false);
    setInputVal(e.target.value);
  };

  const handleAddTodo = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (inputVal.trim() === "") {
      setAlertText("Please add a todo...");
      setAlert(true);
      setAlertColor(false);
      inputRef.current?.focus();
      return;
    }

    if (exists) {
      return;
    }

    const newTodo: TodoType = { text: inputVal, completed: false };
    setTodos([...todos, newTodo]);
    setInputVal("");
  };

  return (
    <>
      {exists && (
        <span className="text-xs text-red-700">Todo already exists</span>
      )}
      {alert && (
        <p className={alertColor ? "text-green-500" : "text-red-500"}>
          {alertText}
        </p>
      )}
      <form
        onSubmit={handleAddTodo}
        className="flex items-center justify-center gap-3 mb-5"
      >
        <div className="flex items-center gap-3 w-full">
          <input
            ref={inputRef}
            type="text"
            className="border border-slate rounded bg-slate-50 p-2 flex-1"
            placeholder="Add todo"
            onChange={handleChange}
            value={inputVal}
          />
          <button
            className="bg-blue-600 text-white p-3 md:p-2 rounded hover:bg-blue-500 flex items-center justify-center gap-2"
            type="submit"
          >
            <FontAwesomeIcon icon={faPlusCircle} />
            <span className="hidden md:block">Add Todo</span>
          </button>
        </div>
      </form>
    </>
  );
};
