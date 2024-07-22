import { useState, useEffect, ChangeEvent, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCheckCircle,
  faExclamation,
  faPlusCircle,
  faTimesCircle,
} from "@fortawesome/free-solid-svg-icons";
import TodoItem from "./components/TodoItem";
import { TodoType } from "./types/Todo";

export default function Todo() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [todos, setTodos] = useState<string[]>(() => {
    const savedTodos = localStorage.getItem("todos");
    try {
      // Check if savedTodos is defined and parseable JSON
      return savedTodos ? JSON.parse(savedTodos) : [];
    } catch (error) {
      // Handle JSON parsing error (e.g., savedTodos is not valid JSON)
      console.error("Error parsing todos from localStorage:", error);
      return []; // Default to empty array if parsing fails
    }
  });

  const [inputVal, setInputVal] = useState<string>("");
  const [modalEdit, setModalEdit] = useState<boolean>(false);
  const [confirm, setConfirm] = useState<boolean>(false);
  const [alert, setAlert] = useState<boolean>(false);
  const [alertText, setAlertText] = useState<string>("");
  const [alertColor, setAlertColor] = useState<boolean>(false);
  const [exist, setExists] = useState<boolean>(false);
  const [deleteTodo, setDeleteTodo] = useState<{
    index: null | number;
    isShow: boolean;
    name: string;
  }>({
    index: null,
    isShow: false,
    name: "",
  });

  const [currentTodo, setCurrentTodo] = useState<TodoType>({
    index: null,
    text: "",
  });

  useEffect(() => {
    localStorage.setItem("todos", JSON.stringify(todos));
  }, [todos]);

  useEffect(() => {
    if (alert) {
      const timer = setTimeout(() => {
        setAlert(false);
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [alert]);

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

    if (exist) {
      return;
    }

    setTodos([...todos, inputVal]);
    setInputVal("");
  };

  const handleDelete = (index: number, todoName: string) => {
    setDeleteTodo({ index: index, isShow: true, name: todoName });
  };

  const handleDeleteConfirm = () => {
    if (deleteTodo.isShow) {
      const deleteTodos = todos.filter((_, idx) => idx !== deleteTodo.index);
      setTodos(deleteTodos);
      setInputVal("");

      setDeleteTodo((prevState) => ({
        ...prevState,
        isShow: false,
      }));
      setAlert(true);
      setAlertText(`${deleteTodo.name} has been deleted`);
      setAlertColor(true);
    }

    if (todos) {
      setExists(false);
    }
  };

  const handleEdit = (index: number) => {
    setCurrentTodo({ index, text: todos[index] });
    setModalEdit(true);
  };

  const handleCancel = () => {
    setModalEdit(false);
    setCurrentTodo({ index: null, text: "" });
  };

  const handleUpdate = () => {
    if (currentTodo.text.trim() === "") {
      setAlertText("Please enter a valid todo");
      setAlert(true);
      return;
    }

    if (
      currentTodo.index !== null &&
      currentTodo.text !== todos[currentTodo.index]
    ) {
      const updatedTodos: string[] = todos.map((todo, idx) =>
        idx === currentTodo.index ? currentTodo.text : todo
      );
      setTodos(updatedTodos);

      setAlert(true);
      setAlertText(`${todos} has been updated to "${currentTodo.text}"`);
      setAlertColor(true);
    }

    setModalEdit(false);
    setCurrentTodo({ index: null, text: "" });
  };

  const handleClearAll = () => {
    setConfirm(true);
  };

  const handleSuccess = () => {
    setTodos([]);
    setConfirm(false);
    const res =
      todos.length > 1
        ? "All todos have been deleted!"
        : "The todo has been deleted!";
    setAlertText(res);
    setAlert(true);
    setAlertColor(true);
    setInputVal("");
  };

  return (
    <div className="p-5 md:p-0 md:max-w-[900px] m-auto relative text-center montserrat">
      <h1 className="mb-5 font-bold text-4xl md:text-5xl">Todo List APP</h1>
      {exist && (
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

      {todos.length <= 0 ? (
        "No todos left"
      ) : (
        <>
          <ul>
            {todos.map((item, index) => (
              <TodoItem
                key={index}
                item={item}
                index={index}
                handleDelete={() => handleDelete(index, item)}
                handleEdit={handleEdit}
                isEditing={currentTodo.index === index}
              />
            ))}
          </ul>
          <button
            className="text-center text-white bg-blue-600 p-2 rounded mt-2"
            onClick={handleClearAll}
          >
            {todos.length > 1 ? "Clear All Todos" : "Clear Todo"}
          </button>
        </>
      )}

      {confirm && (
        <div className="fixed left-0 top-0 right-0 bottom-0 flex items-center flex-col justify-center bg-[rgba(0,0,0,0.4)]">
          <div className="bg-white rounded p-5 text-center">
            <FontAwesomeIcon
              icon={faExclamation}
              className="text-5xl text-red-500 rounded-full p-5 border-2 border-red-500 w-[100px] h-[100px] mb-5"
            />
            <h1 className="font-bold text-4xl mb-5">
              {todos.length > 1
                ? "Are you sure to delete all these todos?"
                : "Are you sure to delete this todo?"}
            </h1>
            <div className="flex items-center gap-3 w-full justify-center">
              <button
                className="text-white p-2 rounded bg-blue-600"
                onClick={handleSuccess}
              >
                {todos.length > 1
                  ? "Yes, delete all these Todos"
                  : "Yes, delete this Todo"}
              </button>
              <button
                className="text-white p-2 rounded bg-red-600"
                onClick={() => setConfirm(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {deleteTodo.isShow && (
        <div className="fixed left-0 top-0 right-0 bottom-0 flex items-center flex-col justify-center bg-[rgba(0,0,0,0.4)]">
          <div className="bg-white rounded p-5 text-center">
            <FontAwesomeIcon
              icon={faExclamation}
              className="text-5xl text-red-500 rounded-full p-5 border-2 border-red-500 w-[100px] h-[100px] mb-5"
            />
            <h1 className="font-bold text-4xl mb-5">
              Are you sure to delete this <span>"{deleteTodo.name}"</span>?
            </h1>
            <div className="flex items-center gap-3 w-full justify-center">
              <button
                className="text-white p-2 rounded bg-blue-600"
                onClick={handleDeleteConfirm}
              >
                Yes, delete
              </button>
              <button
                className="text-white p-2 rounded bg-red-600"
                onClick={() =>
                  setDeleteTodo((prevState) => ({
                    ...prevState,
                    isShow: false,
                  }))
                }
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {modalEdit && (
        <div className="fixed left-0 top-0 right-0 bottom-0 flex items-center justify-center bg-[rgba(0,0,0,0.4)]">
          <div className="flex items-center justify-center w-[500px]">
            <input
              type="text"
              className="bg-slate-100 rounded p-2 text-black w-full"
              placeholder="Edit Todo..."
              onChange={(e) =>
                setCurrentTodo({ ...currentTodo, text: e.target.value })
              }
              value={currentTodo.text}
            />
            <div className="flex items-center gap-1 ml-3">
              <button
                className="bg-gray-500 text-white p-2 rounded flex items-center justify-center gap-2"
                onClick={handleCancel}
              >
                <FontAwesomeIcon icon={faTimesCircle} />
                Cancel
              </button>
              <button
                className="bg-blue-600 rounded p-2 text-white flex items-center justify-center gap-2"
                onClick={handleUpdate}
              >
                <FontAwesomeIcon icon={faCheckCircle} />
                Update
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
