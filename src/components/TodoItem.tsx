import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare, faTrash } from "@fortawesome/free-solid-svg-icons";
import { TodoItemType } from "../types/TodoItem";
export default function TodoItem({
  item,
  index,
  handleEdit,
  handleDelete,
  isEditing,
}: TodoItemType) {
  return (
    <li
      key={index}
      className={`border ${
        isEditing
          ? "border-green-500 text-green-500 bg-green-50"
          : "border-slate-70"
      } rounded p-2 flex items-start md:items-center justify-between flex-col md:flex-row bg-white my-2`}
    >
      {item}
      <div className="flex items-center gap-3 mt-5 md:mt-0">
        <button
          className="bg-blue-600 text-white rounded p-2 flex items-center justify-center gap-2"
          onClick={() => handleEdit(index)}
        >
          <FontAwesomeIcon icon={faPenToSquare} />
          Edit
        </button>
        <button
          className="bg-red-600 text-white rounded p-2 flex items-center justify-center gap-2"
          onClick={() => handleDelete(index)}
        >
          <FontAwesomeIcon icon={faTrash} />
          Delete
        </button>
      </div>
    </li>
  );
}
