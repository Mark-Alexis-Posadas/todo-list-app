import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare, faTrash } from "@fortawesome/free-solid-svg-icons";
import { TodoItemType } from "../types/TodoItem";

export default function TodoItem({
  item,
  index,
  handleEdit,
  handleDelete,
  isEditing,
  handleToggleCompleted,
}: TodoItemType) {
  // 🎯 Difficulty badge color
  const getDifficultyColor = () => {
    switch (item.difficulty) {
      case "easy":
        return "border-green-500 text-green-400";
      case "medium":
        return "border-yellow-500 text-yellow-400";
      case "hard":
        return "border-red-500 text-red-400";
      default:
        return "border-green-500 text-green-400";
    }
  };

  return (
    <li
      className={`border rounded p-4 flex flex-col md:flex-row 
      md:items-center justify-between bg-[#111] my-3 transition-all duration-300
      ${
        isEditing
          ? "border-green-400 shadow-[0_0_15px_#00ff88]"
          : "border-green-700 hover:border-green-400 hover:shadow-[0_0_10px_#00ff88]"
      }`}
    >
      {/* LEFT SIDE */}
      <div
        onClick={() => handleToggleCompleted(index)}
        className="cursor-pointer flex flex-col"
      >
        <span
          className={`text-lg transition-all duration-200 ${
            item.completed
              ? "line-through text-green-700 opacity-50"
              : "text-green-300"
          }`}
        >
          {item.text}
        </span>

        {/* Difficulty Badge */}
        <span
          className={`text-xs mt-1 px-2 py-1 border rounded w-fit ${getDifficultyColor()}`}
        >
          {item.difficulty?.toUpperCase()}
        </span>
      </div>

      {/* ACTION BUTTONS */}
      <div className="flex items-center gap-3 mt-4 md:mt-0">
        <button
          className="bg-black border border-blue-500 text-blue-400 
                     hover:bg-blue-500 hover:text-black 
                     transition-all duration-200 px-3 py-2 rounded flex items-center gap-2"
          onClick={() => handleEdit(index)}
        >
          <FontAwesomeIcon icon={faPenToSquare} />
          Edit
        </button>

        <button
          className="bg-black border border-red-500 text-red-400 
                     hover:bg-red-500 hover:text-black 
                     transition-all duration-200 px-3 py-2 rounded flex items-center gap-2"
          onClick={() => handleDelete(index)}
        >
          <FontAwesomeIcon icon={faTrash} />
          Delete
        </button>
      </div>
    </li>
  );
}
