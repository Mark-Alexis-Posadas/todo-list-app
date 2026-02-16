import { useState, useEffect } from "react";
import { TodoForm } from "./components/TodoForm";
import { Header } from "./components/Header";
import { TodoList } from "./TodoList";
import { TodoType } from "./types/Todo";
const App: React.FC = () => {
  const [todos, setTodos] = useState<TodoType[]>(() => {
    const savedTodos = localStorage.getItem("todos");
    try {
      return savedTodos
        ? JSON.parse(savedTodos)
        : [{ text: "Sample Todo", completed: false }];
    } catch (error) {
      return [{ text: "Sample Todo", completed: false }];
    }
  });

  const [inputVal, setInputVal] = useState<string>("");

  const [alert, setAlert] = useState<boolean>(false);
  const [alertText, setAlertText] = useState<string>("");
  const [alertColor, setAlertColor] = useState<boolean>(false);
  const [exists, setExists] = useState<boolean>(false);

  const [xp, setXp] = useState<number>(0);
  const [streak, setStreak] = useState<number>(0);

  const level = Math.floor(xp / 100) + 1;
  const xpProgress = xp % 100;

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

  return (
    <div className="min-h-screen bg-[#0f0f0f] text-green-400 font-mono flex flex-col items-center py-10">
      {/* 🔥 STATS SECTION */}
      <div className="flex justify-between w-full max-w-[500px] mb-4 text-green-400">
        <p>📌 Total: {todos.length}</p>
        <p>✅ Completed: {todos.filter((t) => t.completed).length}</p>
        <p>🔥 Active: {todos.filter((t) => !t.completed).length}</p>
      </div>

      {/* 🎮 LEVEL + XP BAR */}
      <div className="w-full max-w-[500px] mb-6">
        <p className="text-green-400">Level {level}</p>
        <div className="bg-gray-800 h-4 rounded">
          <div
            className="bg-green-400 h-4 rounded transition-all"
            style={{ width: `${xpProgress}%` }}
          />
        </div>
        <p className="text-sm mt-2">{xpProgress}/100 XP</p>
      </div>

      <Header />
      <TodoForm
        inputVal={inputVal}
        setInputVal={setInputVal}
        alert={alert}
        setAlert={setAlert}
        alertText={alertText}
        setAlertText={setAlertText}
        alertColor={alertColor}
        setAlertColor={setAlertColor}
        todos={todos}
        setTodos={setTodos}
        exists={exists}
        setExists={setExists}
      />
      <TodoList
        setInputVal={setInputVal}
        todos={todos}
        setTodos={setTodos}
        setAlert={setAlert}
        setAlertText={setAlertText}
        setAlertColor={setAlertColor}
        setExists={setExists}
        setXp={setXp}
        setStreak={setStreak}
      />
    </div>
  );
};

export default App;
