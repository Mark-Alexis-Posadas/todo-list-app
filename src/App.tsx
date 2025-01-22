import { useState, useEffect } from "react";
import { TodoForm } from "./components/TodoForm";
import { Header } from "./components/Header";
import { TodoList } from "./TodoList";

const App: React.FC = () => {
  const [todos, setTodos] = useState<string[]>(() => {
    const savedTodos = localStorage.getItem("todos");
    try {
      return savedTodos ? JSON.parse(savedTodos) : [];
    } catch (error) {
      return [];
    }
  });

  const [inputVal, setInputVal] = useState<string>("");

  const [alert, setAlert] = useState<boolean>(false);
  const [alertText, setAlertText] = useState<string>("");
  const [alertColor, setAlertColor] = useState<boolean>(false);
  const [exists, setExists] = useState<boolean>(false);
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
    <div className="md:max-w-[900px] text-center m-auto">
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
      />
    </div>
  );
};

export default App;
