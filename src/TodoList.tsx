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
  xp: number;
  setXp: React.Dispatch<React.SetStateAction<number>>;
  streak: number;
  setStreak: React.Dispatch<React.SetStateAction<number>>;
}

export const TodoList: FC<TodoListType> = ({
  setInputVal,
  todos,
  setTodos,
  setAlert,
  setAlertText,
  setAlertColor,
  setExists,
  setXp,
  setStreak,
}) => {
  const [modalEdit, setModalEdit] = useState(false);
  const [confirm, setConfirm] = useState(false);

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

  const completedCount = todos.filter((t) => t.completed).length;
  const activeCount = todos.length - completedCount;

  const handleToggleCompleted = (index: number) => {
    const updatedTodos = [...todos];
    updatedTodos[index].completed = !updatedTodos[index].completed;

    // 🎯 XP logic
    if (updatedTodos[index].completed) {
      setXp((prev) => prev + 10);
      setStreak((prev) => prev + 1);
    } else {
      setStreak(0);
    }

    setTodos(updatedTodos);
  };

  const handleDelete = (index: number, todoName: string) => {
    setDeleteTodo({ index, isShow: true, name: todoName });
  };

  const handleDeleteConfirm = () => {
    if (deleteTodo.index !== null) {
      const updated = todos.filter((_, idx) => idx !== deleteTodo.index);
      setTodos(updated);
      setDeleteTodo({ index: null, isShow: false, name: "" });

      setAlert(true);
      setAlertText(`🔥 Mission "${deleteTodo.name}" deleted`);
      setAlertColor(true);
      setExists(false);
    }
  };

  const handleEdit = (index: number) => {
    setCurrentTodo({ index, text: todos[index].text });
    setModalEdit(true);
  };

  const handleUpdate = () => {
    if (currentTodo.index === null) return;

    if (!currentTodo.text.trim()) {
      setAlertText("⚠ Mission name required");
      setAlert(true);
      setAlertColor(false);
      return;
    }

    const updatedTodos = todos.map((todo, idx) =>
      idx === currentTodo.index
        ? { ...todo, text: currentTodo.text.trim() }
        : todo,
    );

    setTodos(updatedTodos);

    setAlert(true);
    setAlertText("✅ Mission updated successfully");
    setAlertColor(true);

    setModalEdit(false);
    setCurrentTodo({ index: null, text: "" });
  };

  const handleClearAll = () => {
    setConfirm(true);
  };

  const handleSuccess = () => {
    setTodos([]);
    setConfirm(false);

    setAlert(true);
    setAlertText("💀 All missions terminated");
    setAlertColor(true);

    setInputVal("");
    setExists(false);
  };

  return (
    <div className="w-full max-w-[700px] mt-6">
      {/* STATS PANEL */}
      {todos.length > 0 && (
        <div className="flex justify-between mb-6 text-green-400 text-sm">
          <p>📌 Total: {todos.length}</p>
          <p>✅ Completed: {completedCount}</p>
          <p>🔥 Active: {activeCount}</p>
        </div>
      )}

      {/* TODO LIST */}
      {todos.length === 0 ? (
        <p className="text-center text-green-600 opacity-60">
          No active missions...
        </p>
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
            className="mt-4 w-full border border-red-500 text-red-400 
                       hover:bg-red-500 hover:text-black 
                       transition-all duration-200 p-2 rounded"
            onClick={handleClearAll}
          >
            Clear All Missions
          </button>
        </>
      )}

      {/* CONFIRM ALL MODAL */}
      {confirm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/70">
          <div className="bg-[#111] border border-red-500 p-8 rounded text-center shadow-[0_0_20px_red]">
            <FontAwesomeIcon
              icon={faExclamation}
              className="text-5xl text-red-500 mb-4"
            />
            <h2 className="text-xl text-red-400 mb-6">
              Terminate all missions?
            </h2>

            <div className="flex gap-4 justify-center">
              <button
                className="px-4 py-2 border border-green-500 text-green-400 
                           hover:bg-green-500 hover:text-black rounded transition"
                onClick={handleSuccess}
              >
                Confirm
              </button>
              <button
                className="px-4 py-2 border border-red-500 text-red-400 
                           hover:bg-red-500 hover:text-black rounded transition"
                onClick={() => setConfirm(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DELETE SINGLE MODAL */}
      {deleteTodo.isShow && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/70">
          <div className="bg-[#111] border border-red-500 p-8 rounded text-center shadow-[0_0_20px_red]">
            <FontAwesomeIcon
              icon={faExclamation}
              className="text-5xl text-red-500 mb-4"
            />
            <h2 className="text-lg text-red-400 mb-6">
              Delete mission "{deleteTodo.name}"?
            </h2>

            <div className="flex gap-4 justify-center">
              <button
                className="px-4 py-2 border border-green-500 text-green-400 
                           hover:bg-green-500 hover:text-black rounded transition"
                onClick={handleDeleteConfirm}
              >
                Proceed
              </button>
              <button
                className="px-4 py-2 border border-red-500 text-red-400 
                           hover:bg-red-500 hover:text-black rounded transition"
                onClick={() =>
                  setDeleteTodo({ index: null, isShow: false, name: "" })
                }
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* EDIT MODAL */}
      {modalEdit && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/70">
          <div className="bg-[#111] border border-green-500 p-6 rounded shadow-[0_0_20px_#00ff88] w-[400px]">
            <input
              type="text"
              className="w-full bg-black border border-green-500 
                         text-green-400 p-2 rounded mb-4 focus:outline-none"
              value={currentTodo.text}
              onChange={(e) =>
                setCurrentTodo({ ...currentTodo, text: e.target.value })
              }
            />

            <div className="flex justify-between">
              <button
                className="border border-gray-500 text-gray-400 
                           hover:bg-gray-500 hover:text-black 
                           px-3 py-2 rounded transition"
                onClick={() => setModalEdit(false)}
              >
                <FontAwesomeIcon icon={faTimesCircle} /> Cancel
              </button>

              <button
                className="border border-green-500 text-green-400 
                           hover:bg-green-500 hover:text-black 
                           px-3 py-2 rounded transition"
                onClick={handleUpdate}
              >
                <FontAwesomeIcon icon={faCheckCircle} /> Update
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
