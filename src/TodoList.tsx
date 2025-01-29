import { useState, FC } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCheckCircle,
  faExclamation,
  faTimesCircle,
} from "@fortawesome/free-solid-svg-icons";
import TodoItem from "./components/TodoItem";
import { TodoType, CurrentTodoType } from "./types/Todo";

interface TodoListType {
  setInputVal: (value: string) => void;
  todos: TodoType[];
  setTodos: (todos: TodoType[]) => void;
  setAlert: (alert: boolean) => void;
  setAlertText: (text: string) => void;
  setAlertColor: (color: boolean) => void;
  setExists: (exists: boolean) => void;
}

export const TodoList: FC<TodoListType> = ({
  setInputVal,
  todos,
  setTodos,
  setAlert,
  setAlertText,
  setAlertColor,
  setExists,
}) => {
  const [modalEdit, setModalEdit] = useState<boolean>(false);
  const [confirm, setConfirm] = useState<boolean>(false);

  const [deleteTodo, setDeleteTodo] = useState<{
    index: null | number;
    isShow: boolean;
    name: string;
  }>({
    index: null,
    isShow: false,
    name: "",
  });

  const [currentTodo, setCurrentTodo] = useState<CurrentTodoType>({
    index: null,
    text: "",
  });

  const handleToggleCompleted = (index: number) => {
    const updatedTodos = todos.map((todo, idx) =>
      idx === index ? { ...todo, completed: !todo.completed } : todo
    );
    setTodos(updatedTodos);
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
    setCurrentTodo({ index, text: todos[index].text });
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

      setAlertText(
        `Todo "${todos[currentTodo.index]}" has been updated to "${
          currentTodo.text
        }"`
      );

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
    <div className="p-5 md:p-0 relative montserrat">
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
                handleDelete={() => handleDelete(index, item.text)}
                handleEdit={handleEdit}
                isEditing={currentTodo.index === index}
                handleToggleCompleted={handleToggleCompleted}
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
                Proceed
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
};
